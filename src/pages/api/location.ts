import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "@/lib/auth"
import db from "@/lib/prisma"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// user
	let user = await auth(req, true)
	if (!user) return res.status(403).send("bad authorization")

	// body
	let { lat, lon } = req.body
	if (typeof lat !== "number" || typeof lon !== "number")
		return res.status(400).send("invalid body")

	// create location
	await db.location.create({
		data: {
			lat,
			lon,
			userId: user.id,
		},
	})

	// update user
	await db.user.update({
		where: { id: user.id },
		data: {
			lat,
			lon,
			locationUpdatedAt: new Date(),
		},
	})

	// response
	res.json({})
}
