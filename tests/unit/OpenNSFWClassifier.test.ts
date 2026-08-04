import { describe, it, expect, vi } from 'vitest';
import { ImagePreprocessor } from '../../src/services/ai/ImagePreprocessor';
import { ModelLoader } from '../../src/services/ai/ModelLoader';
import { OpenNSFWClassifier } from '../../src/services/ai/OpenNSFWClassifier';
import { DiscoveredImage } from '../../src/types';

function createMockDiscoveredImage(id: string): DiscoveredImage {
  const img = document.createElement('img');
  img.src = `https://example.com/${id}.jpg`;
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

describe('OpenNSFW AI Classifier Unit Tests', () => {
  describe('ImagePreprocessor', () => {
    it('should preprocess image URL into 224x224 BGR Float32Array tensor', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob([new Uint8Array(10)], { type: 'image/jpeg' })),
      } as Response);

      const tensor = await ImagePreprocessor.preprocessUrl('https://example.com/photo.jpg', {
        targetWidth: 224,
        targetHeight: 224,
      });

      expect(tensor).toBeInstanceOf(Float32Array);
      expect(tensor.length).toBe(224 * 224 * 3);
    });
  });

  describe('OpenNSFWClassifier', () => {
    it('should throw an explicit error if model loader fails without returning dummy SAFE classification', async () => {
      const failingLoader = new ModelLoader('invalid-path.onnx');
      vi.spyOn(failingLoader, 'loadModel').mockRejectedValue(
        new Error('[ShieldSight AI Error] Failed to load ONNX model')
      );

      const classifier = new OpenNSFWClassifier(failingLoader);
      const testImg = createMockDiscoveredImage('failing-img');

      await expect(classifier.classify(testImg)).rejects.toThrow(
        '[ShieldSight AI Error] Failed to load ONNX model'
      );
    });
  });
});
