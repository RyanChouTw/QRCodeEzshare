let isQRCodeVisible = false;  // 初始狀態設為不可見

function toggleQRCode(tabId) {
  isQRCodeVisible = !isQRCodeVisible;
  chrome.tabs.sendMessage(tabId, { action: 'toggleQR', visible: isQRCodeVisible });
}

function injectAndExecuteScript(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'checkInjection' }, response => {
    if (chrome.runtime.lastError || !response) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['qrcode.min.js']
      }).then(() => {
        console.log('qrcode.min.js injected successfully');
        return chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      }).then(() => {
        console.log('content.js injected successfully');
      }).catch((error) => {
        console.error('Error details:', error);
        if (error.message) {
          console.error('Error message:', error.message);
        }
        if (error.stack) {
          console.error('Error stack:', error.stack);
        }
      });
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    console.log('Extension icon clicked. Toggling QR code...');
    toggleQRCode(tab.id);
  } else {
    console.error('Invalid tab id');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    injectAndExecuteScript(tabId);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectAndExecute' && request.tabId) {
    injectAndExecuteScript(request.tabId);
  }
});