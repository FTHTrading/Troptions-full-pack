// API base: dao-service (default) or nginx TLS path /dao/
const API = window.DAO_API || (location.protocol === "https:"
  ? `${location.origin}/dao`
  : "http://127.0.0.1:8093");
// Direct L1 JSON-RPC (optional read path; source of truth on :9944)
const L1_RPC = window.L1_RPC || (location.protocol === "https:"
  ? `${location.origin}/l1`
  : "http://127.0.0.1:9944");
const API_KEY = window.DAO_API_KEY || "";
const WS_URL = API.replace(/^http/, "ws") + "/ws";

async function l1Rpc(method, params = {}) {
  const r = await fetch(L1_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || JSON.stringify(j.error));
  return j.result;
}

async function fetchJson(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  const r = await fetch(`${API}${path}`, { ...opts, headers });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function renderProposals(data) {
  const el = document.getElementById("proposals-list");
  const items = data.l1 || data || [];
  const list = Array.isArray(items) ? items : [];
  el.innerHTML = list.length
    ? list.map((p) => `
      <div class="proposal-card">
        <strong>${p.title || p.proposal_id}</strong>
        <div>${p.status || "—"} · for ${p.votes_for ?? 0} / against ${p.votes_against ?? 0}</div>
        <button data-id="${p.proposal_id}" class="vote-btn">Vote FOR</button>
      </div>`).join("")
    : "<p>No proposals on L1 yet.</p>";

  el.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.onclick = async () => {
      const voter = prompt("Voter account (32-byte hex):");
      if (!voter) return;
      const headers = { "Content-Type": "application/json" };
      if (API_KEY) headers["X-API-Key"] = API_KEY;
      await fetch(`${API}/dao/proposals/vote`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          proposal_id: btn.dataset.id,
          voter,
          choice: "for",
        }),
      });
      load();
    };
  });
}

function renderTreasury(data) {
  const el = document.getElementById("treasury-view");
  const wallets = data.wallets || [];
  el.innerHTML = wallets.map((w) => `
    <div class="proposal-card">
      <strong>${w.chain} · ${w.asset}</strong>
      <div class="muted">${w.address || ""} balance ${w.balance ?? "0"} (${w.source || "l1"})</div>
    </div>`).join("") || "<p>Treasury loading…</p>";
}

async function load() {
  try {
    const state = await fetchJson("/dao/state");
    document.getElementById("l1-panel").textContent = JSON.stringify(state, null, 2);
    const pill = document.getElementById("l1-status");
    const h = state.l1?.block_height;
    pill.textContent = h != null ? `L1 block ${h}` : "L1 offline";
    pill.style.background = h != null ? "#065f46" : "#7f1d1d";
    renderTreasury(state.treasury || {});
  } catch (e) {
    document.getElementById("l1-status").textContent = "API offline";
  }
  try {
    const proposals = await l1Rpc("dao_getProposals");
    renderProposals({ l1: proposals, source: "l1_direct" });
  } catch (_) {
    try {
      const proposals = await fetchJson("/dao/proposals");
      renderProposals(proposals);
    } catch (__) {}
  }
}

document.getElementById("proposal-form").onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const headers = { "Content-Type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  await fetch(`${API}/dao/proposals`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: fd.get("title"),
      description: fd.get("description"),
      proposer: fd.get("proposer"),
    }),
  });
  e.target.reset();
  load();
};

function connectWs() {
  try {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.event === "l1_state") {
        document.getElementById("l1-panel").textContent = JSON.stringify(msg.payload, null, 2);
      }
    };
    ws.onclose = () => setTimeout(connectWs, 3000);
  } catch (_) {}
}

load();
connectWs();
setInterval(load, 15000);
