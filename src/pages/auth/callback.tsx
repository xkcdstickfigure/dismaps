import { GetServerSideProps } from "next"
import { getProfile } from "@/lib/discord"
import db, { prisma } from "@/lib/prisma"

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
		// get profile from code
		let { profile, tokens } = await getProfile(code)

		// create user
		let user = await db.user.upsert({
			where: {
				id: profile.id,
			},
			create: {
				id: profile.id,
				username: profile.username,
				discriminator: profile.discriminator,
				avatar: profile.avatar,
				email: profile.email,
				emailVerified: profile.verified,
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
			},
			update: {
				username: profile.username,
				discriminator: profile.discriminator,
				avatar: profile.avatar,
				email: profile.email,
				emailVerified: profile.verified,
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
			},
		})

		console.log(user)
	} catch (err) {}

	return redirectHome
}
