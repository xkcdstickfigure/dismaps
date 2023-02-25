import Link from "next/link"
import { Icon, User as MembersIcon, Hash as TopicIcon } from "react-feather"

interface Props {
	id: string
	name: string
	tagline: string
	icon: string
	members: number
	topics: string[]
}

export const Guild = ({ id, name, tagline, icon, members, topics }: Props) => (
	<Link href={`/g/${id}`} className="flex space-x-4 items-center">
		<img
			src={`https://cdn.discordapp.com/icons/${id}/${icon}.png?size=96`}
			className="w-24 h-24 rounded-md"
		/>

		<div className="space-y-2">
			<div>
				<p className="text-lg">{name}</p>
				<p className="text-sm text-neutral-400">{tagline}</p>
			</div>

			<div className="flex space-x-2">
				<GuildLabel icon={MembersIcon} value={members.toString()} />
				{topics.map((topic) => (
					<GuildLabel key={topic} icon={TopicIcon} value={topic} />
				))}
			</div>
		</div>
	</Link>
)

interface GuildLabelProps {
	icon: Icon
	value: string
}

const GuildLabel = ({ icon: Icon, value }: GuildLabelProps) => (
	<div className="bg-red-500/10 rounded-md flex items-center space-x-2 py-1 px-2">
		<Icon className="w-4 h-4 text-red-500" />
		<p className="text-sm">{value}</p>
	</div>
)
