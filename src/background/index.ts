/**
 * ShieldSight AI - Background Service Worker
 * Manifest V3 Service Worker managing background lifecycle and extension state events.
 * Spawns and delegates heavy OCR tasks to the Offscreen Document context to bypass MV3 Service Worker limitations.
 */

import { storageService } from '../services/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';

console.log('[ShieldSight AI] Background Service Worker Initialized');

// Handle extension lifecycle events
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[ShieldSight AI] Initializing default extension configuration');
    await storageService.setProtectionStatus(DEFAULT_SETTINGS.IS_PROTECTION_ENABLED);
  }
});

// Helper to ensure Offscreen Document is instantiated
async function createOffscreenDocument(): Promise<void> {
  // Fallback hasDocument check
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  console.log('[ShieldSight Background] Creating Offscreen Document for OCR tasks...');
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.DOM_PARSER],
    justification: 'Run Tesseract OCR engine in DOM context with Web Workers support',
  });
}

// Proxies OCR request to Offscreen Document DOM context (with retry loop to prevent race conditions during startup)
async function runOCROffscreenViaDocument(dataUrl: string): Promise<any> {
  await createOffscreenDocument();

  for (let i = 0; i < 6; i++) {
    try {
      const res = await new Promise<any>((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            type: 'RUN_OCR_OFFSCREEN',
            payload: { dataUrl },
          },
          (res) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(res);
            }
          }
        );
      });
      if (res && res.error) {
        throw new Error(res.error);
      }
      return res;
    } catch (err) {
      console.warn(`[ShieldSight Background OCR Proxy] Attempt ${i + 1} failed:`, err);
      if (i === 5) {
        throw err;
      }
      // Delay before next attempt to allow Offscreen Document loading to complete
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}

// Handle incoming messages from popup, content scripts, or offscreen document
chrome.runtime.onMessage.addListener(
  (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    console.log('[ShieldSight AI Background] Received message from:', sender.id || 'internal', message.type);

    switch (message.type) {
      case 'GET_PROTECTION_STATUS':
        storageService.getProtectionStatus().then((enabled) => {
          sendResponse({ enabled });
        });
        return true; // Keep channel open for async response

      case 'TOGGLE_PROTECTION':
        storageService.setProtectionStatus(message.payload.enabled).then(() => {
          sendResponse({ success: true, enabled: message.payload.enabled });
        });
        return true;

      case 'RUN_OCR':
        if (message.payload && message.payload.dataUrl) {
          runOCROffscreenViaDocument(message.payload.dataUrl)
            .then((res) => {
              sendResponse(res);
            })
            .catch((err) => {
              console.error('[ShieldSight Background OCR Proxy] Error:', err);
              sendResponse({ error: err.message || String(err) });
            });
          return true; // Keep channel open for async response
        }
        sendResponse({ error: 'Missing dataUrl payload' });
        break;

      default:
        break;
    }
  }
);
