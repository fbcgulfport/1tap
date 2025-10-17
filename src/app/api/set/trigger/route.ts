import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "~/db"
import { linkCategory } from "~/db/schema"

export async function POST(request: NextRequest) {
	try {
		// Check API_KEY authentication
		const apiKey = request.headers.get("Authorization")
		if (!apiKey || apiKey !== process.env.API_KEY) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Parse request body
		const body = await request.json()
		const { category, trigger, expiresAt } = z
			.object({
				category: z.string(),
				trigger: z.string().optional(),
				expiresAt: z.number().optional()
			})
			.parse(body)

		// Validate required fields
		if (!category) {
			return NextResponse.json(
				{ error: "category is required" },
				{ status: 400 }
			)
		}

		// Validate trigger format (lowercase alphanumeric)
		if (trigger && !/^[a-z0-9]+$/.test(trigger)) {
			return NextResponse.json(
				{ error: "trigger must be lowercase alphanumeric" },
				{ status: 400 }
			)
		}

		// Validate expiresAt if provided
		if (expiresAt !== undefined && typeof expiresAt !== "number") {
			return NextResponse.json(
				{ error: "expiresAt must be a number (timestamp in milliseconds)" },
				{ status: 400 }
			)
		}

		// Activate the trigger on the category
		const result = await db
			.update(linkCategory)
			.set({
				activeTrigger: trigger,
				triggerExpiresAt: expiresAt ? new Date(expiresAt) : null
			})
			.where(eq(linkCategory.id, category))
			.returning()

		if (result.length === 0) {
			return NextResponse.json({ error: "Category not found" }, { status: 404 })
		}

		return NextResponse.json({
			success: true,
			category: result[0]
		})
	} catch (error) {
		console.error("Error setting trigger:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
