import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data", "troptions-control-plane");
const dbPath = path.join(dataDir, "control-plane.db");
const backupsDir = path.join(root, "data", "backups");

if (!fs.existsSync(dbPath)) {
  console.error("[backup-control-plane] Database file not found:", dbPath);
  process.exit(1);
}

fs.mkdirSync(backupsDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join(backupsDir, `control-plane-${timestamp}.db`);

fs.copyFileSync(dbPath, destination);

const walPath = `${dbPath}-wal`;
if (fs.existsSync(walPath)) {
  fs.copyFileSync(walPath, `${destination}-wal`);
}

const shmPath = `${dbPath}-shm`;
if (fs.existsSync(shmPath)) {
  fs.copyFileSync(shmPath, `${destination}-shm`);
}

console.log("[backup-control-plane] Backup created:", destination);
