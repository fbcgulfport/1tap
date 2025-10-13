import { createId } from "@paralleldrive/cuid2"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const linkTable = sqliteTable("links", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	trigger: text().unique(),
	categoryId: text().references(() => linkCategory.id),
	active: integer({ mode: "boolean" }).notNull().default(true),
	name: text().notNull(),
	url: text().notNull(),
	filename: text(),
	description: text(),
	sortOrder: integer().notNull().default(0),
	createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
	updatedAt: integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
})

export const linkCategory = sqliteTable("link_categories", {
	id: text().primaryKey(),
	activeTrigger: text(),
	triggerExpiresAt: integer({ mode: "timestamp_ms" })
})

export const categoryVisit = sqliteTable("category_visits", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	categoryId: text().notNull(),
	userAgent: text(),
	ip: text(),
	visitedAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date())
})

export const linkClick = sqliteTable("link_clicks", {
	id: text()
		.$defaultFn(() => createId())
		.primaryKey(),
	linkId: text()
		.notNull()
		.references(() => linkTable.id),
	categoryId: text().notNull(),
	userAgent: text(),
	ip: text(),
	clickedAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date())
})

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.default(false)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
})

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => new Date())
		.notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" })
})

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp_ms"
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp_ms"
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => new Date())
		.notNull()
})

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
		.notNull()
})
