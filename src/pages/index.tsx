import { Layout } from "@/components/Layout"
import { Guild } from "@/components/Guild"
import { LinkButton } from "@/components/LinkButton"
import {
	MapPin as PinIcon,
	Users as PopularIcon,
	Clock as RecentIcon,
} from "react-feather"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import { square } from "@/lib/coords"
import db from "@/lib/prisma"

const distances = [10, 20, 50]

interface Props {
	user: user | null
	distance: number
	sortNew: boolean
	guilds?: {
		id: string
		name: string
		tagline: string
		icon: string
		members: number
		topics: string[]
	}[]
}

export default function Page({ user, distance, sortNew, guilds = [] }: Props) {
	return (
		<Layout user={user}>
			<div className="space-y-4">
				<div className="flex justify-between">
					<div className="flex space-x-2">
						{distances.map((d) => (
							<LinkButton
								key={d}
								icon={PinIcon}
								value={d + " km"}
								active={distance === d}
								href={`/?distance=${d}${sortNew ? "&sort=new" : ""}`}
							/>
						))}
					</div>

					<div className="flex space-x-2">
						<LinkButton
							icon={PopularIcon}
							value="Popular"
							active={!sortNew}
							href={`/?distance=${distance}`}
						/>

						<LinkButton
							icon={RecentIcon}
							value="Recent"
							active={sortNew}
							href={`/?distance=${distance}&sort=new`}
						/>
					</div>
				</div>

				{user ? (
					<div className="space-y-2">
						{guilds.map((g) => (
							<Guild key={g.id} {...g} />
						))}
					</div>
				) : (
					<p>You'll need to sign in to see nearby communities</p>
				)}
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
	query,
	req,
}) => {
	// query params
	let sortNew = query.sort === "new"
	let distance = Number(query.distance)
	if (!distances.includes(distance)) distance = 10

	// auth
	let user = await auth(req)
	if (!user)
		return {
			props: {
				user: null,
				distance,
				sortNew,
			},
		}

	// require location
	if (
		!user.locationUpdatedAt ||
		new Date().getTime() - user.locationUpdatedAt.getTime() > 1000 * 60 * 60
	)
		return {
			redirect: {
				permanent: false,
				destination: "/location",
			},
		}

	// get nearby guilds
	let area = square(Number(user.lat), Number(user.lon), distance)
	let guilds = await db.guild.findMany({
		where: {
			lat: {
				gte: area.lat1,
				lte: area.lat2,
			},
			lon: {
				gte: area.lon1,
				lte: area.lon2,
			},
		},
		orderBy: sortNew ? { createdAt: "desc" } : { members: "desc" },
		take: 20,
	})

	// return
	return {
		props: {
			user: {
				id: user.id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.avatar,
			},
			distance,
			sortNew,
			guilds: guilds.map((g) => ({
				id: g.id,
				name: g.name,
				tagline: g.tagline,
				icon: g.icon,
				members: g.members,
				topics: g.topics,
			})),
		},
	}
}
