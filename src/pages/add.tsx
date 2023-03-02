import {
	useState,
	Dispatch,
	SetStateAction,
	DetailedHTMLProps,
	ButtonHTMLAttributes,
} from "react"
import { Layout } from "@/components/Layout"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import axios from "axios"
import { GuildLabel } from "@/components/Guild"
import { User as MembersIcon, Hash as TopicIcon } from "react-feather"
import { Input } from "@/components/Input"
import { TextArea } from "@/components/TextArea"
import clsx from "clsx"
import { topics as availableTopics } from "@/data/topics"
import { useRouter } from "next/router"

interface Props {
	user: user
	token: string
}

interface Invite {
	id: string
	name: string
	icon: string
	members: number
}

export default function Page({ user, token }: Props) {
	const [invite, setInvite] = useState<Invite>()

	return (
		<Layout title="Add your server" user={user}>
			{invite ? (
				<GuildForm token={token} invite={invite} />
			) : (
				<InviteForm token={token} setInvite={setInvite} />
			)}
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
	req,
}) => {
	let user = await auth(req)
	if (!user)
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}

	return {
		props: {
			user: {
				id: user.id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.avatar,
			},
			token: user.token,
		},
	}
}

interface InviteFormProps {
	token: string
	setInvite: Dispatch<SetStateAction<Invite | undefined>>
}

const InviteForm = ({ token, setInvite }: InviteFormProps) => {
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const lookupInvite = (value: string) => {
		setError("")

		if (
			value.startsWith("https://discord.com/invite/") ||
			value.startsWith("https://discord.gg/")
		) {
			let split = value.split("/")
			let code = split[split.length - 1]
			if (code) {
				setLoading(true)
				axios
					.post<Invite>(
						"/api/add/invite",
						{ code },
						{
							headers: {
								Authorization: "Bearer " + token,
							},
						}
					)
					.then(({ data }) => setInvite(data))
					.catch((err) => {
						let message: string | undefined = err.response?.data
						setError(message || "Something went wrong.")
						setLoading(false)
					})
			}
		}
	}

	return (
		<div className="space-y-1">
			<Input
				label="Invite Link"
				autoFocus={true}
				onChange={(e) => lookupInvite(e.target.value.trim())}
				placeholder="https://discord.gg/123456"
				loading={loading}
			/>

			{error && <p className="text-red-500">{error}</p>}
		</div>
	)
}

interface GuildFormProps {
	token: string
	invite: Invite
}

const GuildForm = ({
	token,
	invite: { id, name, icon, members },
}: GuildFormProps) => {
	const [tagline, setTagline] = useState("")
	const [description, setDescription] = useState("")
	const [topics, setTopics] = useState<string[]>([])
	const [error, setError] = useState("")
	const router = useRouter()

	const addGuild = () => {
		setError("")
		axios
			.post<{ id: string }>(
				"/api/add/complete",
				{ id, tagline, description, topics },
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			)
			.then(({ data: { id } }) => router.push("/g/" + id))
			.catch((err) => {
				let message: string | undefined = err.response?.data
				setError(message || "Something went wrong.")
			})
	}

	return (
		<div className="space-y-4">
			<div className="flex space-x-4 items-center">
				<img
					src={`https://cdn.discordapp.com/icons/${id}/${icon}.png?size=96`}
					className="w-24 h-24 rounded-md"
				/>

				<div className="space-y-2">
					<div>
						<p className="text-lg">{name}</p>
						<p className="text-sm text-neutral-400">
							{tagline || "Your tagline goes here..."}
						</p>
					</div>

					<div className="flex space-x-2">
						<GuildLabel icon={MembersIcon} value={members.toString()} />
						{topics.map((topic) => (
							<GuildLabel key={topic} icon={TopicIcon} value={topic} />
						))}
					</div>
				</div>
			</div>

			<Input
				label="Tagline"
				placeholder="Enter your tagline"
				maxLength={48}
				onChange={(e) => setTagline(e.target.value.trim())}
			/>

			<TextArea
				label="Description"
				placeholder="Enter your description"
				onChange={(e) => setDescription(e.target.value)}
			/>

			<div className="flex flex-wrap gap-2">
				{availableTopics.map((topic) => (
					<Topic
						key={topic}
						value={topic}
						active={topics.includes(topic)}
						onClick={() => {
							if (topics.includes(topic))
								setTopics(topics.filter((t) => t !== topic))
							else setTopics([...topics.splice(-2), topic])
						}}
					/>
				))}
			</div>

			<button
				onClick={() => addGuild()}
				className="bg-red-500 w-full rounded-md py-2 text-lg"
			>
				Add Server
			</button>

			<p className="text-sm text-neutral-400 text-center">
				This server will be visible to people in the same area as you, but they
				won't be able to access your precise location. You won't be able to
				change this information later.
			</p>

			{error && <p className="text-red-500 text-center">{error}</p>}
		</div>
	)
}

interface TopicProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	value: string
	active: boolean
}

const Topic = ({ active, value, ...props }: TopicProps) => (
	<button
		className={clsx(
			active ? "bg-neutral-700" : "bg-neutral-700/50",
			"hover:bg-neutral-700",
			"rounded-md",
			"flex",
			"items-center",
			"space-x-2",
			"py-1",
			"px-2"
		)}
		{...props}
	>
		<TopicIcon className="w-4 h-4 text-red-500" />
		<p className="text-sm">{value}</p>
	</button>
)
