import { Icon } from "react-feather"
import classNames from "classnames"
import Link, { LinkProps } from "next/link"

interface Props extends LinkProps {
	icon: Icon
	value: string
	active: boolean
}

export const LinkButton = ({ icon: Icon, value, active, ...props }: Props) => (
	<Link
		className={classNames(
			active ? "bg-neutral-700" : "bg-neutral-700/50",
			"rounded-md",
			"flex",
			"items-center",
			"space-x-2",
			"py-1",
			"px-2"
		)}
		{...props}
	>
		<Icon className="w-4 h-4 text-red-500" />
		<p className="text-sm">{value}</p>
	</Link>
)
