const STORAGE_KEY = "troptionsBaseUrl";

const primaryRoutes = [
  ["Troptions Home", "/troptions"],
  ["Join Troptions", "/join-troptions"],
  ["Create Wallet", "/join-troptions/create-wallet"],
  ["Wallet Dashboard", "/portal/troptions/wallet/dashboard"],
  ["Send", "/portal/troptions/wallet/send"],
  ["Convert", "/portal/troptions/wallet/convert"],
  ["x402", "/portal/troptions/wallet/x402"]
];

const adminRoutes = [
  ["Wallet Control Tower", "/admin/troptions/wallets"],
  ["Navigation Audit", "/admin/troptions/navigation-audit"],
  ["Open Agent Dashboard", "/admin/troptions/openclaw/dashboard"],
  ["Ask Jefe", "/admin/troptions/openclaw/jefe"],
  ["Check Site", "/admin/troptions/openclaw/site-ops"],
  ["Check x402", "/admin/troptions/openclaw/x402"],
  ["Check XRPL", "/admin/troptions/xrpl-platform/mainnet-readiness"]
];

function buildLinks(container, routes, baseUrl) {
  container.innerHTML = "";
  routes.forEach(([label, path]) => {
    const link = document.createElement("a");
    link.className = "route-link";
    link.href = `${baseUrl}${path}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.innerHTML = `<strong>${label}</strong><span>${path}</span>`;
    container.appendChild(link);
  });
}

async function loadBaseUrl() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || "http://localhost:8889";
}

async function saveBaseUrl(value) {
  await chrome.storage.local.set({ [STORAGE_KEY]: value });
}

document.addEventListener("DOMContentLoaded", async () => {
  const baseUrlInput = document.getElementById("baseUrl");
  const saveButton = document.getElementById("saveBaseUrl");
  const primaryLinks = document.getElementById("primaryLinks");
  const adminLinks = document.getElementById("adminLinks");

  const baseUrl = await loadBaseUrl();
  baseUrlInput.value = baseUrl;
  buildLinks(primaryLinks, primaryRoutes, baseUrl);
  buildLinks(adminLinks, adminRoutes, baseUrl);

  saveButton.addEventListener("click", async () => {
    const nextUrl = baseUrlInput.value.replace(/\/$/, "");
    await saveBaseUrl(nextUrl);
    buildLinks(primaryLinks, primaryRoutes, nextUrl);
    buildLinks(adminLinks, adminRoutes, nextUrl);
  });
});