import { Icon } from "react-feather"
import clsx from "clsx"
import Link, { LinkProps } from "next/link"

interface Props extends LinkProps {
	icon: Icon
	value: string
	active?: boolean
}

export const LinkButton = ({
	icon: Icon,
	value,
	active = false,
	...props
}: Props) => (
	<Link
		className={clsx(
			active ? "bg-neutral-700" : "bg-neutral-700/50",
			"hover:bg-neutral-700",
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
