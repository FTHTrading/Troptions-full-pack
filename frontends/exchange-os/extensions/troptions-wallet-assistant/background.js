chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("troptionsBaseUrl", (result) => {
    if (!result.troptionsBaseUrl) {
      chrome.storage.local.set({ troptionsBaseUrl: "http://localhost:8889" });
    }
  });
});