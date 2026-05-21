const { createHealthApp } = require("../shared/health-server");

createHealthApp("payment-orchestrator", (app) => {
  app.post("/payments/request", (_req, res) => {
    res.status(501).json({
      status: "pipeline",
      service: "payment-orchestrator",
      label: "PIPELINE",
      result: "not_implemented",
      message: "Fiat routing stub — connect FedWire/SWIFT adapters when MSB live",
    });
  });

  app.get("/payments/status", (req, res) => {
    const id = req.query.id || req.query.payment_id || "stub";
    res.json({
      status: "pipeline",
      service: "payment-orchestrator",
      label: "PIPELINE",
      payment_id: id,
      state: "mock_pending",
      message: "Mock status only — no settlement",
    });
  });

  app.post("/api/banking/deposit", (_req, res) => {
    res.status(501).json({ label: "PIPELINE", result: "not_implemented" });
  });

  app.post("/api/banking/withdraw", (_req, res) => {
    res.status(501).json({ label: "PIPELINE", result: "not_implemented" });
  });
});
