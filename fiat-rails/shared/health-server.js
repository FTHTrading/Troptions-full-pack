/**
 * Minimal PIPELINE health server for fiat-rails microservices.
 */
const express = require("express");

function createHealthApp(serviceName, extraRoutes) {
  const app = express();
  const port = Number(process.env.PORT) || 4022;

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      status: "pipeline",
      service: serviceName,
      label: "PIPELINE",
      port,
      message: "Stub only — MSB/bank credentials not wired",
    });
  });

  if (typeof extraRoutes === "function") {
    extraRoutes(app);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[${serviceName}] PIPELINE stub listening on :${port}`);
  });

  return app;
}

module.exports = { createHealthApp };
