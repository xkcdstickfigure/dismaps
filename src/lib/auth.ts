import db from "./prisma"
import { IncomingMessage } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"

export const auth = async (
	req: IncomingMessage & {
		cookies: NextApiRequestCookies
	}
) => {
	// token
	let token = req.cookies["dm-token"]
	if (!token) return null

	// get session
	let session = await db.session.findUnique({
		where: { token },
		include: {
			user: true,
		},
	})
	if (!session) return null

	// update session
	await db.session.update({
		where: {
			id: session.id,
		},
		data: {
			usedAt: new Date(),
		},
	})

	// return
	return session.user
}
