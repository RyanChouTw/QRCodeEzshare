document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0] && tabs[0].id) {
      chrome.runtime.sendMessage({ action: 'injectAndExecute', tabId: tabs[0].id });
    } else {
      console.error('No active tab found');
    }
  });
});