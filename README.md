# QR Code Generator Chrome Extension

This Chrome extension allows users to generate QR codes for the current webpage, copy them to the clipboard, and save them as image files.

## Features

- Generate QR codes for the current webpage
- Display QR codes with the website's logo in the center
- Copy QR codes to the clipboard
- Save QR codes as PNG image files
- Toggle QR code visibility with a single click

## Installation

1. Clone this repository or download the ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click the extension icon in the Chrome toolbar to toggle the QR code visibility.
2. When the QR code is visible, you can:
   - Click the close button (×) to hide the QR code
   - Click the copy button (📋) to copy the QR code to your clipboard
   - Click the save button (💾) to download the QR code as a PNG file

## Files

- `manifest.json`: Extension configuration file
- `background.js`: Background script for handling extension events
- `content.js`: Content script for generating and manipulating QR codes
- `popup.js`: Script for the extension popup
- `qrcode.min.js`: QR code generation library

## Permissions

This extension requires the following permissions:

- `activeTab`: To access the current tab's URL
- `scripting`: To inject and execute scripts
- `tabs`: To interact with browser tabs
- `storage`: For potential future features (currently unused)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).