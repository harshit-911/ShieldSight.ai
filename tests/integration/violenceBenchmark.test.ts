import { describe, it, expect, vi } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';
import { ViolenceClassifier } from '../../src/services/ai/ViolenceClassifier';
import { ModelLoader } from '../../src/services/ai/ModelLoader';
import { AIOrchestrator } from '../../src/services/ai/AIOrchestrator';
import { DecisionEngine } from '../../src/services/ai/DecisionEngine';
import { ProtectionService } from '../../src/services/protection/ProtectionService';
import { DiscoveredImage } from '../../src/types';

describe('Graphic Violence ONNX Classifier & Benchmark Verification', () => {
  it('should initialize violence ONNX model and run parallel multi-classifier inference with benchmarks', async () => {
    const nsfwBuffer = fs.readFileSync(path.resolve('public/models/opennsfw2.onnx'));
    const violenceBuffer = fs.readFileSync(path.resolve('public/models/violence.onnx'));

    const nsfwLoader = new ModelLoader('models/opennsfw2.onnx');
    vi.spyOn(nsfwLoader, 'loadModel').mockResolvedValue(
      await ort.InferenceSession.create(new Uint8Array(nsfwBuffer), { executionProviders: ['wasm'] })
    );

    const violenceLoader = new ModelLoader('models/violence.onnx');
    vi.spyOn(violenceLoader, 'loadModel').mockResolvedValue(
      await ort.InferenceSession.create(new Uint8Array(violenceBuffer), { executionProviders: ['wasm'] })
    );

    const violenceClassifier = new ViolenceClassifier(violenceLoader);

    // Mock fetch for image URL -> returns valid image Blob
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob([new Uint8Array(10)], { type: 'image/jpeg' })),
    } as Response);
    const orchestrator = new AIOrchestrator();

    const loadStart = performance.now();
    await violenceClassifier.initialize();
    const loadTimeMs = Math.round(performance.now() - loadStart);

    const mockImage: DiscoveredImage = {
      id: 'violence-test-img-101',
      element: document.createElement('img'),
      src: 'https://example.com/sample.jpg',
      naturalWidth: 800,
      naturalHeight: 600,
      discoverySource: 'initial_scan',
      timestamp: Date.now(),
    };

    // Run classification
    const result = await violenceClassifier.classify(mockImage);
    const metrics = violenceClassifier.getBenchmarkMetrics();

    console.log('\n=================== GRAPHIC VIOLENCE CLASSIFIER BENCHMARK ===================');
    console.log('Model Load Time      :', `${loadTimeMs}ms`);
    console.log('Average Inference Time:', `${metrics.averageInferenceTimeMs}ms`);
    console.log('Memory Footprint     :', `${metrics.memoryUsageMB} MB`);
    console.log('Raw Result           :', result);
    console.log('=============================================================================\n');

    expect(result.imageId).toBe('violence-test-img-101');
    expect(result.inferenceTimeMs).toBeGreaterThan(0);
    expect(metrics.memoryUsageMB).toBeGreaterThan(0);

    // Test Protection Service reuse for GRAPHIC decision
    const protectionService = new ProtectionService();
    const mockContainer = document.createElement('div');
    mockContainer.appendChild(mockImage.element);
    document.body.appendChild(mockContainer);

    const graphicResult = {
      imageId: 'violence-test-img-101',
      isHarmful: true,
      nsfw: { probability: 0.01, label: 'SAFE' as const },
      violence: { probability: 0.95, label: 'GRAPHIC' as const },
      overallDecision: 'GRAPHIC' as const,
      results: {},
      label: 'GRAPHIC' as const,
      confidence: 0.95,
      timestamp: Date.now(),
    };

    const protectedApplied = protectionService.protect(mockImage, graphicResult);
    expect(protectedApplied).toBe(true);
    expect(mockImage.element.classList.contains('shieldsight-blurred-image')).toBe(true);

    const overlay = document.querySelector('[data-shieldsight-id="violence-test-img-101"]');
    expect(overlay?.textContent).toContain('Reason: Graphic Violence');
  });
});
