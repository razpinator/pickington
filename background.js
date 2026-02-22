// Background script
// Can be used for context menus or persisting state across reloads if needed.
// For now, it just installs gracefully.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Pickington installed.");
});
