const { createHealthApp } = require("../shared/health-server");

createHealthApp("swift-bridge", (app) => {
  app.post("/api/swift/send", (_req, res) => {
    res.status(501).json({ label: "PIPELINE", service: "swift-bridge", result: "not_implemented" });
  });

  app.get("/api/swift/status/:id", (req, res) => {
    res.json({
      status: "pipeline",
      service: "swift-bridge",
      tracking_id: req.params.id,
      state: "mock_pending",
    });
  });
});
