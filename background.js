// Clear the notepad content when browser starts (but preserve dark mode preference)
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove(['notepadContent']);
});

// Also clear when extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove(['notepadContent']);
});
