import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const runsArg = Number(process.argv.find((arg) => arg.startsWith("--runs="))?.split("=")[1] ?? "3");
const runs = Number.isFinite(runsArg) && runsArg > 0 ? Math.floor(runsArg) : 3;

const root = process.cwd();
const outDir = path.join(root, "data", "observability");

function percentile(values, p) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function run() {
  fs.mkdirSync(outDir, { recursive: true });

  const samples = [];
  for (let i = 0; i < runs; i += 1) {
    const output = execFileSync("node", ["scripts/run-rollback-drill.mjs"], {
      cwd: root,
      encoding: "utf8",
    });

    samples.push(JSON.parse(output));
  }

  const restoreMs = samples.map((sample) => sample.restoreElapsedMs);
  const totalMs = samples.map((sample) => sample.totalElapsedMs);

  const report = {
    capturedAt: new Date().toISOString(),
    runs,
    allVerified: samples.every((sample) => sample.rollbackVerified === true),
    restoreTimingMs: {
      min: Math.min(...restoreMs),
      max: Math.max(...restoreMs),
      p50: percentile(restoreMs, 50),
      p95: percentile(restoreMs, 95),
      avg: Math.round(restoreMs.reduce((sum, value) => sum + value, 0) / restoreMs.length),
    },
    totalTimingMs: {
      min: Math.min(...totalMs),
      max: Math.max(...totalMs),
      p50: percentile(totalMs, 50),
      p95: percentile(totalMs, 95),
      avg: Math.round(totalMs.reduce((sum, value) => sum + value, 0) / totalMs.length),
    },
    samples,
  };

  const outPath = path.join(
    outDir,
    `recovery-timing-${new Date().toISOString().replace(/[.:]/g, "-")}.json`,
  );
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify({ outPath, ...report }, null, 2));
  if (!report.allVerified) {
    process.exitCode = 2;
  }
}

run();
