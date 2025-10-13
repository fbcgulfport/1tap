import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "~/lib/auth"
import { env } from "~/lib/env"

/**
 * Get the current session from better-auth
 * This should be called in Server Components and Server Actions
 */
export async function getSession() {
	return await auth.api.getSession({
		headers: await headers()
	})
}

/**
 * Check if user's email is from authorized domain
 */
function isAuthorizedDomain(email: string): boolean {
	const userDomain = email.split("@")[1]
	return userDomain === env.AUTHORIZED_DOMAIN
}

/**
 * Require authentication for Server Actions and API routes
 * If not authenticated or not from authorized domain, signs out and redirects to login
 */
export async function requireAuth() {
	const session = await getSession()

	if (!session?.user) {
		redirect("/login")
	}

	// Check if user's email domain matches authorized domain
	if (!isAuthorizedDomain(session.user.email)) {
		// Sign out user from unauthorized domain
		await auth.api.signOut({
			headers: await headers()
		})
		redirect("/login?error=unauthorized_domain")
	}

	return session
}

/**
 * Check if user is authenticated (returns null if not)
 * Use this for conditional rendering in Server Components
 */
export async function checkAuth() {
	const session = await getSession()

	if (!session?.user) {
		return null
	}

	// Check domain authorization
	if (!isAuthorizedDomain(session.user.email)) {
		return null
	}

	return session
}
