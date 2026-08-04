/**
 * ShieldSight AI - Mock AI Classifier
 * Lightweight implementation of IImageClassifier interface for testing and pipeline validation.
 * Performs zero AI model inference, zero model downloading, and zero image modifications.
 */

import { DiscoveredImage } from '../../types';
import { IImageClassifier, ClassificationResult } from '../../types/queue';

export class MockClassifier implements IImageClassifier {
  readonly id: string = 'mock-classifier-v1';
  readonly name: string = 'ShieldSight Mock Classifier';

  /**
   * Mock classification method simulating asynchronous execution.
   */
  async classify(image: DiscoveredImage): Promise<ClassificationResult> {
    // Simulate brief asynchronous execution delay (e.g. 5ms)
    await new Promise((resolve) => setTimeout(resolve, 5));

    return {
      imageId: image.id,
      isHarmful: false,
      confidence: 0.99,
      label: 'safe_neutral',
      timestamp: Date.now(),
    };
  }
}

export const mockClassifier = new MockClassifier();
