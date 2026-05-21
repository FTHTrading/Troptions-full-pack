#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const docsToValidate = [
  {
    file: "docs/trade-desk/cis-pof/00-current-state-audit.md",
    requiredSnippets: ["# Current State Audit", "## Files Found", "## Trade Desk Readiness Verdict"]
  },
  {
    file: "docs/trade-desk/cis-pof/01-trade-desk-document-requirements.md",
    requiredSnippets: ["# Trade Desk CIS/POF Document Requirements", "## Required Data and Documents", "## Signoff Chain"]
  },
  {
    file: "docs/trade-desk/cis-pof/02-cis-template.md",
    requiredSnippets: ["# CIS Template", "## 1. Client / Entity Profile", "## 11. Approval Status"]
  },
  {
    file: "docs/trade-desk/cis-pof/03-pof-template.md",
    requiredSnippets: ["# POF Template", "## 1. Account / Entity Match", "## 9. Decision"]
  },
  {
    file: "docs/trade-desk/cis-pof/04-source-of-funds-source-of-wealth.md",
    requiredSnippets: ["# Source of Funds vs Source of Wealth", "## Acceptable Source of Funds Evidence", "## Unacceptable / Insufficient Evidence"]
  },
  {
    file: "docs/trade-desk/cis-pof/05-evidence-checklist.md",
    requiredSnippets: ["# Trade Desk CIS/POF Evidence Checklist", "## Status Values"]
  },
  {
    file: "docs/trade-desk/cis-pof/06-bryan-review-closeout.md",
    requiredSnippets: ["# Bryan Review Closeout", "## What Has Been Added", "## Final Readiness Status"]
  },
  {
    file: "docs/trade-desk/cis-pof/99-implementation-report.md",
    requiredSnippets: ["# Implementation Report", "## Files Created", "## Validation Command"]
  },
  {
    file: "docs/runbooks/docker-wsl-recovery.md",
    requiredSnippets: ["# Docker and WSL Recovery Runbook", "## Non-Destructive Recovery Steps", "## Last Resort (Destructive)"]
  },
  {
    file: "docs/runbooks/bring-stack-up-after-docker.md",
    requiredSnippets: ["# Bring Stack Up After Docker Recovery", "## Step 1 - Verify Docker and WSL", "## Step 5 - Capture Evidence"]
  }
];

const scriptsToValidate = [
  "scripts/windows/docker-health.ps1",
  "scripts/windows/docker-wsl-soft-repair.ps1"
];

function readText(filePath) {
  const abs = path.join(repoRoot, filePath);
  if (!fs.existsSync(abs)) {
    return { ok: false, error: `Missing file: ${filePath}` };
  }
  return { ok: true, text: fs.readFileSync(abs, "utf8") };
}

const failures = [];

for (const doc of docsToValidate) {
  const result = readText(doc.file);
  if (!result.ok) {
    failures.push(result.error);
    continue;
  }

  for (const snippet of doc.requiredSnippets) {
    if (!result.text.includes(snippet)) {
      failures.push(`${doc.file} is missing required snippet: ${snippet}`);
    }
  }
}

for (const scriptFile of scriptsToValidate) {
  const result = readText(scriptFile);
  if (!result.ok) {
    failures.push(result.error);
    continue;
  }

  if (result.text.includes("wsl --unregister")) {
    failures.push(`${scriptFile} contains forbidden destructive command: wsl --unregister`);
  }
}

if (failures.length > 0) {
  console.error("Trade desk docs validation FAILED");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Trade desk docs validation PASSED");
console.log(`Validated ${docsToValidate.length} docs and ${scriptsToValidate.length} scripts.`);
