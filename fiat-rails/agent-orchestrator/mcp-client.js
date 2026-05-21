/**
 * MCP JSON-RPC client — default http://localhost:4731 (mock when unreachable).
 */
const DEFAULT_MCP_URL = process.env.MCP_URL || process.env.MCP_XRPL_URL || 'http://127.0.0.1:4731';

let requestId = 0;

function mockResult(method) {
  return {
    mock: true,
    label: 'PIPELINE',
    method,
    note: 'MCP server unreachable — returning stub ledger context',
    account: process.env.XRPL_ISSUER || 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ',
    balance: '0',
  };
}

async function mcpRequest(method, params = {}, baseUrl = DEFAULT_MCP_URL) {
  const id = ++requestId;
  const body = { jsonrpc: '2.0', id, method, params };
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(Number(process.env.MCP_TIMEOUT_MS || 8000)),
    });
    if (!res.ok) {
      return mockResult(method);
    }
    const data = await res.json();
    if (data.error) {
      return { ...mockResult(method), error: data.error.message || data.error };
    }
    return data.result;
  } catch {
    return mockResult(method);
  }
}

async function healthCheck(baseUrl = DEFAULT_MCP_URL) {
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { ok: false, status: res.status, url: baseUrl, mock_available: true };
    const json = await res.json().catch(() => ({}));
    return { ok: true, url: baseUrl, ...json };
  } catch (err) {
    return { ok: false, error: err.message, url: baseUrl, mock_available: true };
  }
}

async function listTools(baseUrl = DEFAULT_MCP_URL) {
  return mcpRequest('tools/list', {}, baseUrl);
}

async function callTool(name, args = {}, baseUrl = DEFAULT_MCP_URL) {
  return mcpRequest('tools/call', { name, arguments: args }, baseUrl);
}

module.exports = { mcpRequest, healthCheck, listTools, callTool, DEFAULT_MCP_URL, mockResult };
