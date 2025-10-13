import { Link } from "lucide-react"
import { ShieldIcon } from "lucide-react"
import Image from "next/image"
import { env } from "~/lib/env"

export default function MainLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border px-5 py-1 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0">
				<div className="flex items-center">
					<Image
						src={env.LOGO_URL}
						alt={`${env.PRODUCT_NAME} Logo`}
						width={40}
						height={40}
						className="size-10"
					/>
					<span className="text-primary-foreground font-bold text-lg">
						{env.PRODUCT_NAME}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<Link href="/admin">
						<ShieldIcon className="size-4" />
					</Link>
				</div>
			</header>
			<main className="flex-1 pt-20 mb-6 w-full flex flex-col items-center">
				{children}
			</main>
		</>
	)
}
