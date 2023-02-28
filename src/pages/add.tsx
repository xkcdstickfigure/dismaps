import { useState, ChangeEventHandler } from "react"
import { Layout } from "@/components/Layout"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import axios from "axios"

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
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [invite, setInvite] = useState<Invite>()

	const lookupInvite: ChangeEventHandler<HTMLInputElement> = (e) => {
		setError(null)

		let value = e.target.value.trim()
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
		<Layout user={user}>
			{invite ? (
				<p>{invite.name}</p>
			) : (
				<>
					<div className="flex items-center space-x-2">
						<h1 className="text-2xl">Invite Link:</h1>
						<input
							autoFocus={true}
							onChange={lookupInvite}
							placeholder="https://discord.gg/123456"
							className="text-2xl bg-transparent text-neutral-400 placeholder-neutral-600 outline-none flex-grow"
						/>

						{loading && <Loading />}
					</div>

					{error && <p className="text-red-500 mt-1">{error}</p>}
				</>
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

const Loading = () => (
	<div className="w-6 h-6 rounded-full border-4 border-neutral-700 border-t-neutral-400 animate-spin" />
)
