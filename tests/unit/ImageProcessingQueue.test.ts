import { describe, it, expect, beforeEach } from 'vitest';
import { ImageProcessingQueue } from '../../src/services/queue/ImageProcessingQueue';
import { mockClassifier } from '../../src/services/queue/MockClassifier';
import { DiscoveredImage } from '../../src/types';
import { IImageClassifier, ClassificationResult } from '../../src/types/queue';

function createMockDiscoveredImage(id: string, src?: string): DiscoveredImage {
  const img = document.createElement('img');
  img.src = src || `https://example.com/${id}.jpg`;
  return {
    id,
    element: img,
    src: img.src,
    naturalWidth: 800,
    naturalHeight: 600,
    discoverySource: 'initial_scan',
    timestamp: Date.now(),
  };
}

describe('ImageProcessingQueue Unit Tests', () => {
  let queue: ImageProcessingQueue;

  beforeEach(() => {
    queue = new ImageProcessingQueue(3, 2, mockClassifier);
  });

  it('should enqueue valid discovered images', () => {
    const img1 = createMockDiscoveredImage('img-1');
    const img2 = createMockDiscoveredImage('img-2');

    expect(queue.enqueue(img1)).toBe(true);
    expect(queue.enqueue(img2)).toBe(true);
    expect(queue.getStats().queueSize).toBe(2);
  });

  it('should prevent duplicate job enqueueing for same image ID or URL', () => {
    const img1 = createMockDiscoveredImage('img-1', 'https://example.com/same.jpg');
    const img1Duplicate = createMockDiscoveredImage('img-1', 'https://example.com/same.jpg');

    expect(queue.enqueue(img1)).toBe(true);
    expect(queue.enqueue(img1Duplicate)).toBe(false);
    expect(queue.getStats().queueSize).toBe(1);
  });

  it('should enforce maximum concurrency limit of 3 simultaneous jobs', async () => {
    let activeJobCount = 0;
    let maxObservedConcurrency = 0;

    const slowClassifier: IImageClassifier = {
      id: 'slow-classifier',
      name: 'Slow Mock Classifier',
      async classify(image: DiscoveredImage): Promise<ClassificationResult> {
        activeJobCount += 1;
        maxObservedConcurrency = Math.max(maxObservedConcurrency, activeJobCount);
        await new Promise((r) => setTimeout(r, 20));
        activeJobCount -= 1;
        return {
          imageId: image.id,
          isHarmful: false,
          confidence: 1.0,
          label: 'safe',
          timestamp: Date.now(),
        };
      },
    };

    queue.setClassifier(slowClassifier);

    for (let i = 1; i <= 10; i++) {
      queue.enqueue(createMockDiscoveredImage(`img-${i}`));
    }

    queue.start();

    // Wait for all jobs to complete
    await new Promise((r) => setTimeout(r, 150));

    expect(maxObservedConcurrency).toBeLessThanOrEqual(3);
    expect(queue.getStats().completed).toBe(10);
    expect(queue.getStats().queueSize).toBe(0);
  });

  it('should maintain FIFO processing order', async () => {
    const processedOrder: string[] = [];

    const fifoClassifier: IImageClassifier = {
      id: 'fifo-classifier',
      name: 'FIFO Classifier',
      async classify(image: DiscoveredImage): Promise<ClassificationResult> {
        processedOrder.push(image.id);
        return {
          imageId: image.id,
          isHarmful: false,
          confidence: 1.0,
          label: 'safe',
          timestamp: Date.now(),
        };
      },
    };

    const singleQueue = new ImageProcessingQueue(1, 0, fifoClassifier);
    singleQueue.enqueue(createMockDiscoveredImage('first'));
    singleQueue.enqueue(createMockDiscoveredImage('second'));
    singleQueue.enqueue(createMockDiscoveredImage('third'));

    singleQueue.start();

    await new Promise((r) => setTimeout(r, 50));

    expect(processedOrder).toEqual(['first', 'second', 'third']);
  });

  it('should retry temporary failures up to maxRetries before marking failed', async () => {
    let attempts = 0;

    const failingClassifier: IImageClassifier = {
      id: 'failing-classifier',
      name: 'Failing Classifier',
      async classify(): Promise<ClassificationResult> {
        attempts += 1;
        throw new Error('Temporary network glitch');
      },
    };

    const retryQueue = new ImageProcessingQueue(1, 2, failingClassifier);
    retryQueue.enqueue(createMockDiscoveredImage('flaky-img'));

    retryQueue.start();

    await new Promise((r) => setTimeout(r, 50));

    expect(attempts).toBe(3); // 1 initial attempt + 2 retries
    expect(retryQueue.getStats().failed).toBe(1);
  });

  it('should emit queue events (QUEUE_STARTED, JOB_STARTED, JOB_COMPLETED, QUEUE_IDLE)', async () => {
    const eventsTriggered: string[] = [];

    queue.on('QUEUE_STARTED', () => eventsTriggered.push('QUEUE_STARTED'));
    queue.on('JOB_STARTED', () => eventsTriggered.push('JOB_STARTED'));
    queue.on('JOB_COMPLETED', () => eventsTriggered.push('JOB_COMPLETED'));
    queue.on('QUEUE_IDLE', () => eventsTriggered.push('QUEUE_IDLE'));

    queue.enqueue(createMockDiscoveredImage('event-img'));
    queue.start();

    await new Promise((r) => setTimeout(r, 50));

    expect(eventsTriggered).toContain('QUEUE_STARTED');
    expect(eventsTriggered).toContain('JOB_STARTED');
    expect(eventsTriggered).toContain('JOB_COMPLETED');
    expect(eventsTriggered).toContain('QUEUE_IDLE');
  });
});
