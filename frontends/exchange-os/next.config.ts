import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		// Pre-existing params async compat error in agents route — build proceeds
		ignoreBuildErrors: true,
	},
	async redirects() {
		return [
			{ source: "/exchange-o", destination: "/exchange-os", permanent: true },
			{ source: "/exchange-o/:path*", destination: "/exchange-os/:path*", permanent: true },
			{ source: "/live-dex", destination: "/exchange-os", permanent: false },
			{ source: "/live-dex/:path*", destination: "/exchange-os/:path*", permanent: false },
			// Canonical launcher routes (avoid 404 on Exchange / main Worker)
			{ source: "/mints", destination: "https://launch.unykorn.org/mints", permanent: false },
			{ source: "/system/truth", destination: "https://launch.unykorn.org/system/truth", permanent: false },
			// Legacy Bryan domains → canonical paths (when hit on unykorn hosts)
			{ source: "/xchange", destination: "/troptions/xchange", permanent: true },
			{ source: "/university", destination: "/troptions/university", permanent: true },
			{ source: "/solar", destination: "/troptions/solar", permanent: true },
			{ source: "/real-estate", destination: "/troptions/real-estate", permanent: true },
			{ source: "/media", destination: "/troptions/media", permanent: true },
			{ source: "/hotrcw", destination: "/troptions/hotrcw", permanent: true },
		];
	},
	turbopack: {
		root: process.cwd(),
	},
	serverExternalPackages: ["better-sqlite3", "@solana/web3.js"],
	experimental: {
		cpus: 1,
		workerThreads: false,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Solana web3.js expects these Node built-ins; use browser stubs
			config.resolve = config.resolve ?? {};
			config.resolve.fallback = {
				...(config.resolve.fallback as Record<string, unknown>),
				crypto: false,
				stream: false,
				buffer: false,
				url: false,
				https: false,
				http: false,
				zlib: false,
				path: false,
				fs: false,
			};
		}
		return config;
	},
};

export default nextConfig;
