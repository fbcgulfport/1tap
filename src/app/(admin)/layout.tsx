import Image from "next/image"
import { redirect } from "next/navigation"
import { checkAuth } from "~/lib/auth-helpers"
import { env } from "~/lib/env"
import { LogoutButton } from "./LogoutButton"

export default async function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await checkAuth()

	if (!session) {
		redirect("/login")
	}

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border px-5 py-1 flex flex-row justify-between items-center">
				<div className="flex items-center">
					<Image
						src={env.LOGO_URL}
						alt={`${env.PRODUCT_NAME} Logo`}
						width={40}
						height={40}
						className="size-10"
					/>
					<span className="text-primary-foreground font-bold text-lg">
						{env.PRODUCT_NAME} Admin Panel
					</span>
				</div>
				<div className="flex items-center gap-3">
					{session.user.image && (
						<Image
							src={session.user.image}
							alt={session.user.name}
							width={32}
							height={32}
							className="size-8 rounded-full"
						/>
					)}
					<span className="text-sm">{session.user.name}</span>
					<LogoutButton />
				</div>
			</header>
			<main className="flex-1 pt-20 mb-6 w-full flex flex-col items-center">
				{children}
			</main>
		</>
	)
}
