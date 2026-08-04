/**
 * ShieldSight AI - Chrome Messaging Service
 * Handles runtime message passing between Popup, Background Service Worker, and Content Script.
 */

import { ExtensionMessage } from '../types';

class MessagingService {
  private isExtensionEnvironment(): boolean {
    return (
      typeof chrome !== 'undefined' &&
      typeof chrome.runtime !== 'undefined' &&
      typeof chrome.runtime.sendMessage !== 'undefined'
    );
  }

  /**
   * Sends a message to the background service worker or open tabs.
   */
  async sendMessage<T = unknown>(message: ExtensionMessage): Promise<T | null> {
    if (this.isExtensionEnvironment()) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            // Handle expected disconnected port errors gracefully
            console.debug('[ShieldSight Messaging]', chrome.runtime.lastError.message);
            resolve(null);
          } else {
            resolve(response as T);
          }
        });
      });
    }

    console.log('[Dev Mode Messaging Mock]:', message);
    return null;
  }

  /**
   * Listens for runtime extension messages.
   */
  onMessage(
    handler: (
      message: ExtensionMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ) => void | boolean
  ): () => void {
    if (this.isExtensionEnvironment()) {
      chrome.runtime.onMessage.addListener(handler);
      return () => chrome.runtime.onMessage.removeListener(handler);
    }
    return () => {};
  }
}

export const messagingService = new MessagingService();
