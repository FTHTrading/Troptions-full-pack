const { createHealthApp } = require("../shared/health-server");

createHealthApp("iou-reserve-monitor", (app) => {
  app.get("/api/reserve/attestation", (_req, res) => {
    res.json({
      status: "pipeline",
      service: "iou-reserve-monitor",
      label: "PIPELINE",
      issued_iou_supply_proven: "~874M ledger demand — NOT bank reserves",
      fully_backed_today: false,
      message: "Reconcile omnibus statements when bank partner live",
    });
  });
});
