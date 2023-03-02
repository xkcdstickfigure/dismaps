import { Layout } from "@/components/Layout"
import { Guild } from "@/components/Guild"
import { Map as MapIcon, Plus as PlusIcon } from "react-feather"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import db from "@/lib/prisma"
import Link from "next/link"

interface Props {
	user: user | null
	name: string
	guilds?: {
		id: string
		name: string
		tagline: string
		icon: string
		members: number
		topics: string[]
	}[]
}

export default function Page({ user, name, guilds = [] }: Props) {
	return (
		<Layout
			title={"Top Discord Servers in " + name}
			user={user}
			className="space-y-4"
		>
			<h1 className="text-2xl font-medium">Top Discord Servers in {name}</h1>
			{guilds.length > 0 ? (
				<div className="space-y-2">
					{guilds.map((g) => (
						<Guild key={g.id} {...g} />
					))}
				</div>
			) : (
				<div className="space-y-4 text-center">
					<MapIcon
						className="w-48 h-48 text-neutral-400 mx-auto"
						strokeWidth={1.5}
					/>

					<div className="space-y-1">
						<p className="text-2xl font-semibold">
							You're in uncharted territory!
						</p>
						<p className="text-sm text-neutral-400">
							We don't have any servers in {name}, why not add your own?
						</p>
					</div>

					<div className="flex justify-center">
						<Link
							href="/add"
							className={
								"bg-neutral-700/50 hover:bg-neutral-700 rounded-md flex items-center space-x-1 py-1 pl-2 pr-4"
							}
						>
							<PlusIcon className="w-8 h-8 text-red-500" strokeWidth={1.5} />
							<p className="text-lg">Add Server</p>
						</Link>
					</div>
				</div>
			)}
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
	params,
	req,
}) => {
	// auth
	let user = await auth(req)

	// get place
	let slug = params?.slug
	if (typeof slug !== "string") return { notFound: true }
	let place = await db.place.findUnique({ where: { slug } })
	if (!place) return { notFound: true }

	// get nearby guilds
	let guilds = await db.guild.findMany({
		where: {
			lat: {
				gte: place.lat1,
				lte: place.lat2,
			},
			lon: {
				gte: place.lon1,
				lte: place.lon2,
			},
		},
		orderBy: { members: "desc" },
		take: 20,
	})

	// return
	return {
		props: {
			user: user
				? {
						id: user.id,
						username: user.username,
						discriminator: user.discriminator,
						avatar: user.avatar,
				  }
				: null,
			name: place.name,
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
