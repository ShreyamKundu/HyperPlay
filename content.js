function applySavedSpeedForTab() {
    chrome.storage.local.get("tabSpeeds", (data) => {
      let tabSpeeds = data.tabSpeeds || {};
  
      chrome.runtime.sendMessage({ requestTabId: true }, (response) => {
        let tabId = response.tabId;
        let savedSpeed = tabSpeeds[tabId] || 1.0; // Default to normal speed
  
        function updateSpeed() {
          let video = document.querySelector("video");
          if (video && video.playbackRate !== savedSpeed) {
            video.playbackRate = savedSpeed;
          }
        }
  
        updateSpeed();
        let observer = new MutationObserver(updateSpeed);
        observer.observe(document.body, { childList: true, subtree: true });
        document.addEventListener("play", updateSpeed, true);
      });
    });
  }
  
  applySavedSpeedForTab();
  