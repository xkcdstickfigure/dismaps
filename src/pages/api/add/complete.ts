import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "@/lib/auth"
import { topics as availableTopics } from "@/data/topics"
import db from "@/lib/prisma"
import { calcLat, calcLon } from "@/lib/coords"

export default async (req: NextApiRequest, res: NextApiResponse) => {
	// user
	let user = await auth(req, true)
	if (!user) return res.status(403).send("bad authorization")

	// body
	let { id, tagline, description, topics } = req.body
	if (
		typeof id !== "string" ||
		typeof tagline !== "string" ||
		typeof description !== "string" ||
		typeof topics !== "object" ||
		topics.constructor !== Array
	)
		return res.status(400).send("invalid body")

	// tagline
	tagline = tagline.trim()
	if (!tagline) return res.status(400).send("Tagline is required")
	if (tagline.length > 48) return res.status(400).send("Tagline is too long")

	// description
	description = description.trim()
	if (!description) return res.status(400).send("Description is required")
	if (description.length > 1024)
		return res.status(400).send("Description is too long")

	// topics
	topics = Array.from(new Set(topics))
	if (
		topics.length > 3 ||
		!topics.every(
			(t: any) => typeof t === "string" && availableTopics.includes(t)
		)
	)
		return res.status(400).send("invalid topics")

	// get guildAdd
	let guildAdd = await db.guildAdd.findUnique({ where: { id } })
	if (!guildAdd || guildAdd.ownerId !== user.id)
		return res.status(400).send("invalid guild")

	// require location
	if (
		!user.locationUpdatedAt ||
		new Date().getTime() - user.locationUpdatedAt.getTime() > 1000 * 60 * 60 ||
		!user.lat ||
		!user.lon
	)
		return res.status(400).send("You need to have a location set")

	// random location offset:
	// this prevents users manipulating their selection area
	// to determine the precise location of the guild owner
	let lat = calcLat(Number(user.lat), Math.random() * 4 - 2)
	let lon = calcLon(Number(user.lon), Math.random() * 4 - 2, lat)

	// create guild
	let guild
	try {
		guild = await db.guild.create({
			data: {
				id: guildAdd.id,
				name: guildAdd.name,
				tagline,
				icon: guildAdd.icon,
				description,
				members: guildAdd.members,
				topics,
				invite: guildAdd.invite,
				lat,
				lon,
				ownerId: user.id,
			},
		})
	} catch (err) {
		return res.status(400).send("This server has already been added")
	}

	res.json({ id: guild.id })
}
