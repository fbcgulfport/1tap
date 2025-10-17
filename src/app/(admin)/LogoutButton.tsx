"use client"

import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { authClient } from "~/lib/auth-client"

export function LogoutButton() {
	const router = useRouter()

	const handleLogout = async () => {
		posthog.capture("user_logged_out")
		await authClient.signOut()
		router.push("/login")
		router.refresh()
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			className="text-sm text-muted-foreground hover:text-foreground transition-colors"
		>
			Logout
		</button>
	)
}
