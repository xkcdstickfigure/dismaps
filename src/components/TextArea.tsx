import { DetailedHTMLProps, TextareaHTMLAttributes } from "react"

interface Props
	extends DetailedHTMLProps<
		TextareaHTMLAttributes<HTMLTextAreaElement>,
		HTMLTextAreaElement
	> {
	label: string
}

export const TextArea = ({ label, ...props }: Props) => (
	<label className="block bg-neutral-900/25 border border-neutral-900/25 pt-2 rounded-md">
		<p className="text-sm font-medium-400 mx-4">{label}</p>
		<textarea
			className="bg-transparent w-full px-4 pb-2 text-lg placeholder-neutral-400 outline-none resize-none h-32"
			{...props}
		/>
	</label>
)
