import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const root = process.cwd();
const dbPath = path.join(root, "data", "troptions-control-plane", "control-plane.db");
const outDir = path.join(root, "data", "observability");

function safeReadMetrics() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }

  const db = new Database(dbPath, { readonly: true });
  try {
    return db
      .prepare("SELECT event_name, level, tags_json, created_at FROM control_plane_metrics ORDER BY id DESC LIMIT 500")
      .all()
      .map((row) => ({
        ...row,
        tags_json: row.tags_json,
      }));
  } finally {
    db.close();
  }
}

function redact(entry) {
  const asText = JSON.stringify(entry);
  return asText
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "[REDACTED]")
    .replace(/"authorization"\s*:\s*"[^"]+"/gi, '"authorization":"[REDACTED]"')
    .replace(/"token"\s*:\s*"[^"]+"/gi, '"token":"[REDACTED]"')
    .replace(/"secret"\s*:\s*"[^"]+"/gi, '"secret":"[REDACTED]"');
}

function run() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const snapshot = {
    exportedAt: new Date().toISOString(),
    metrics: safeReadMetrics().map((metric) => JSON.parse(redact(metric))),
  };

  const fileName = `observability-${new Date().toISOString().replace(/[.:]/g, "-")}.json`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(filePath);
}

run();
