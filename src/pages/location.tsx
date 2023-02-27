import { Layout } from "@/components/Layout"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next"
import { auth } from "@/lib/auth"
import { user } from "@/types/user"

interface Props {
	user: user
}

export default function Page({ user }: Props) {
	const router = useRouter()

	const requestLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			alert(
				JSON.stringify({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				})
			)
			router.push("/")
		})
	}

	return (
		<Layout user={user}>
			<div className="bg-neutral-900 w-96 mx-auto rounded-md text-center p-8 space-y-8">
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
					className="bg-red-500 w-full rounded-md py-1 text-lg"
				>
					Allow
				</button>
			</div>
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
			user: user && {
				id: user.id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.avatar,
			},
		},
	}
}
