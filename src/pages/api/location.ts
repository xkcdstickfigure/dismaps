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

	// count location updates
	// prevent more than 12 in 6 hours
	let count = await db.location.count({
		where: {
			userId: user.id,
			createdAt: {
				gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 6),
			},
		},
	})
	if (count >= 12) return res.json({})

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
