/**
 * ShieldSight AI - Conversation Discovery Service
 * Monitors active chat feeds in real-time, matching messages using platform-specific adapters.
 * Uses MutationObserver to capture new and edited message elements, bypassing system updates.
 */

import { MessageElement, ConversationAdapter } from './ConversationTypes';
import { WhatsAppWebAdapter, GenericConversationAdapter } from './ConversationAdapter';
import { conversationQueue } from './ConversationQueue';
import { obscureMessage } from './ConversationUtils';
import { logger } from '../../utils/logger';

export class ConversationDiscoveryService {
  private adapters: ConversationAdapter[] = [];
  private activeAdapter: ConversationAdapter | null = null;
  private observer: MutationObserver | null = null;
  private processedElements: WeakSet<HTMLElement> = new WeakSet();
  private elementToMessageMap: Map<HTMLElement, MessageElement> = new Map();
  private isRunning: boolean = false;
  private onDiscoveredCallback: ((message: MessageElement) => void) | null = null;

  constructor() {
    this.adapters.push(new WhatsAppWebAdapter());
    // Generic chat adapter handles any other URL fallback
    this.adapters.push(new GenericConversationAdapter());
  }

  onDiscovered(callback: (message: MessageElement) => void): () => void {
    this.onDiscoveredCallback = callback;
    return () => {
      this.onDiscoveredCallback = null;
    };
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // 1. Select matching adapter based on URL hostname
    const currentUrl = new URL(window.location.href);
    this.activeAdapter = this.adapters.find((a) => a.canHandle(currentUrl)) || null;

    if (!this.activeAdapter) {
      logger.warn('[Conversation Discovery] No matching chat platform adapter found.');
      return;
    }

    logger.info(`[Conversation Discovery] Active platform adapter: ${this.activeAdapter.platformName}`);

    // 2. Perform initial scan of current DOM elements
    this.scanSubtree(document.body);

    // 3. Initialize MutationObserver to capture live additions and edits
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Detect newly added DOM nodes
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.scanSubtree(node);
          }
        });

        // Detect edited message texts (characterData or subtree alterations)
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          const target = mutation.target.parentElement;
          if (target && this.elementToMessageMap.has(target)) {
            const originalMsg = this.elementToMessageMap.get(target);
            if (originalMsg) {
              const currentText = (target.textContent || '').trim();
              if (currentText !== originalMsg.text && !currentText.includes('Sensitive Message Hidden')) {
                // Text changed -> Message was edited! Clear from processed WeakSet and re-scan
                logger.info(`[Conversation Discovery] Edited text detected in message ${originalMsg.id}`);
                this.processedElements.delete(target);
                originalMsg.text = currentText;
                this.processSingleElement(target, originalMsg.sender);
              }
            }
          }
        }

        // Garbage collection: cancel queue or mapping for removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.querySelectorAll('*').forEach((el) => {
              if (el instanceof HTMLElement && this.elementToMessageMap.has(el)) {
                const msg = this.elementToMessageMap.get(el);
                if (msg) {
                  logger.info(`[Conversation Discovery] Chat element removed: cleaning message ${msg.id}`);
                  this.elementToMessageMap.delete(el);
                }
              }
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Handle completed processing events
    conversationQueue.on('MESSAGE_COMPLETED', (event) => {
      if (event.result && event.result.isHarmful) {
        obscureMessage(event.message, event.result);
      }
    });

    conversationQueue.start();
  }

  /**
   * Scans a subtree of the DOM for matching message containers.
   */
  private async scanSubtree(root: HTMLElement): Promise<void> {
    if (!this.activeAdapter) return;

    try {
      const messages = await this.activeAdapter.discoverMessages(root);
      messages.forEach((msg) => {
        const el = msg.element;

        if (this.processedElements.has(el)) return;
        this.processedElements.add(el);
        this.elementToMessageMap.set(el, msg);

        if (this.onDiscoveredCallback) {
          this.onDiscoveredCallback(msg);
        } else {
          // Default fallthrough: enqueue to conversation queue
          conversationQueue.enqueue(msg);
        }
      });
    } catch (err) {
      logger.error('[Conversation Discovery] Subtree scan failed', err);
    }
  }

  /**
   * Evaluates a single message element (e.g. for edits).
   */
  private processSingleElement(el: HTMLElement, sender: 'incoming' | 'outgoing'): void {
    if (!this.activeAdapter) return;

    const text = (el.textContent || '').trim();
    if (!text) return;

    const msg: MessageElement = {
      id: `msg_edit_${Date.now()}`,
      timestamp: Date.now(),
      sender,
      text,
      platform: this.activeAdapter.platformName,
      element: el,
      status: 'pending',
    };

    this.processedElements.add(el);
    this.elementToMessageMap.set(el, msg);
    conversationQueue.enqueue(msg);
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    conversationQueue.pause();
    conversationQueue.clear();
    this.elementToMessageMap.clear();
  }
}

export const conversationDiscoveryService = new ConversationDiscoveryService();
export default conversationDiscoveryService;
