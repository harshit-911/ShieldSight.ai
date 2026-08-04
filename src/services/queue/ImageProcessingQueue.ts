/**
 * ShieldSight AI - Image Processing Queue
 * Robust, asynchronous queue manager handling job scheduling, concurrency control,
 * automatic retries, duplicate prevention, and event dispatching for AI classification.
 */

import { DiscoveredImage } from '../../types';
import {
  QueueJob,
  QueueStats,
  QueueEventType,
  QueueEvent,
  IImageClassifier,
  ClassificationResult,
} from '../../types/queue';
import { aiOrchestrator } from '../ai/AIOrchestrator';
import { pipelineAuditTracker } from '../audit/PipelineAuditTracker';

export const DEFAULT_MAX_CONCURRENCY = 3;
export const DEFAULT_MAX_RETRIES = 2;

type QueueEventListener = (event: QueueEvent) => void;

export class ImageProcessingQueue {
  private maxConcurrency: number;
  private maxRetries: number;
  private classifier: IImageClassifier;

  private pendingJobs: QueueJob[] = [];
  private activeJobs: Map<string, QueueJob> = new Map();
  private completedJobs: Map<string, QueueJob> = new Map();
  private failedJobs: Map<string, QueueJob> = new Map();
  private registeredUrls: Set<string> = new Set();

  private isRunning: boolean = false;
  private totalProcessingTimeMs: number = 0;
  private listeners: Map<QueueEventType, Set<QueueEventListener>> = new Map();

  constructor(
    maxConcurrency: number = DEFAULT_MAX_CONCURRENCY,
    maxRetries: number = DEFAULT_MAX_RETRIES,
    classifier: IImageClassifier = aiOrchestrator
  ) {
    this.maxConcurrency = maxConcurrency;
    this.maxRetries = maxRetries;
    this.classifier = classifier;
  }

  /**
   * Sets or updates the active AI classifier engine.
   */
  setClassifier(classifier: IImageClassifier): void {
    this.classifier = classifier;
    console.log(`[ShieldSight Queue] Active classifier set to: ${classifier.name}`);
  }

  /**
   * Enqueues a discovered image for asynchronous classification.
   * Prevents duplicates if the image is already pending, running, completed, or failed.
   * @returns boolean True if image was successfully enqueued, false if ignored
   */
  enqueue(image: DiscoveredImage): boolean {
    const jobKey = image.id;
    const urlKey = image.src;

    // Duplicate check
    if (
      this.registeredUrls.has(urlKey) ||
      this.activeJobs.has(jobKey) ||
      this.completedJobs.has(jobKey) ||
      this.failedJobs.has(jobKey) ||
      this.pendingJobs.some((j) => j.id === jobKey)
    ) {
      pipelineAuditTracker.recordFailure(image.id, image.src, 2, 'QUEUE_SKIPPED', 'Duplicate image enqueue ignored');
      return false;
    }

    const job: QueueJob = {
      id: image.id,
      image,
      status: 'pending',
      retryCount: 0,
      maxRetries: this.maxRetries,
      addedTimestamp: Date.now(),
    };

    this.pendingJobs.push(job);
    this.registeredUrls.add(urlKey);

    // Stage 2 Audit Logging
    pipelineAuditTracker.recordStage(image.id, image.src, 2);

    // If queue is running, process next batch
    if (this.isRunning) {
      this.processNext();
    }

    return true;
  }

  /**
   * Starts processing queued jobs.
   */
  start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    console.log('[ShieldSight Queue] Queue processing started');
    this.emitEvent('QUEUE_STARTED');
    this.processNext();
  }

  /**
   * Pauses queue execution. Running jobs will finish, but no new jobs will be started.
   */
  pause(): void {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    console.log('[ShieldSight Queue] Queue processing paused');
  }

  /**
   * Clears all pending, completed, and failed jobs and resets statistics.
   */
  clear(): void {
    this.pendingJobs = [];
    this.activeJobs.clear();
    this.completedJobs.clear();
    this.failedJobs.clear();
    this.registeredUrls.clear();
    this.totalProcessingTimeMs = 0;
    console.log('[ShieldSight Queue] Queue cleared');
  }

  /**
   * Returns real-time queue statistics.
   */
  getStats(): QueueStats {
    const completed = this.completedJobs.size;
    const failed = this.failedJobs.size;
    const totalProcessed = completed + failed;
    const averageProcessingTimeMs =
      totalProcessed > 0 ? Math.round(this.totalProcessingTimeMs / totalProcessed) : 0;

    return {
      queueSize: this.pendingJobs.length,
      jobsRunning: this.activeJobs.size,
      completed,
      failed,
      totalProcessed,
      averageProcessingTimeMs,
    };
  }

  /**
   * Registers an event listener for queue events.
   * @returns Cleanup unsubscribe function
   */
  on(eventType: QueueEventType, listener: QueueEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(listener);
      }
    };
  }

  /**
   * Triggers processing of the next pending FIFO job up to concurrency limit.
   */
  private processNext(): void {
    if (!this.isRunning) {
      return;
    }

    while (
      this.activeJobs.size < this.maxConcurrency &&
      this.pendingJobs.length > 0
    ) {
      const job = this.pendingJobs.shift()!;
      this.executeJob(job);
    }

    // Check if queue is idle
    if (this.activeJobs.size === 0 && this.pendingJobs.length === 0) {
      this.emitEvent('QUEUE_IDLE');
      pipelineAuditTracker.logPageSummary();
    }
  }

  /**
   * Executes a single classification job with automatic retries and logging.
   */
  private async executeJob(job: QueueJob): Promise<void> {
    job.status = 'processing';
    job.startTime = Date.now();
    this.activeJobs.set(job.id, job);

    // Stage 3 Audit Logging
    pipelineAuditTracker.recordStage(job.image.id, job.image.src, 3);

    this.emitEvent('JOB_STARTED', job);

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI Inference Timeout Safeguard (3.5s)')), 3500)
      );

      const result: ClassificationResult = await Promise.race([
        this.classifier.classify(job.image),
        timeoutPromise,
      ]);

      job.status = 'completed';
      job.endTime = Date.now();
      job.result = result;

      const duration = job.endTime - (job.startTime || job.addedTimestamp);
      this.totalProcessingTimeMs += duration;

      this.activeJobs.delete(job.id);
      this.completedJobs.set(job.id, job);

      this.emitEvent('JOB_COMPLETED', job);
      this.logQueueStats(`Job ${job.id} completed in ${duration}ms`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      if (job.retryCount < job.maxRetries) {
        job.retryCount += 1;
        job.status = 'retrying';
        console.warn(
          `[ShieldSight Queue] Retrying job ${job.id} (Attempt ${job.retryCount}/${job.maxRetries}): ${errorMsg}`
        );
        this.activeJobs.delete(job.id);
        this.pendingJobs.push(job); // Re-queue for retry
      } else {
        job.status = 'failed';
        job.endTime = Date.now();
        job.error = errorMsg;

        const duration = job.endTime - (job.startTime || job.addedTimestamp);
        this.totalProcessingTimeMs += duration;

        this.activeJobs.delete(job.id);
        this.failedJobs.set(job.id, job);

        this.emitEvent('JOB_FAILED', job);
        this.logQueueStats(`Job ${job.id} failed after ${job.retryCount} retries: ${errorMsg}`);
      }
    }

    // Continue processing remaining jobs
    this.processNext();
  }

  /**
   * Dispatches queue event to registered listeners.
   */
  private emitEvent(type: QueueEventType, job?: QueueJob): void {
    const stats = this.getStats();
    const event: QueueEvent = { type, job, stats };

    const set = this.listeners.get(type);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error('[ShieldSight Queue] Listener error:', err);
        }
      });
    }
  }

  /**
   * Logs structured queue statistics.
   */
  private logQueueStats(context: string): void {
    const stats = this.getStats();
    console.log(
      `%c[ShieldSight Queue Stats]%c ${context}`,
      'color: #3b82f6; font-weight: bold;',
      'color: #cbd5e1;',
      {
        queueSize: stats.queueSize,
        jobsRunning: stats.jobsRunning,
        completed: stats.completed,
        failed: stats.failed,
        avgProcessingTimeMs: `${stats.averageProcessingTimeMs}ms`,
      }
    );
  }
}

export const imageProcessingQueue = new ImageProcessingQueue();
