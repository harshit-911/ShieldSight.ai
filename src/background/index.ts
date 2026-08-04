/**
 * ShieldSight AI - Background Service Worker
 * Manifest V3 Service Worker managing background lifecycle and extension state events.
 */

import { storageService } from '../services/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { ExtensionMessage } from '../types';

console.log('[ShieldSight AI] Background Service Worker Initialized');

// Handle extension lifecycle events
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[ShieldSight AI] Initializing default extension configuration');
    await storageService.setProtectionStatus(DEFAULT_SETTINGS.IS_PROTECTION_ENABLED);
  }
});

// Handle incoming messages from popup or content scripts
chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    console.log('[ShieldSight AI Background] Received message from:', sender.id || 'internal', message);

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

      default:
        break;
    }
  }
);
