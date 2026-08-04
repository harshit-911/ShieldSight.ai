/**
 * ShieldSight AI - Queue Type Definitions
 * Type definitions for the Image Processing Queue and AI Classifier interface.
 */

import { DiscoveredImage } from './index';

/** Classification result emitted by AI classifiers */
export interface ClassificationResult {
  /** Identifier of the processed image */
  imageId: string;
  /** Flag indicating whether the image is classified as harmful */
  isHarmful: boolean;
  /** Classification confidence score (0.0 to 1.0) */
  confidence: number;
  /** Classification category or label */
  label: string;
  /** Timestamp when classification completed */
  timestamp: number;
}

/**
 * Standardized interface for future AI classifier implementations
 * (e.g. ONNX Runtime Web, OpenNSFW2, custom TensorFlow.js models)
 */
export interface IImageClassifier {
  /** Unique classifier identifier */
  readonly id: string;
  /** Human-readable classifier name */
  readonly name: string;

  /**
   * Executes AI classification on a discovered image element.
   * @param image Discovered webpage image record
   */
  classify(image: DiscoveredImage): Promise<ClassificationResult>;
}

/** Status states of a queue job */
export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'retrying';

/** Internal job object managed by the processing queue */
export interface QueueJob {
  /** Unique job ID (matches DiscoveredImage.id) */
  id: string;
  /** Reference to the discovered image */
  image: DiscoveredImage;
  /** Current job status */
  status: JobStatus;
  /** Current retry attempt count */
  retryCount: number;
  /** Maximum retry limit */
  maxRetries: number;
  /** Epoch timestamp when job was enqueued */
  addedTimestamp: number;
  /** Epoch timestamp when job started processing */
  startTime?: number;
  /** Epoch timestamp when job completed or failed */
  endTime?: number;
  /** Error message if job failed */
  error?: string;
  /** Classification result if job completed */
  result?: ClassificationResult;
}

/** Events emitted by the ImageProcessingQueue */
export type QueueEventType =
  | 'QUEUE_STARTED'
  | 'JOB_STARTED'
  | 'JOB_COMPLETED'
  | 'JOB_FAILED'
  | 'QUEUE_IDLE';

/** Payload emitted with queue events */
export interface QueueEvent {
  type: QueueEventType;
  job?: QueueJob;
  stats: QueueStats;
}

/** Real-time statistics tracking queue state and performance */
export interface QueueStats {
  /** Number of pending jobs waiting in queue */
  queueSize: number;
  /** Number of jobs currently being processed concurrently */
  jobsRunning: number;
  /** Total number of successfully completed jobs */
  completed: number;
  /** Total number of permanently failed jobs */
  failed: number;
  /** Total number of processed jobs (completed + failed) */
  totalProcessed: number;
  /** Average processing duration in milliseconds */
  averageProcessingTimeMs: number;
}
