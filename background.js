chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.requestTabId) {
      sendResponse({ tabId: sender.tab.id });
    }
  });
  