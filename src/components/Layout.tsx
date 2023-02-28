import { ReactNode } from "react"
import Head from "next/head"
import Link from "next/link"
import { user } from "@/types/user"
import { LinkButton } from "./LinkButton"
import { Plus as PlusIcon } from "react-feather"

interface LayoutProps {
	title?: string
	description?: string
	user: user | null
	children: ReactNode
}

export const Layout = ({
	title,
	description = "Find Discord servers with people near you!",
	user,
	children,
}: LayoutProps) => (
	<>
		<Head>
			<title>{`${title ? title + " - " : ""}Dismaps`}</title>
			<meta name="description" content={description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</Head>

		<div className="max-w-2xl mx-auto px-8">
			<header className="mx-auto h-16 flex justify-between items-center text-lg">
				<div className="flex items-center space-x-4">
					<Link href="/">
						<h1 className="font-semibold">Dismaps</h1>
					</Link>

					<LinkButton
						icon={PlusIcon}
						value="Add Server"
						href={user ? "/add" : "/auth"}
					/>
				</div>

				{user ? (
					<div className="flex items-center space-x-2">
						<p>
							{user.username}
							<span className="text-neutral-400 text-sm">
								#{user.discriminator}
							</span>
						</p>

						<img
							src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
							className="w-8 h-8 rounded-md"
						/>
					</div>
				) : (
					<Link href="/auth">Sign in</Link>
				)}
			</header>

			{children}
		</div>
	</>
)
