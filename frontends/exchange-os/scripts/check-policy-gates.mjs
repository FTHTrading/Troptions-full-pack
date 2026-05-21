import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const legacyMiddleware = path.join(root, "src", "middleware.ts");
if (fs.existsSync(legacyMiddleware)) {
  failures.push("Deprecated src/middleware.ts exists. Use src/proxy.ts for Next 16.");
}

const proxyFile = path.join(root, "src", "proxy.ts");
const openNextConfig = path.join(root, "open-next.config.ts");
const isCloudflareOpenNext = fs.existsSync(openNextConfig);

if (!fs.existsSync(proxyFile) && !isCloudflareOpenNext) {
  failures.push("Required src/proxy.ts is missing unless Cloudflare OpenNext mode is configured.");
}

const nextConfigPath = path.join(root, "next.config.ts");
if (!fs.existsSync(nextConfigPath)) {
  failures.push("next.config.ts is missing.");
} else {
  const configText = fs.readFileSync(nextConfigPath, "utf8");
  if (!configText.includes("turbopack") || !configText.includes("root")) {
    failures.push("next.config.ts must explicitly set turbopack.root for deterministic builds.");
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error("[policy-gate][error]", failure);
  }
  process.exit(1);
}

console.log("[policy-gate] All policy gates passed.");
