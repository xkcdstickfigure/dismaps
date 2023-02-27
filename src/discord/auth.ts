import * as env from "@/env"
import axios from "axios"

const scope = ["email", "guilds", "identify"]

export const authUrl =
	"https://discord.com/api/oauth2/authorize" +
	"?client_id=" +
	env.discordClientId +
	"&redirect_uri=" +
	encodeURIComponent(env.origin + "/auth/callback") +
	"&response_type=code" +
	"&scope=" +
	encodeURIComponent(scope.join(" "))

export const getProfile = async (
	code: string
): Promise<{ profile: Profile; tokens: Tokens }> => {
	// get tokens
	let values = new FormData()
	values.set("client_id", env.discordClientId)
	values.set("client_secret", env.discordClientSecret)
	values.set("redirect_uri", env.origin + "/auth/callback")
	values.set("grant_type", "authorization_code")
	values.set("code", code)

	let { data: tokens } = await axios.post<Tokens>(
		"https://discord.com/api/v10/oauth2/token",
		values,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}
	)

	// compare scope
	if (tokens.scope.split(" ").sort().join(" ") !== scope.join(" "))
		throw new Error("invalid scope")

	// get profile
	let { data: profile } = await axios.get<Profile>(
		"https://discord.com/api/v10/users/@me",
		{
			headers: {
				Authorization: "Bearer " + tokens.access_token,
			},
		}
	)

	return { profile, tokens }
}

interface Tokens {
	access_token: string
	refresh_token: string
	token_type: string
	scope: string
	expires_in: number
}

interface Profile {
	id: string
	username: string
	discriminator: string
	avatar: string // TODO: this is nullable
	email: string
	verified: boolean
}
