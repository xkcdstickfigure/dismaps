import axios from "axios"

export const getGuilds = async (accessToken: string) => {
	let { data } = await axios.get<Guild[]>(
		"https://discord.com/api/v10/users/@me/guilds",
		{
			headers: {
				Authorization: "Bearer " + accessToken,
			},
		}
	)

	return data
}

interface Guild {
	id: string
	name: string
	icon: string | null
	owner: boolean
}
