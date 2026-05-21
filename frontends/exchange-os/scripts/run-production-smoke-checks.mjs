const baseUrl = process.env.TROPTIONS_BASE_URL ?? "http://localhost:3000";

async function check(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  const body = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

async function run() {
  const live = await check("/api/health/live");
  const ready = await check("/api/health/ready");

  const result = {
    ranAt: new Date().toISOString(),
    live,
    ready,
    ok: live.ok && ready.ok,
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
