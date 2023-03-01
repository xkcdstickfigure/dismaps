import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "@/lib/auth"
import { getInvite } from "@/discord/invite"
import { refreshTokens } from "@/discord/auth"
import { getGuilds } from "@/discord/guilds"
import db from "@/lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// user
	let user = await auth(req, true)
	if (!user) return res.status(403).send("bad authorization")

	// body
	let { code } = req.body
	if (typeof code !== "string") return res.status(400).send("invalid body")

	// lookup invite code
	let invite
	try {
		invite = await getInvite(code)
	} catch (err) {
		return res.status(400).send("That invite link doesn't seem to work")
	}

	// user must be inviter
	if (user.id !== invite.inviter?.id)
		return res.status(400).send("The invite link must be created by you")

	// invite must not expire
	if (invite.expires_at !== null)
		return res.status(400).send("The invite link must not expire")

	// guild must have icon
	if (!invite.guild?.icon)
		return res.status(400).send("The server must have an icon")

	// refresh tokens
	let tokens
	try {
		tokens = await refreshTokens(user.refreshToken)
	} catch (err) {
		return res
			.status(400)
			.send("Failed to access your account. Try signing in again.")
	}

	// update user
	await db.user.update({
		where: { id: user.id },
		data: {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			tokensRefreshAt: new Date(),
		},
	})

	// get guild from user's perspective
	let guilds = await getGuilds(tokens.access_token)
	let guildId = invite.guild.id
	let guild = guilds.filter((g) => g.id === guildId)[0]
	if (!guild) return res.status(400).send("You must be a member of the server")
	if (!guild.owner)
		return res.status(400).send("You must be the owner of the server")

	// create guildAdd
	await db.guildAdd.upsert({
		where: {
			id: guild.id,
		},
		create: {
			id: guild.id,
			name: guild.name,
			icon: guild.icon,
			invite: invite.code,
			members: invite.approximate_member_count,
			ownerId: user.id,
		},
		update: {
			name: guild.name,
			icon: guild.icon,
			invite: invite.code,
			members: invite.approximate_member_count,
			createdAt: new Date(),
			ownerId: user.id,
		},
	})

	// response
	res.json({
		id: guild.id,
		name: guild.name,
		icon: guild.icon,
		members: invite.approximate_member_count,
	})
}
