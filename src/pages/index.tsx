import { Guild } from "@/components/Guild"
import { Layout } from "@/components/Layout"

export default function Page() {
	return (
		<Layout>
			<div className="space-y-2">
				<Guild
					id="1077341721337266206"
					name="Londoncraft"
					tagline="Let's reconstruct London in Minecraft!"
					icon="38c2e8368fd84c336e6b30e94a01d5c9"
					members={247}
					topics={["minecraft"]}
				/>

				<Guild
					id="1078072710699167814"
					name="Walthamstow Central"
					tagline="A chill place for Walthamstowers to hang out"
					icon="196af69d8554ab510126e66172c93c89"
					members={84}
					topics={["social"]}
				/>
			</div>
		</Layout>
	)
}
