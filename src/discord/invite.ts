import axios from "axios"

export const getInvite = async (code: string) => {
	let { data } = await axios.get<Invite>(
		"https://discord.com/api/v10/invites/" +
			encodeURIComponent(code) +
			"?with_expiration=true&with_counts=true"
	)

	return data
}

interface Invite {
	code: string
	guild?: {
		id: string
		name: string
		icon: string | null
	}
	expires_at: Date | null
	approximate_member_count: number
	inviter?: {
		id: string
	}
}
