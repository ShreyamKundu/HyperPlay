document.addEventListener("DOMContentLoaded", () => {
    let speedInput = document.getElementById("speedInput");
    let currentSpeedDisplay = document.getElementById("currentSpeed");

    // Get the current tab ID
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let tabId = tabs[0].id;

        // Get and display the speed for this specific tab
        chrome.storage.local.get(["tabSpeeds"], (data) => {
            let tabSpeeds = data.tabSpeeds || {};
            let savedSpeed = tabSpeeds[tabId] || 1.0; // Default to normal speed
            currentSpeedDisplay.textContent = savedSpeed.toFixed(2);
            speedInput.value = savedSpeed;
        });

        // Apply new speed on button click
        document.getElementById("applySpeed").addEventListener("click", () => {
            let speed = parseFloat(speedInput.value);
            if (!isNaN(speed) && speed > 0) {
                chrome.storage.local.get(["tabSpeeds"], (data) => {
                    let tabSpeeds = data.tabSpeeds || {};
                    tabSpeeds[tabId] = speed;
                    chrome.storage.local.set({ tabSpeeds });

                    // Update UI
                    currentSpeedDisplay.textContent = speed.toFixed(2);

                    // Apply speed only to the current tab
                    chrome.scripting.executeScript({
                        target: { tabId },
                        func: setVideoSpeed,
                        args: [speed]
                    });
                });
            }
        });

        // Reset speed to 1x on reset button click
        document.getElementById("resetSpeed").addEventListener("click", () => {
            let speed = 1.0;
            chrome.storage.local.get(["tabSpeeds"], (data) => {
                let tabSpeeds = data.tabSpeeds || {};
                tabSpeeds[tabId] = speed;
                chrome.storage.local.set({ tabSpeeds });

                // Update UI
                currentSpeedDisplay.textContent = speed.toFixed(2);
                speedInput.value = speed;

                // Apply speed to current tab
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: setVideoSpeed,
                    args: [speed]
                });
            });
        });
    });
});

// Function to set video speed inside YouTube
function setVideoSpeed(speed) {
    let video = document.querySelector("video");
    if (video) video.playbackRate = speed;
}
