import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const backupDir = path.join(root, "data", "backups");

function weekBucket(date) {
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function monthBucket(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function retentionPlan(files, now = new Date()) {
  const sorted = [...files].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const keep = new Set();
  const dailyCutoff = now.getTime() - 30 * 86400000;
  const weeklyCutoff = now.getTime() - 12 * 7 * 86400000;
  const monthlyCutoff = new Date(now);
  monthlyCutoff.setUTCMonth(monthlyCutoff.getUTCMonth() - 12);

  const weeks = new Set();
  const months = new Set();

  for (const file of sorted) {
    if (file.createdAt.getTime() >= dailyCutoff) {
      keep.add(file.fullPath);
      continue;
    }

    if (file.createdAt.getTime() >= weeklyCutoff) {
      const key = weekBucket(file.createdAt);
      if (!weeks.has(key)) {
        weeks.add(key);
        keep.add(file.fullPath);
      }
      continue;
    }

    if (file.createdAt >= monthlyCutoff) {
      const key = monthBucket(file.createdAt);
      if (!months.has(key)) {
        months.add(key);
        keep.add(file.fullPath);
      }
    }
  }

  return {
    keep: sorted.filter((item) => keep.has(item.fullPath)),
    prune: sorted.filter((item) => !keep.has(item.fullPath)),
  };
}

function run() {
  if (!fs.existsSync(backupDir)) {
    console.log("No backups directory found, nothing to rotate.");
    return;
  }

  const entries = fs
    .readdirSync(backupDir)
    .map((name) => ({ name, fullPath: path.join(backupDir, name) }))
    .filter((entry) => fs.statSync(entry.fullPath).isFile())
    .map((entry) => ({ ...entry, createdAt: fs.statSync(entry.fullPath).mtime }));

  const plan = retentionPlan(entries);
  for (const item of plan.prune) {
    fs.unlinkSync(item.fullPath);
  }

  console.log(JSON.stringify({ kept: plan.keep.length, pruned: plan.prune.length }, null, 2));
}

run();
