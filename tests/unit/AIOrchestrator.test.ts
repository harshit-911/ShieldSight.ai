import { describe, it, expect, vi } from 'vitest';
import { DecisionEngine } from '../../src/services/ai/DecisionEngine';
import { AIOrchestrator } from '../../src/services/ai/AIOrchestrator';
import { ImageClassifier } from '../../src/services/ai/ImageClassifier';
import { DiscoveredImage } from '../../src/types';

describe('DecisionEngine Unit Tests', () => {
  it('should evaluate SAFE when both classifiers return SAFE', () => {
    const decision = DecisionEngine.evaluateDecision('SAFE', 'SAFE');
    expect(decision).toBe('SAFE');
  });

  it('should evaluate NSFW when only NSFW is triggered', () => {
    const decision = DecisionEngine.evaluateDecision('NSFW', 'SAFE');
    expect(decision).toBe('NSFW');
  });

  it('should evaluate GRAPHIC when only Violence classifier is triggered', () => {
    const decision = DecisionEngine.evaluateDecision('SAFE', 'GRAPHIC');
    expect(decision).toBe('GRAPHIC');
  });

  it('should evaluate BOTH when both NSFW and Violence classifiers are triggered', () => {
    const decision = DecisionEngine.evaluateDecision('NSFW', 'GRAPHIC');
    expect(decision).toBe('BOTH');
  });
});

describe('AIOrchestrator Unit Tests', () => {
  function createMockImage(id: string): DiscoveredImage {
    return {
      id,
      element: document.createElement('img'),
      src: `https://example.com/${id}.jpg`,
      naturalWidth: 800,
      naturalHeight: 600,
      discoverySource: 'initial_scan',
      timestamp: Date.now(),
    };
  }

  it('should execute classifiers in parallel and combine results correctly', async () => {
    const mockNSFWClassifier: ImageClassifier = {
      id: 'opennsfw2-onnx',
      name: 'OpenNSFW2 Classifier',
      initialize: vi.fn().mockResolvedValue(undefined),
      classify: vi.fn().mockResolvedValue({
        imageId: 'img-1',
        isHarmful: true,
        probability: 0.98,
        nsfwLabel: 'NSFW',
        label: 'NSFW',
        confidence: 0.98,
        inferenceTimeMs: 40,
        timestamp: Date.now(),
      }),
    };

    const mockViolenceClassifier: ImageClassifier = {
      id: 'violence-classifier',
      name: 'Graphic Violence Classifier',
      initialize: vi.fn().mockResolvedValue(undefined),
      classify: vi.fn().mockResolvedValue({
        imageId: 'img-1',
        isHarmful: true,
        probability: 0.91,
        violenceLabel: 'GRAPHIC',
        label: 'GRAPHIC',
        confidence: 0.91,
        inferenceTimeMs: 15,
        timestamp: Date.now(),
      }),
    };

    const orchestrator = new AIOrchestrator([mockNSFWClassifier, mockViolenceClassifier]);
    await orchestrator.initializeAll();

    expect(mockNSFWClassifier.initialize).toHaveBeenCalledTimes(1);
    expect(mockViolenceClassifier.initialize).toHaveBeenCalledTimes(1);

    const testImg = createMockImage('img-1');
    const combined = await orchestrator.classify(testImg);

    expect(combined.imageId).toBe('img-1');
    expect(combined.nsfw.probability).toBe(0.98);
    expect(combined.nsfw.label).toBe('NSFW');
    expect(combined.violence.probability).toBe(0.91);
    expect(combined.violence.label).toBe('GRAPHIC');
    expect(combined.overallDecision).toBe('BOTH');
    expect(combined.isHarmful).toBe(true);
  });
});
