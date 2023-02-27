import { GetServerSideProps } from "next"
import { authUrl } from "@/discord/auth"

export default () => null

export const getServerSideProps: GetServerSideProps = async () => ({
	redirect: {
		permanent: false,
		destination: authUrl,
	},
})
