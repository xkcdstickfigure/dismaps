import { useState } from "react"
import { Layout } from "@/components/Layout"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import { ChangeEventHandler } from "react"
import axios from "axios"

interface Props {
	user: user
	token: string
}

export default function Page({ user, token }: Props) {
	const [error, setError] = useState<string | null>(null)

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
				axios
					.get("/api/add/invite?code=" + encodeURIComponent(code), {
						headers: {
							Authorization: "Bearer " + token,
						},
					})
					.then(({ data }) => {
						console.log(data)
					})
					.catch((err) => {
						let message: string | undefined = err.response?.data
						setError(message || "Something went wrong.")
					})
			}
		}
	}

	return (
		<Layout user={user}>
			<div className="flex space-x-2">
				<h1 className="text-2xl">Invite Link:</h1>
				<input
					autoFocus={true}
					onChange={lookupInvite}
					placeholder="https://discord.gg/123456"
					className="text-2xl bg-transparent text-neutral-400 placeholder-neutral-600 outline-none flex-grow"
				/>
			</div>

			{error && <p className="text-red-500 mt-1">{error}</p>}
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
