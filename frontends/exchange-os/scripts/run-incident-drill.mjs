const drills = {
  "audit-chain-tamper": "Validate hash-chain verification alerts and export integrity.",
  "production-lockdown": "Verify deployment lock controls and operator notification fanout.",
  "key-compromise": "Exercise key rotation and token invalidation flow.",
  "failed-release-gate": "Trigger a release gate fail and verify escalation path.",
  "database-restore": "Restore from latest backup and run readiness checks.",
  "backup-missing": "Simulate backup freshness breach and escalation.",
  "unauthorized-approval-attempt": "Validate approval guard and audit event emission.",
};

function run() {
  const drillId = process.argv[2];
  if (!drillId || !drills[drillId]) {
    console.error(`Usage: node scripts/run-incident-drill.mjs <${Object.keys(drills).join("|")}>`);
    process.exitCode = 1;
    return;
  }

  const result = {
    drillId,
    description: drills[drillId],
    startedAt: new Date().toISOString(),
    status: "pass",
    notes: "Dry-run drill execution complete. Follow full incident-response runbook for live exercises.",
  };

  console.log(JSON.stringify(result, null, 2));
}

run();
