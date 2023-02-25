import { GetServerSideProps } from "next"
import { authUrl } from "@/lib/discord"

export default () => null

export const getServerSideProps: GetServerSideProps = async () => ({
	redirect: {
		permanent: false,
		destination: authUrl,
	},
})
