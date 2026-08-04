/**
 * ShieldSight AI - Pipeline Audit Tracker & Diagnostics Service
 * Tracks every discovered image through 8 execution stages, logs specific failure/skip codes,
 * and outputs structured page diagnostic summaries.
 */

export type AuditStageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type AuditFailureReason =
  | 'NOT_DISCOVERED'
  | 'QUEUE_SKIPPED'
  | 'PREPROCESS_FAILED'
  | 'CROSS_ORIGIN_ERROR'
  | 'MODEL_ERROR'
  | 'LOW_CONFIDENCE'
  | 'PROTECTION_ALREADY_EXISTS'
  | 'DOM_REPLACED'
  | 'IMAGE_REMOVED'
  | 'OVERLAY_FAILED'
  | 'INVISIBLE';

export interface ImageAuditRecord {
  imageId: string;
  imageSrc: string;
  currentStage: AuditStageNumber;
  completedStages: AuditStageNumber[];
  failedStage?: AuditStageNumber;
  failureReason?: AuditFailureReason;
  failureDetails?: string;
  probabilities?: { nsfw: number; violence: number };
  decision?: string;
  timestamp: number;
}

export interface AuditPageSummary {
  imagesFound: number;
  imagesClassified: number;
  imagesProtected: number;
  imagesSkipped: number;
  skipReasons: {
    crossOrigin: number;
    lowConfidence: number;
    domReplaced: number;
    alreadyProcessed: number;
    invisible: number;
    other: number;
  };
}

export class PipelineAuditTracker {
  private records: Map<string, ImageAuditRecord> = new Map();

  /**
   * Records successful completion of a specific pipeline stage for an image.
   */
  recordStage(imageId: string, imageSrc: string, stage: AuditStageNumber, meta?: Record<string, any>): void {
    let record = this.records.get(imageId);
    if (!record) {
      record = {
        imageId,
        imageSrc,
        currentStage: stage,
        completedStages: [],
        timestamp: Date.now(),
      };
      this.records.set(imageId, record);
    }

    record.currentStage = stage;
    if (!record.completedStages.includes(stage)) {
      record.completedStages.push(stage);
    }

    if (meta) {
      if (meta.probabilities) record.probabilities = meta.probabilities;
      if (meta.decision) record.decision = meta.decision;
    }

    this.logStageSuccess(imageId, stage, meta);
  }

  /**
   * Records a failure or skip event at a specific pipeline stage.
   */
  recordFailure(
    imageId: string,
    imageSrc: string,
    stage: AuditStageNumber,
    reason: AuditFailureReason,
    details?: string
  ): void {
    let record = this.records.get(imageId);
    if (!record) {
      record = {
        imageId,
        imageSrc,
        currentStage: stage,
        completedStages: [],
        timestamp: Date.now(),
      };
      this.records.set(imageId, record);
    }

    record.failedStage = stage;
    record.failureReason = reason;
    record.failureDetails = details;

    console.warn(
      `%c[ShieldSight Stage ${stage} FAILED]%c ${imageId} → ${reason}${details ? ` (${details})` : ''}`,
      'color: #ef4444; font-weight: bold;',
      'color: #cbd5e1;'
    );
  }

  /**
   * Logs clean stage success message to console.
   */
  private logStageSuccess(imageId: string, stage: AuditStageNumber, meta?: Record<string, any>): void {
    const stageNames: Record<AuditStageNumber, string> = {
      1: 'Image discovered',
      2: 'Added to processing queue',
      3: 'Queue started processing',
      4: 'Image successfully preprocessed',
      5: 'AI inference completed',
      6: 'Probability returned',
      7: 'Decision Engine result',
      8: 'Blur applied successfully',
    };

    let detailStr = '';
    if (stage === 6 && meta?.probabilities) {
      detailStr = ` | NSFW: ${(meta.probabilities.nsfw * 100).toFixed(1)}% | Violence: ${(meta.probabilities.violence * 100).toFixed(1)}%`;
    } else if (stage === 7 && meta?.decision) {
      detailStr = ` | Decision: ${meta.decision}`;
    }

    console.log(
      `%c[ShieldSight Stage ${stage}]%c ✓ ${stageNames[stage]}: ${imageId}${detailStr}`,
      'color: #10b981; font-weight: bold;',
      'color: #f8fafc;'
    );
  }

  /**
   * Calculates real-time page diagnostic summary.
   */
  getSummary(): AuditPageSummary {
    let imagesFound = 0;
    let imagesClassified = 0;
    let imagesProtected = 0;
    let imagesSkipped = 0;

    const skipReasons = {
      crossOrigin: 0,
      lowConfidence: 0,
      domReplaced: 0,
      alreadyProcessed: 0,
      invisible: 0,
      other: 0,
    };

    this.records.forEach((rec) => {
      if (rec.completedStages.includes(1)) {
        imagesFound += 1;
      }
      if (rec.completedStages.includes(5)) {
        imagesClassified += 1;
      }
      if (rec.completedStages.includes(8)) {
        imagesProtected += 1;
      }

      if (rec.failureReason) {
        imagesSkipped += 1;
        switch (rec.failureReason) {
          case 'CROSS_ORIGIN_ERROR':
            skipReasons.crossOrigin += 1;
            break;
          case 'LOW_CONFIDENCE':
            skipReasons.lowConfidence += 1;
            break;
          case 'DOM_REPLACED':
          case 'IMAGE_REMOVED':
            skipReasons.domReplaced += 1;
            break;
          case 'QUEUE_SKIPPED':
          case 'PROTECTION_ALREADY_EXISTS':
            skipReasons.alreadyProcessed += 1;
            break;
          case 'INVISIBLE':
          case 'NOT_DISCOVERED':
            skipReasons.invisible += 1;
            break;
          default:
            skipReasons.other += 1;
            break;
        }
      }
    });

    return {
      imagesFound,
      imagesClassified,
      imagesProtected,
      imagesSkipped,
      skipReasons,
    };
  }

  /**
   * Logs structured summary report after a page scan or when processing is complete.
   */
  logPageSummary(): void {
    const summary = this.getSummary();

    console.group('%c[ShieldSight AI Page Audit Summary]', 'color: #3b82f6; font-weight: bold;');
    console.log(`Images Found      : ${summary.imagesFound}`);
    console.log(`Images Classified : ${summary.imagesClassified}`);
    console.log(`Images Protected  : ${summary.imagesProtected}`);
    console.log(`Images Skipped    : ${summary.imagesSkipped}`);
    console.log('Skip reasons breakdown:');
    console.log(`  • Cross-origin      : ${summary.skipReasons.crossOrigin}`);
    console.log(`  • Low confidence    : ${summary.skipReasons.lowConfidence}`);
    console.log(`  • DOM replaced      : ${summary.skipReasons.domReplaced}`);
    console.log(`  • Already processed : ${summary.skipReasons.alreadyProcessed}`);
    console.log(`  • Invisible         : ${summary.skipReasons.invisible}`);
    console.log(`  • Other             : ${summary.skipReasons.other}`);
    console.groupEnd();
  }

  /**
   * Clears stored audit records.
   */
  clear(): void {
    this.records.clear();
  }
}

export const pipelineAuditTracker = new PipelineAuditTracker();
