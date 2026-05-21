const { createHealthApp } = require("../shared/health-server");

createHealthApp("compliance-engine", (app) => {
  app.post("/api/compliance/screen", (_req, res) => {
    res.status(501).json({
      label: "PIPELINE",
      service: "compliance-engine",
      result: "not_implemented",
      message: "Wire OFAC/KYC providers via .env — not production",
    });
  });

  app.post("/api/compliance/kyc", (_req, res) => {
    res.status(501).json({ label: "PIPELINE", service: "compliance-engine", result: "not_implemented" });
  });
});
