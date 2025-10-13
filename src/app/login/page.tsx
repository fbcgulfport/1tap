"use client"

import { Loader2Icon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "~/lib/auth-client"

export default function LoginPage() {
	const searchParams = useSearchParams()
	const redirect = searchParams.get("redirect") || "/edit"

	useEffect(() => {
		authClient.signIn.social({
			provider: "google",
			callbackURL: redirect
		})
	})

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Loader2Icon className="size-10 animate-spin" />
		</div>
	)
}
