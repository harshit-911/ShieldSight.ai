import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PresentationService } from '../../src/services/presentation/PresentationService';
import { DiscoveredImage } from '../../src/types';
import { CombinedClassificationResult } from '../../src/services/ai/ClassificationTypes';

function createMockImage(id: string): DiscoveredImage {
  const container = document.createElement('div');
  const img = document.createElement('img');
  img.src = `https://example.com/${id}.jpg`;
  container.appendChild(img);
  document.body.appendChild(container);

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

describe('PresentationService Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render Presentation HUD pipeline overlay and auto-remove after 3 seconds', () => {
    const service = new PresentationService();
    const image = createMockImage('hud-img-1');
    const result: CombinedClassificationResult = {
      imageId: 'hud-img-1',
      isHarmful: true,
      nsfw: { probability: 0.982, label: 'NSFW' },
      violence: { probability: 0.012, label: 'SAFE' },
      overallDecision: 'NSFW',
      results: {},
      label: 'NSFW',
      confidence: 0.982,
      timestamp: Date.now(),
    };

    service.renderPipelineHUD(image, result, 24, 'SAFE');

    const hudOverlay = document.querySelector('[data-shieldsight-hud-id="hud-img-1"]');
    expect(hudOverlay).not.toBeNull();
    expect(hudOverlay?.textContent).toContain('ShieldSight AI Pipeline');
    expect(hudOverlay?.textContent).toContain('Image Detected');
    expect(hudOverlay?.textContent).toContain('NSFW Model');
    expect(hudOverlay?.textContent).toContain('0.982');
    expect(hudOverlay?.textContent).toContain('Detected 24 chars');
    expect(hudOverlay?.textContent).toContain('Decision: BLOCKED');

    // Fast-forward timer by 3.1 seconds
    vi.advanceTimersByTime(3100);

    expect(document.querySelector('[data-shieldsight-hud-id="hud-img-1"]')).toBeNull();
  });
});
