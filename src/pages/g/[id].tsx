import { Layout } from "@/components/Layout"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import db from "@/lib/prisma"
import { GuildLabel } from "@/components/Guild"
import { User as MembersIcon, Hash as TopicIcon } from "react-feather"

interface Props {
	user: user | null
	guild: {
		id: string
		name: string
		tagline: string
		icon: string
		members: number
		topics: string[]
		description: string
	}
}

export default function Page({ user, guild }: Props) {
	return (
		<Layout title={guild.name} user={user}>
			<div className="space-y-8">
				<div className="flex space-x-4 items-center">
					<img
						src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=96`}
						className="w-24 h-24 rounded-md"
					/>

					<div className="space-y-2">
						<div>
							<p className="text-lg">{guild.name}</p>
							<p className="text-sm text-neutral-400">{guild.tagline}</p>
						</div>

						<div className="flex space-x-2">
							<GuildLabel icon={MembersIcon} value={guild.members.toString()} />
							{guild.topics.map((topic) => (
								<GuildLabel key={topic} icon={TopicIcon} value={topic} />
							))}
						</div>
					</div>
				</div>

				<p className="whitespace-pre">{guild.description}</p>
			</div>
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
	params,
	req,
}) => {
	// auth
	let user = await auth(req)

	// get guild
	let id = params?.id
	if (typeof id !== "string") return { notFound: true }
	let guild = await db.guild.findUnique({ where: { id } })
	if (!guild) return { notFound: true }

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
			guild: {
				id: guild.id,
				name: guild.name,
				tagline: guild.tagline,
				icon: guild.icon,
				members: guild.members,
				topics: guild.topics,
				description: guild.description,
			},
		},
	}
}
