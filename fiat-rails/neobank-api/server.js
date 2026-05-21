const { createHealthApp } = require("../shared/health-server");

createHealthApp("neobank-api", (app) => {
  app.get("/api/neobank/balance", (_req, res) => {
    res.json({
      status: "pipeline",
      service: "neobank-api",
      label: "PROJECTION",
      message: "Product design only — no live card or deposit insurance",
    });
  });
});
