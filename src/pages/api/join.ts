import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "@/lib/auth"
import db from "@/lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// user
	let user = await auth(req, true)
	if (!user) return res.status(403).send("bad authorization")

	// body
	let { id } = req.body
	if (typeof id !== "string") return res.status(400).send("invalid body")

	// get guild
	let guild = await db.guild.findUnique({ where: { id } })
	if (!guild) return res.status(400).send("invalid guild")

	// create join
	let join
	try {
		join = await db.join.create({
			data: {
				userId: user.id,
				guildId: guild.id,
			},
		})
	} catch (err) {}

	// increment member count
	if (user.id !== guild.ownerId && join)
		await db.guild.update({
			where: { id: guild.id },
			data: {
				members: {
					increment: 1,
				},
			},
		})

	// response
	res.json({ invite: "https://discord.com/invite/" + guild.invite })
}
