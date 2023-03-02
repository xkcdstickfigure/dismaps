import { DetailedHTMLProps, InputHTMLAttributes } from "react"

interface Props
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string
	loading?: boolean
}

export const Input = ({ label, loading = false, ...props }: Props) => (
	<label className="block bg-neutral-900/25 border border-neutral-900/25 pt-2 rounded-md">
		<p className="text-sm font-medium-400 mx-4">{label}</p>
		<div className="flex">
			<input
				className="bg-transparent w-full px-4 pb-2 text-lg placeholder-neutral-400 outline-none"
				{...props}
			/>

			{loading && <Loading />}
		</div>
	</label>
)

const Loading = () => (
	<div className="w-6 h-6 rounded-full border-4 border-neutral-700 border-t-neutral-400 animate-spin mr-4" />
)
