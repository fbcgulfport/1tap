import type { NextConfig } from "next"

const config: NextConfig = {
	reactStrictMode: true,
	allowedDevOrigins: [process.env.NEXT_PUBLIC_BETTER_AUTH_URL!],
	productionBrowserSourceMaps: false,
	experimental: {
		serverSourceMaps: false,
		serverActions: {
			bodySizeLimit: "100mb"
		},
		esmExternals: true
	},
	transpilePackages: ["file-type"],

	// PostHog rewrites
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*"
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*"
			}
		]
	},

	// This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true
}

export default config
