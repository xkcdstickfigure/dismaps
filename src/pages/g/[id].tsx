import { Layout } from "@/components/Layout"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import db from "@/lib/prisma"
import { GuildLabel } from "@/components/Guild"
import { User as MembersIcon, Hash as TopicIcon } from "react-feather"
import { useRouter } from "next/router"
import axios from "axios"

interface Props {
	user: user | null
	token: string
	guild: {
		id: string
		name: string
		tagline: string
		icon: string
		members: number
		topics: string[]
		description: string
		month: number
		year: number
	}
}

export default function Page({ user, token, guild }: Props) {
	const router = useRouter()

	const joinGuild = () => {
		if (!user) router.push("/auth")
		else
			axios
				.post<{ invite: string }>(
					"/api/join",
					{ id: guild.id },
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				)
				.then(({ data: { invite } }) => (location.href = invite))
				.catch(() => {})
	}

	return (
		<Layout title={guild.name} user={user} className="space-y-4">
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

			<p className="whitespace-pre-wrap leading-loose bg-neutral-900/25 border border-neutral-900/25 py-2 px-4 rounded-md">
				{guild.description
					.split("\n")
					.map((l) => l.trim())
					.filter((l) => !!l)
					.join("\n")}
			</p>

			<div className="flex items-center justify-between">
				<p className="text-xs text-neutral-400">
					This server was added in{" "}
					<span className="text-white font-medium">
						{
							[
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December",
							][guild.month]
						}{" "}
						{guild.year}
					</span>
				</p>

				<button
					onClick={() => joinGuild()}
					className="bg-red-500 rounded-md py-1 px-4 text-md"
				>
					Join
				</button>
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
			token: user?.token || "",
			guild: {
				id: guild.id,
				name: guild.name,
				tagline: guild.tagline,
				icon: guild.icon,
				members: guild.members,
				topics: guild.topics,
				description: guild.description,
				month: guild.createdAt.getMonth(),
				year: guild.createdAt.getFullYear(),
			},
		},
	}
}
