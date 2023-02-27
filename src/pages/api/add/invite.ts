import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "@/lib/auth"
import { getInvite } from "@/discord/invite"
import { refreshTokens } from "@/discord/auth"
import db from "@/lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// user
	let user = await auth(req, true)
	if (!user) return res.status(403).send("bad authorization")

	// lookup invite code
	let { code } = req.query
	if (typeof code !== "string") return res.status(400).send("bad request")

	let invite
	try {
		invite = await getInvite(code)
	} catch (err) {
		return res.status(400).send("Failed to access invite link")
	}

	// user must be inviter
	if (user.id !== invite.inviter?.id)
		return res.status(400).send("The invite link must be created by you")

	// invite must not expire
	if (invite.expires_at !== null)
		return res.status(400).send("The invite link must not expire")

	// refresh tokens
	let tokens = await refreshTokens(user.refreshToken)

	// update user
	await db.user.update({
		where: { id: user.id },
		data: {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			tokensRefreshAt: new Date(),
		},
	})

	// response
	res.json({})
}
