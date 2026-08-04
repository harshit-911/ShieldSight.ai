import { describe, it, expect, vi } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';
import { OpenNSFWClassifier } from '../../src/services/ai/OpenNSFWClassifier';
import { ModelLoader } from '../../src/services/ai/ModelLoader';
import { ImagePreprocessor } from '../../src/services/ai/ImagePreprocessor';
import { DiscoveredImage } from '../../src/types';

describe('ShieldSight AI - Untainted Cross-Origin Preprocessing Pipeline Verification', () => {
  it('should process images via Blob & ImageBitmap without SecurityError or canvas tainting', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const loader = new ModelLoader('models/opennsfw2.onnx');
    vi.spyOn(loader, 'loadModel').mockResolvedValue(
      await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
        executionProviders: ['wasm'],
      })
    );

    const classifier = new OpenNSFWClassifier(loader);

    // Mock fetch for image URL -> returns valid image Blob
    const mockImageBlob = new Blob([new Uint8Array(100)], { type: 'image/jpeg' });
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('cors-blocked')) {
        return Promise.resolve({
          ok: false,
          status: 403,
          statusText: 'Forbidden by CORS policy',
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockImageBlob),
      } as Response);
    });

    const validImg: DiscoveredImage = {
      id: 'untainted-img-1',
      element: document.createElement('img'),
      src: 'https://example.com/photo.jpg',
      naturalWidth: 800,
      naturalHeight: 600,
      discoverySource: 'initial_scan',
      timestamp: Date.now(),
    };

    const corsBlockedImg: DiscoveredImage = {
      id: 'cors-blocked-img-2',
      element: document.createElement('img'),
      src: 'https://restricted-domain.com/cors-blocked.jpg',
      naturalWidth: 800,
      naturalHeight: 600,
      discoverySource: 'initial_scan',
      timestamp: Date.now(),
    };

    // 1. Process valid image via Blob/ImageBitmap
    const result1 = await classifier.classify(validImg);
    expect(result1).toBeDefined();
    expect(result1.imageId).toBe('untainted-img-1');
    expect(['SAFE', 'NSFW']).toContain(result1.label);

    // 2. Process CORS restricted image -> should throw security error cleanly without crashing system
    await expect(classifier.classify(corsBlockedImg)).rejects.toThrow('CORS restriction');

    // 3. Verify Pipeline Metrics
    const metrics = classifier.getPipelineMetrics();
    console.log('\n=================== UNTAINTED PIPELINE METRICS ===================');
    console.log('Images Successfully Classified:', metrics.successfullyClassifiedCount);
    console.log('Images Skipped Due to Security :', metrics.skippedSecurityCount);
    console.log('Average Preprocessing Time    :', `${metrics.averagePreprocessingTimeMs}ms`);
    console.log('Average Inference Time        :', `${metrics.averageInferenceTimeMs}ms`);
    console.log('==================================================================\n');

    expect(metrics.successfullyClassifiedCount).toBe(1);
    expect(metrics.skippedSecurityCount).toBe(1);
  });
});
