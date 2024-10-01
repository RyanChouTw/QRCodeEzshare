/* global QRCode */

// 使用 IIFE (Immediately Invoked Function Expression) 來避免全局變量污染
(function() {
  let qrContainer = null;
  let toggleButton = null;

  function createToggleButton() {
    toggleButton = document.createElement('button');
    toggleButton.id = 'qr-toggle-button';
    toggleButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 9999;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
  
    const iconImg = document.createElement('img');
    iconImg.src = chrome.runtime.getURL('icon48.png');
    iconImg.style.cssText = `
      width: 24px;
      height: 24px;
    `;
  
    toggleButton.appendChild(iconImg);
    document.body.appendChild(toggleButton);
    toggleButton.addEventListener('click', () => toggleQRCode(true));
  }

  function generateQRCode(visible = false) {
    console.log('Generating QR Code...');

    qrContainer = document.createElement('div');
    qrContainer.id = 'qr-code-container';
    qrContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 10000;
      display: ${visible ? 'block' : 'none'};
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      position: absolute;
      top: -15px;
      right: -15px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    closeButton.addEventListener('click', () => toggleQRCode(false));

    const copyButton = document.createElement('button');
    copyButton.innerHTML = '📋'; // 使用剪貼板表情符號
    copyButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: -15px;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    copyButton.addEventListener('click', copyQRCodeToClipboard);

    // 添加保存按钮
    const saveButton = document.createElement('button');
    saveButton.innerHTML = '💾'; // 使用保存图标表情符号
    saveButton.style.cssText = `
      position: absolute;
      top: 60px;
      right: -15px;
      background: #e0e0e0;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    saveButton.addEventListener('click', saveQRCodeAsImage);

    const qrElement = document.createElement('div');
    qrElement.id = 'qrcode';

    const infoElement = document.createElement('div');
    infoElement.style.cssText = `
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 256px;
    `;

    qrContainer.appendChild(closeButton);
    qrContainer.appendChild(copyButton);
    qrContainer.appendChild(saveButton);
    qrContainer.appendChild(qrElement);
    qrContainer.appendChild(infoElement);
    document.body.appendChild(qrContainer);

    let logoUrl = '';
    const linkTags = document.getElementsByTagName('link');
    for (let i = 0; i < linkTags.length; i++) {
      if (linkTags[i].rel.indexOf('icon') > -1) {
        logoUrl = linkTags[i].href;
        break;
      }
    }

    try {
      console.log('Creating QR Code...');
      new QRCode(qrElement, {
        text: window.location.href,
        width: 256,
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
      console.log('QR Code created successfully');
    } catch (error) {
      console.error('Failed to create QR Code:', error);
      return;
    }

    if (logoUrl) {
      const img = document.createElement('img');
      img.src = logoUrl;
      img.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: white;
        padding: 5px;
        border-radius: 5px;
      `;
      qrElement.appendChild(img);
    }

    const siteName = document.domain;
    const pageTitle = document.title;
    const info = (siteName + ' - ' + pageTitle).substring(0, 15);
    infoElement.textContent = info;

    console.log('QR Code generation complete');
  }

  function copyQRCodeToClipboard() {
    const qrCodeImg = document.querySelector('#qrcode img');
    const logoImg = document.querySelector('#qrcode img[style*="position: absolute"]');
    if (qrCodeImg) {
      const canvas = document.createElement('canvas');
      canvas.width = qrCodeImg.width;
      canvas.height = qrCodeImg.height;
      const ctx = canvas.getContext('2d');
      
      // 繪製 QR Code
      ctx.drawImage(qrCodeImg, 0, 0, qrCodeImg.width, qrCodeImg.height);
      
      // 如果存在 logo，繪製 logo 及其白色背景
      if (logoImg) {
        const drawLogoWithBackground = () => {
          const logoSize = 50; // logo 的大小（包括白色背景）
          const logoInnerSize = 40; // 實際 logo 的大小
          const logoX = (canvas.width - logoSize) / 2;
          const logoY = (canvas.height - logoSize) / 2;

          // 繪製白色背景
          ctx.fillStyle = 'white';
          ctx.fillRect(logoX, logoY, logoSize, logoSize);

          // 繪製 logo
          const logoInnerX = logoX + (logoSize - logoInnerSize) / 2;
          const logoInnerY = logoY + (logoSize - logoInnerSize) / 2;
          ctx.drawImage(logoImg, logoInnerX, logoInnerY, logoInnerSize, logoInnerSize);

          copyCanvasToClipboard(canvas);
        };

        // 如果 logo 已經加載完成，直接繪製
        if (logoImg.complete) {
          drawLogoWithBackground();
        } else {
          // 等待 logo 圖片加載完成
          logoImg.onload = drawLogoWithBackground;
        }
      } else {
        // 如果沒有 logo，直接複製到剪貼板
        copyCanvasToClipboard(canvas);
      }
    }
  }

  function copyCanvasToClipboard(canvas) {
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]).then(() => {
        alert('QR Code with logo has been copied to clipboard!');
      }, (error) => {
        console.error('Error copying QR Code: ', error);
        alert('Failed to copy QR Code. Please try again.');
      });
    });
  }

  function toggleQRCode(visible) {
    if (!qrContainer) {
      generateQRCode(visible);
    }
    qrContainer.style.display = visible ? 'block' : 'none';
    toggleButton.style.display = visible ? 'none' : 'block';
  }

  function saveQRCodeAsImage() {
    const qrCodeImg = document.querySelector('#qrcode img');
    const logoImg = document.querySelector('#qrcode img[style*="position: absolute"]');
    if (qrCodeImg) {
      const canvas = document.createElement('canvas');
      canvas.width = qrCodeImg.width;
      canvas.height = qrCodeImg.height;
      const ctx = canvas.getContext('2d');
      
      // 绘制 QR Code
      ctx.drawImage(qrCodeImg, 0, 0, qrCodeImg.width, qrCodeImg.height);
      
      // 如果存在 logo，绘制 logo 及其白色背景
      if (logoImg) {
        const drawLogoWithBackground = () => {
          const logoSize = 50; // logo 的大小（包括白色背景）
          const logoInnerSize = 40; // 实际 logo 的大小
          const logoX = (canvas.width - logoSize) / 2;
          const logoY = (canvas.height - logoSize) / 2;

          // 绘制白色背景
          ctx.fillStyle = 'white';
          ctx.fillRect(logoX, logoY, logoSize, logoSize);

          // 绘制 logo
          const logoInnerX = logoX + (logoSize - logoInnerSize) / 2;
          const logoInnerY = logoY + (logoSize - logoInnerSize) / 2;
          ctx.drawImage(logoImg, logoInnerX, logoInnerY, logoInnerSize, logoInnerSize);

          saveCanvasAsImage(canvas);
        };

        // 如果 logo 已经加载完成，直接绘制
        if (logoImg.complete) {
          drawLogoWithBackground();
        } else {
          // 等待 logo 图片加载完成
          logoImg.onload = drawLogoWithBackground;
        }
      } else {
        // 如果没有 logo，直接保存
        saveCanvasAsImage(canvas);
      }
    }
  }

  function saveCanvasAsImage(canvas) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // 添加消息監聽器，以便從背景腳本接收消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateQR') {
      if (!qrContainer) generateQRCode(false);
      sendResponse({status: 'QR code generation initiated'});
    } else if (request.action === 'toggleQR') {
      toggleQRCode(request.visible);
      sendResponse({status: 'QR code visibility toggled'});
    } else if (request.action === 'checkInjection') {
      sendResponse({status: 'Content script is injected'});
    }
    return true;  // 表示將異步發送響應
  });

  createToggleButton();
})();