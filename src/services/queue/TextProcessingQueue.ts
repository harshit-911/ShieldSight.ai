/**
 * ShieldSight AI - Text Processing Queue
 * Asynchronous job queue for text block moderation classification.
 * Completely independent from ImageProcessingQueue.
 */

import { DiscoveredTextBlock, ToxicityResult } from '../../types/text';
import { toxicityClassifier, ToxicityClassifier } from '../ai/ToxicityClassifier';

export interface TextJob {
  id: string;
  block: DiscoveredTextBlock;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  result?: ToxicityResult;
  error?: string;
  startTime?: number;
  endTime?: number;
}

type TextQueueEventListener = (event: { type: string; job?: TextJob; error?: Error }) => void;

export class TextProcessingQueue {
  private queue: TextJob[] = [];
  private processing: Map<string, TextJob> = new Map();
  private completed: Map<string, TextJob> = new Map();
  private classifier: ToxicityClassifier;
  private isProcessing: boolean = false;
  private isPaused: boolean = false;
  private listeners: Set<TextQueueEventListener> = new Set();
  private concurrency: number = 2;

  constructor(classifier: ToxicityClassifier = toxicityClassifier) {
    this.classifier = classifier;
  }

  /**
   * Enqueues a discovered text block for moderation.
   */
  enqueue(block: DiscoveredTextBlock): TextJob {
    const job: TextJob = {
      id: `text-job-${block.id}`,
      block,
      status: 'PENDING',
    };

    this.queue.push(job);
    this.emit({ type: 'JOB_ENQUEUED', job });
    this.processNext();
    return job;
  }

  /**
   * Starts processing text jobs in the queue.
   */
  start(): void {
    this.isPaused = false;
    this.processNext();
  }

  /**
   * Pauses queue processing.
   */
  pause(): void {
    this.isPaused = true;
  }

  /**
   * Registers an event listener for text queue events.
   */
  on(_event: string, listener: TextQueueEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async processNext(): Promise<void> {
    if (this.isPaused || this.isProcessing) return;
    if (this.processing.size >= this.concurrency) return;
    if (this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();

    if (!job) {
      this.isProcessing = false;
      return;
    }

    job.status = 'PROCESSING';
    job.startTime = Date.now();
    this.processing.set(job.id, job);
    this.emit({ type: 'JOB_STARTED', job });

    try {
      const result = await this.classifier.classify(job.block);
      job.status = 'COMPLETED';
      job.result = result;
      job.endTime = Date.now();

      this.processing.delete(job.id);
      this.completed.set(job.id, job);
      this.emit({ type: 'JOB_COMPLETED', job });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      job.status = 'FAILED';
      job.error = error.message;
      job.endTime = Date.now();

      this.processing.delete(job.id);
      this.emit({ type: 'JOB_FAILED', job, error });
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }

  private emit(event: { type: string; job?: TextJob; error?: Error }): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[ShieldSight Text Queue] Listener error:', err);
      }
    });
  }
}

export const textProcessingQueue = new TextProcessingQueue();
