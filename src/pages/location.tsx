import { Layout } from "@/components/Layout"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"
import axios from "axios"
import { useState } from "react"
import clsx from "clsx"

interface Props {
	user: user
	token: string
}

export default function Page({ user, token }: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const requestLocation = () => {
		if (loading) return
		setLoading(true)

		navigator.geolocation.getCurrentPosition(
			(position) => {
				axios
					.post(
						"/api/location",
						{
							lat: position.coords.latitude,
							lon: position.coords.longitude,
						},
						{
							headers: {
								Authorization: "Bearer " + token,
							},
						}
					)
					.then(() => router.push("/"))
					.catch(() => setLoading(false))
			},
			() => setLoading(false)
		)
	}

	return (
		<Layout
			user={user}
			className="bg-neutral-900 w-96 max-w-full mx-auto rounded-md text-center p-8 space-y-8"
		>
			<div className="space-y-2">
				<h1 className="text-xl font-medium">Dismaps needs location access</h1>

				<div className="text-neutral-400 text-sm space-y-2">
					<p>Dismaps shows you servers with people nearby.</p>
					<p>
						It's not visible to other users, and we won't share it with third
						parties.
					</p>
				</div>
			</div>

			<button
				onClick={requestLocation}
				className={clsx(
					loading ? "bg-neutral-700" : "bg-red-500",
					loading && "text-neutral-400",
					"w-full",
					"rounded-md",
					"py-2",
					"text-lg"
				)}
			>
				Allow
			</button>
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
