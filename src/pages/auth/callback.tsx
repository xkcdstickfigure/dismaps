import { GetServerSideProps } from "next"
import { getProfile } from "@/lib/discord"
import db from "@/lib/prisma"
import crypto from "crypto"
import Cookies from "cookies"

export default () => null

const redirectHome = {
	redirect: {
		destination: "/",
		permanent: false,
	},
}

export const getServerSideProps: GetServerSideProps = async ({
	query: { code },
	req,
	res,
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

		// create session
		let address = req.headers["x-forwarded-for"]
		let session = await db.session.create({
			data: {
				token: crypto.randomBytes(32).toString("hex"),
				address:
					typeof address === "string"
						? address
						: typeof address === "object"
						? address[0]
						: req.socket.remoteAddress || "",
				userAgent: req.headers["user-agent"] || "",
				userId: user.id,
			},
		})

		// set cookies
		let cookies = new Cookies(req, res)
		cookies.set("dm-token", session.token, {
			maxAge: 365 * 24 * 60 * 60 * 1000,
		})
	} catch (err) {}

	return redirectHome
}
