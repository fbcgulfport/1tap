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
	transpilePackages: ["file-type"]
}

export default config
