import db from "./prisma"
import { IncomingMessage } from "http"
import { NextApiRequestCookies } from "next/dist/server/api-utils"

export const auth = async (
	req: IncomingMessage & {
		cookies: NextApiRequestCookies
	},
	useHeader: boolean = false
) => {
	// token
	let token
	if (useHeader) {
		let header = req.headers.authorization
		if (header?.startsWith("Bearer ")) token = header.substring(7)
	} else {
		token = req.cookies["dm-token"]
	}
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
	return { token, ...session.user }
}
