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

const distances = [10, 20, 50]

interface Props {
	user: user | null
	distance: number
	sortNew: boolean
}

export default function Page({ user, distance, sortNew }: Props) {
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
						<Guild
							id="1077341721337266206"
							name="Londoncraft"
							tagline="Let's reconstruct London in Minecraft!"
							icon="38c2e8368fd84c336e6b30e94a01d5c9"
							members={247}
							topics={["minecraft"]}
						/>

						<Guild
							id="1078072710699167814"
							name="Walthamstow Central"
							tagline="A chill place for Walthamstowers to hang out"
							icon="196af69d8554ab510126e66172c93c89"
							members={84}
							topics={["social"]}
						/>
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
		},
	}
}
