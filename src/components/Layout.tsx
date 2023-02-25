import { ReactNode } from "react"
import Head from "next/head"
import Link from "next/link"

interface LayoutProps {
	title?: string
	description?: string
	children: ReactNode
}

export const Layout = ({
	title,
	description = "Find Discord servers with people near you!",
	children,
}: LayoutProps) => (
	<>
		<Head>
			<title>{title ? title + " - " : ""}Dismaps</title>
			<meta name="description" content={description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</Head>

		<header className="max-w-4xl mx-auto px-8 h-16 flex justify-between items-center text-lg">
			<Link href="/">
				<h1 className="font-semibold">Dismaps</h1>
			</Link>

			<div className="flex items-center space-x-2">
				<p>
					xkcd<span className="text-neutral-400 text-sm">#7671</span>
				</p>

				<img
					src="https://cdn.discordapp.com/avatars/409676977247617034/e83f92ded0084da28b92b04427f2b025.png?size=64"
					className="w-8 h-8 rounded-md"
				/>
			</div>
		</header>

		<main className="max-w-2xl mx-auto px-8">{children}</main>
	</>
)
