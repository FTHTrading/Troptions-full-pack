const BAAS_API_URL = process.env.BAAS_API_URL || 'http://127.0.0.1:8097';

async function postJson(path, body) {
  const res = await fetch(`${BAAS_API_URL.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function getJson(path) {
  const res = await fetch(`${BAAS_API_URL.replace(/\/$/, '')}${path}`, {
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function registerAgent(body) {
  const r = await postJson('/api/v1/agents', body);
  if (!r.ok) {
    const legacy = await postJson('/api/v1/agents/register', body);
    return legacy;
  }
  return r;
}

async function reportTrade(agentId, trade) {
  return postJson(`/api/v1/agents/${encodeURIComponent(agentId)}/trades`, trade);
}

async function getRevenue(agentId) {
  return getJson(`/api/v1/agents/${encodeURIComponent(agentId)}/revenue`);
}

module.exports = {
  registerAgent,
  reportTrade,
  getRevenue,
  BAAS_API_URL,
};
