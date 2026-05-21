import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/restore-control-plane.mjs <backup-db-file>");
  process.exit(1);
}

const root = process.cwd();
const dataDir = path.join(root, "data", "troptions-control-plane");
const dbPath = path.join(dataDir, "control-plane.db");

if (!fs.existsSync(source)) {
  console.error("[restore-control-plane] Backup file not found:", source);
  process.exit(1);
}

fs.mkdirSync(dataDir, { recursive: true });

for (const suffix of ["", "-wal", "-shm"]) {
  const target = `${dbPath}${suffix}`;
  if (fs.existsSync(target)) {
    fs.rmSync(target);
  }
}

fs.copyFileSync(source, dbPath);

for (const suffix of ["-wal", "-shm"]) {
  const sourceSidecar = `${source}${suffix}`;
  if (fs.existsSync(sourceSidecar)) {
    fs.copyFileSync(sourceSidecar, `${dbPath}${suffix}`);
  }
}

console.log("[restore-control-plane] Restore completed from:", source);
