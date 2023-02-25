import { GetServerSideProps } from "next"
import { getProfile } from "@/lib/discord"

export default () => null

const redirectHome = {
	redirect: {
		destination: "/",
		permanent: false,
	},
}

export const getServerSideProps: GetServerSideProps = async ({
	query: { code },
}) => {
	if (typeof code !== "string") return redirectHome

	try {
		let { profile, tokens } = await getProfile(code)
		console.log(`${profile.username}#${profile.discriminator}`)
	} catch (err) {}

	return redirectHome
}
