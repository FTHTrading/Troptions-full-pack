import type { NextConfig } from "next";
import path from "path";

const repoBase = "/Troptions-full-pack";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? repoBase : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_TELEGRAM_BOT_USERNAME:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "",
  },
};

export default nextConfig;
