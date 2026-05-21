const ports = [
  ["payment-orchestrator", 4022],
  ["fedwire-adapter", 4023],
  ["swift-bridge", 4024],
  ["compliance-engine", 4025],
  ["neobank-api", 4026],
  ["iou-reserve-monitor", 4027],
];

(async () => {
  let ok = 0;
  for (const [name, port] of ports) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`);
      const body = await res.json();
      const pass = body.status === "pipeline" && body.service === name;
      console.log(pass ? "OK" : "WARN", name, body);
      if (pass) ok++;
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
  process.exit(ok === ports.length ? 0 : 1);
})();
