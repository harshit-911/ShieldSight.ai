import { describe, it, expect, vi } from 'vitest';
import { PipelineAuditTracker } from '../../src/services/audit/PipelineAuditTracker';

describe('PipelineAuditTracker Unit Tests', () => {
  it('should track all 8 stages for an image and report page summary statistics', () => {
    const tracker = new PipelineAuditTracker();

    // Image 1: Complete 8-stage success
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 1);
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 2);
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 3);
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 4);
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 5);
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 6, {
      probabilities: { nsfw: 0.98, violence: 0.01 },
    });
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 7, { decision: 'NSFW' });
    tracker.recordStage('img-1', 'https://example.com/1.jpg', 8);

    // Image 2: Skipped due to Low Confidence (SAFE)
    tracker.recordStage('img-2', 'https://example.com/2.jpg', 1);
    tracker.recordStage('img-2', 'https://example.com/2.jpg', 2);
    tracker.recordStage('img-2', 'https://example.com/2.jpg', 3);
    tracker.recordStage('img-2', 'https://example.com/2.jpg', 4);
    tracker.recordStage('img-2', 'https://example.com/2.jpg', 5);
    tracker.recordFailure('img-2', 'https://example.com/2.jpg', 7, 'LOW_CONFIDENCE', 'Classified as SAFE');

    // Image 3: Skipped due to Cross-Origin
    tracker.recordStage('img-3', 'https://example.com/3.jpg', 1);
    tracker.recordFailure('img-3', 'https://example.com/3.jpg', 4, 'CROSS_ORIGIN_ERROR', 'CORS restriction');

    const summary = tracker.getSummary();

    expect(summary.imagesFound).toBe(3);
    expect(summary.imagesClassified).toBe(2);
    expect(summary.imagesProtected).toBe(1);
    expect(summary.imagesSkipped).toBe(2);
    expect(summary.skipReasons.lowConfidence).toBe(1);
    expect(summary.skipReasons.crossOrigin).toBe(1);
  });

  it('should log structured page summary via logPageSummary', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const tracker = new PipelineAuditTracker();

    tracker.recordStage('img-10', 'https://example.com/10.jpg', 1);
    tracker.recordStage('img-10', 'https://example.com/10.jpg', 5);
    tracker.recordStage('img-10', 'https://example.com/10.jpg', 8);

    tracker.logPageSummary();

    expect(consoleSpy).toHaveBeenCalledWith('Images Found      : 1');
    expect(consoleSpy).toHaveBeenCalledWith('Images Classified : 1');
    expect(consoleSpy).toHaveBeenCalledWith('Images Protected  : 1');
  });
});
