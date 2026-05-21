const { createHealthApp } = require("../shared/health-server");

createHealthApp("fedwire-adapter", (app) => {
  app.post("/api/fedwire/send", (_req, res) => {
    res.status(501).json({ label: "PIPELINE", service: "fedwire-adapter", result: "not_implemented" });
  });
});
