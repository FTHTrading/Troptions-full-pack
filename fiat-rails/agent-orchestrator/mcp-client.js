/**
 * Minimal MCP JSON-RPC client for XRPL tools server.
 * Default: MCP_XRPL_URL=http://127.0.0.1:4032
 */
const DEFAULT_MCP_URL = process.env.MCP_XRPL_URL || 'http://127.0.0.1:4032';

let requestId = 0;

async function mcpRequest(method, params = {}, baseUrl = DEFAULT_MCP_URL) {
  const id = ++requestId;
  const body = { jsonrpc: '2.0', id, method, params };
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(Number(process.env.MCP_TIMEOUT_MS || 8000)),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`MCP ${method} HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.result;
}

async function healthCheck(baseUrl = DEFAULT_MCP_URL) {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { ok: false, status: res.status };
    const json = await res.json().catch(() => ({}));
    return { ok: true, ...json };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function listTools(baseUrl = DEFAULT_MCP_URL) {
  return mcpRequest('tools/list', {}, baseUrl);
}

async function callTool(name, args = {}, baseUrl = DEFAULT_MCP_URL) {
  return mcpRequest('tools/call', { name, arguments: args }, baseUrl);
}

module.exports = { mcpRequest, healthCheck, listTools, callTool, DEFAULT_MCP_URL };
