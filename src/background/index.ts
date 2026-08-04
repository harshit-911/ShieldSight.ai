/**
 * ShieldSight AI - Background Service Worker
 * Manifest V3 Service Worker managing background lifecycle and extension state events.
 * Handles Tesseract OCR requests inside extension context to bypass webpage CSP network restrictions.
 */

import { storageService } from '../services/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { createWorker } from 'tesseract.js';

console.log('[ShieldSight AI] Background Service Worker Initialized');

// Handle extension lifecycle events
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[ShieldSight AI] Initializing default extension configuration');
    await storageService.setProtectionStatus(DEFAULT_SETTINGS.IS_PROTECTION_ENABLED);
  }
});

// Run OCR recognition inside background worker (extension origin)
async function runOCRBackground(dataUrl: string): Promise<any> {
  const langPath = chrome.runtime.getURL('tessdata');
  console.log(`[ShieldSight Background OCR] Initializing worker using langPath: ${langPath}`);
  
  const worker = await createWorker('eng', 1, {
    langPath,
    cacheMethod: 'none',
  });

  try {
    const recognizeResult = await worker.recognize(dataUrl) as any;
    const data = recognizeResult.data;
    await worker.terminate();
    return {
      text: data.text,
      confidence: data.confidence,
      words: data.words ? data.words.map((w: any) => ({
        text: w.text,
        confidence: w.confidence,
        bbox: w.bbox,
      })) : [],
    };
  } catch (err) {
    await worker.terminate();
    throw err;
  }
}

// Handle incoming messages from popup or content scripts
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
          runOCRBackground(message.payload.dataUrl)
            .then((res) => {
              sendResponse(res);
            })
            .catch((err) => {
              console.error('[ShieldSight Background OCR] Error:', err);
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
