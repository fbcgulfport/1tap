import { Inter } from "next/font/google"
import "~/styles/globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { env } from "~/lib/env"

const inter = Inter({
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: env.PRODUCT_NAME,
	icons: {
		icon: env.LOGO_URL,
		shortcut: env.LOGO_URL,
		apple: env.LOGO_URL
	},
	openGraph: {
		title: env.PRODUCT_NAME,
		images: [env.LOGO_URL],
		type: "website"
	},
	twitter: {
		card: "summary",
		title: env.PRODUCT_NAME,
		images: [env.LOGO_URL]
	}
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const headersList = await headers()
	const pathname = headersList.get("x-current-path") || "/"
	let categoryId = pathname.split("/")[1]
	if (categoryId === "edit") categoryId = ""
	return (
		<html lang="en" className={inter.className}>
			<body className="min-h-screen flex flex-col items-center">
				{children}
				{/* <footer className="text-muted-foreground font-normal text-xs mb-4">
					© 2025 {env.PRODUCT_NAME}.{" "}
					<span className="font-medium">All Rights Reserved.</span>
				</footer> */}
			</body>
		</html>
	)
}
