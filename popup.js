document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('togglePicker');
  const includeParentCheckbox = document.getElementById('includeParent');
  const includeComputedCheckbox = document.getElementById('includeComputed');
  const statusDiv = document.getElementById('status');

  // Load saved state
  chrome.storage.local.get(['is picking', 'options'], (result) => {
    // If we were picking, update UI
    // Note: Since popup closes when clicking away, state management is tricky.
    // We'll rely on messaging content script to know current state on load if possible,
    // or just reset. For simplicity, we'll send a query.
    
    if (result.options) {
      includeParentCheckbox.checked = result.options.includeParent;
      includeComputedCheckbox.checked = result.options.includeComputed;
    }

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, {action: "getStatus"}, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not loaded. Inject it.
          chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["highlight.css"]
          }, () => {
             chrome.scripting.executeScript({
               target: { tabId: tabId },
               files: ["content.js"]
             }, () => {
               if (chrome.runtime.lastError) {
                 statusDiv.textContent = "Cannot pick on this page.";
                 toggleButton.disabled = true;
               } else {
                 updateUI(false);
               }
             });
          });
          return;
        }
        
        if (response && response.isPicking) {
          updateUI(true);
        } else {
          updateUI(false);
        }
      });
    });
  });

  toggleButton.addEventListener('click', () => {
    const isActive = toggleButton.classList.contains('active');
    const newState = !isActive;
    
    // Save options
    const options = {
      includeParent: includeParentCheckbox.checked,
      includeComputed: includeComputedCheckbox.checked
    };
    chrome.storage.local.set({options});

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "togglePicker",
        state: newState,
        options: options
      }, (response) => {
          if (chrome.runtime.lastError) {
             statusDiv.textContent = "Error: Refresh page and try again.";
             return; 
          }
          updateUI(newState);
      });
    });
  });

  function updateUI(isPicking) {
    if (isPicking) {
      toggleButton.textContent = "Stop Picking";
      toggleButton.classList.add('active');
      statusDiv.textContent = "Hover and click an element.";
    } else {
      toggleButton.textContent = "Start Picking";
      toggleButton.classList.remove('active');
      statusDiv.textContent = "Ready to pick.";
    }
  }
});
