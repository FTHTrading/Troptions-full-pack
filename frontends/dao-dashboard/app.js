const API = window.DAO_API || "http://127.0.0.1:8093";
const WS_URL = API.replace(/^http/, "ws") + "/ws";

async function fetchJson(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function renderProposals(data) {
  const el = document.getElementById("proposals-list");
  const items = data.l1 || data.local || [];
  const list = Array.isArray(items) ? items : [];
  el.innerHTML = list.length
    ? list.map((p) => `
      <div class="proposal-card">
        <strong>${p.title || p.proposal_id}</strong>
        <div>${p.status || "—"} · for ${p.votes_for ?? 0} / against ${p.votes_against ?? 0}</div>
        <button data-id="${p.proposal_id}" class="vote-btn">Vote FOR</button>
      </div>`).join("")
    : "<p>No proposals yet.</p>";

  el.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.onclick = async () => {
      const voter = prompt("Voter account (32-byte hex):");
      if (!voter) return;
      await fetch(`${API}/dao/proposals/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div class="muted">${w.address}</div>
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
    const proposals = await fetchJson("/dao/proposals");
    renderProposals(proposals);
  } catch (_) {}
}

document.getElementById("proposal-form").onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  await fetch(`${API}/dao/proposals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
