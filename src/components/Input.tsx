import { DetailedHTMLProps, InputHTMLAttributes } from "react"

interface Props
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string
}

export const Input = ({ label, ...props }: Props) => (
	<label className="block bg-neutral-900/25 border border-neutral-900/25 pt-2 rounded-md">
		<p className="text-sm font-medium-400 mx-4">{label}</p>
		<input
			className="bg-transparent w-full px-4 pb-2 text-lg placeholder-neutral-400 outline-none"
			{...props}
		/>
	</label>
)
