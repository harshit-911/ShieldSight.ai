/**
 * ShieldSight AI - Conversation Processing Queue
 * Runs toxic conversation text analysis asynchronously.
 */

import { MessageElement } from './ConversationTypes';
import { toxicityClassifier } from '../ai/ToxicityClassifier';
import { ToxicityResult } from '../../types/text';
import { logger } from '../../utils/logger';

export type ConversationQueueEvent = 'MESSAGE_COMPLETED' | 'MESSAGE_FAILED';

export class ConversationQueue {
  private queue: MessageElement[] = [];
  private activeJobsCount: number = 0;
  private maxConcurrency: number = 2;
  private isProcessing: boolean = false;
  private listeners: Map<ConversationQueueEvent, Array<(event: { message: MessageElement; result?: ToxicityResult }) => void>> = new Map();

  constructor() {
    this.listeners.set('MESSAGE_COMPLETED', []);
    this.listeners.set('MESSAGE_FAILED', []);
  }

  on(event: ConversationQueueEvent, callback: (event: { message: MessageElement; result?: ToxicityResult }) => void): () => void {
    const list = this.listeners.get(event) || [];
    list.push(callback);
    this.listeners.set(event, list);

    return () => {
      const current = this.listeners.get(event) || [];
      this.listeners.set(event, current.filter((cb) => cb !== callback));
    };
  }

  private emit(event: ConversationQueueEvent, data: { message: MessageElement; result?: ToxicityResult }): void {
    const list = this.listeners.get(event) || [];
    list.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        logger.error('[ConversationQueue] Listener execution failed', err);
      }
    });
  }

  enqueue(message: MessageElement): void {
    // Avoid double enqueuing
    if (this.queue.some((m) => m.id === message.id)) return;
    this.queue.push(message);
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (!this.isProcessing && this.queue.length === 0) return;
    if (this.activeJobsCount >= this.maxConcurrency) return;

    const message = this.queue.shift();
    if (!message) return;

    this.activeJobsCount++;
    message.status = 'processing';

    try {
      // Reuse existing ToxicityClassifier text evaluation
      const result = await toxicityClassifier.classify({
        id: message.id,
        text: message.text,
        element: message.element,
        timestamp: message.timestamp,
      });

      message.status = 'completed';
      this.emit('MESSAGE_COMPLETED', { message, result });
    } catch (err) {
      logger.error(`[ConversationQueue] Failed to process message ${message.id}`, err);
      message.status = 'failed';
      this.emit('MESSAGE_FAILED', { message });
    } finally {
      this.activeJobsCount--;
      this.processNext();
    }
  }

  start(): void {
    this.isProcessing = true;
    this.processNext();
  }

  pause(): void {
    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
  }
}

export const conversationQueue = new ConversationQueue();
