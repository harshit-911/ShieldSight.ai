import { describe, it, expect, vi } from 'vitest';
import { ProtectionService } from '../../src/services/protection/ProtectionService';
import { DiscoveredImage } from '../../src/types';
import { CombinedClassificationResult } from '../../src/services/ai/ClassificationTypes';

function createMockDiscoveredImage(id: string): DiscoveredImage {
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

describe('ProtectionService Unit Tests', () => {
  it('should skip protection if decision is SAFE', () => {
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('safe-img-1');
    const safeResult: CombinedClassificationResult = {
      imageId: 'safe-img-1',
      isHarmful: false,
      nsfw: { probability: 0.05, label: 'SAFE' },
      violence: { probability: 0.01, label: 'SAFE' },
      overallDecision: 'SAFE',
      results: {},
      label: 'SAFE',
      confidence: 0.95,
      timestamp: Date.now(),
    };

    const protectedApplied = service.protect(image, safeResult);
    expect(protectedApplied).toBe(false);
    expect(image.element.classList.contains('shieldsight-blurred-image')).toBe(false);
  });

  it('should apply immediate pre-blur and scanning overlay on applyPreBlur', () => {
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('preblur-img-0');

    service.applyPreBlur(image);
    expect(image.element.classList.contains('shieldsight-pre-blur')).toBe(true);

    const scanningOverlay = document.querySelector('[data-shieldsight-scanning-id="preblur-img-0"]');
    expect(scanningOverlay).not.toBeNull();
    expect(scanningOverlay?.textContent).toContain('Scanning...');

    // When protect is called with SAFE decision
    const safeResult: CombinedClassificationResult = {
      imageId: 'preblur-img-0',
      isHarmful: false,
      nsfw: { probability: 0.05, label: 'SAFE' },
      violence: { probability: 0.01, label: 'SAFE' },
      overallDecision: 'SAFE',
      results: {},
      label: 'SAFE',
      confidence: 0.95,
      timestamp: Date.now(),
    };

    service.protect(image, safeResult);
    expect(image.element.classList.contains('shieldsight-pre-blur')).toBe(false);
    expect(document.querySelector('[data-shieldsight-scanning-id="preblur-img-0"]')).toBeNull();
  });

  it('should apply blur and render safety overlay for NSFW decision', () => {
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('nsfw-img-2');
    const nsfwResult: CombinedClassificationResult = {
      imageId: 'nsfw-img-2',
      isHarmful: true,
      nsfw: { probability: 0.98, label: 'NSFW' },
      violence: { probability: 0.01, label: 'SAFE' },
      overallDecision: 'NSFW',
      results: {},
      label: 'NSFW',
      confidence: 0.98,
      timestamp: Date.now(),
    };

    const protectedApplied = service.protect(image, nsfwResult);
    expect(protectedApplied).toBe(true);
    expect(image.element.classList.contains('shieldsight-blurred-image')).toBe(true);

    const overlay = document.querySelector('[data-shieldsight-id="nsfw-img-2"]');
    expect(overlay).not.toBeNull();
    expect(overlay?.textContent).toContain('ShieldSight AI');
    expect(overlay?.textContent).toContain('Sensitive Content Hidden');
    expect(overlay?.textContent).toContain('Reason: Adult Content');
    expect(overlay?.textContent).toContain('Confidence: 98%');
  });

  it('should prevent duplicate protection on already protected elements', () => {
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('duplicate-img-3');
    const nsfwResult: CombinedClassificationResult = {
      imageId: 'duplicate-img-3',
      isHarmful: true,
      nsfw: { probability: 0.95, label: 'NSFW' },
      violence: { probability: 0.01, label: 'SAFE' },
      overallDecision: 'NSFW',
      results: {},
      label: 'NSFW',
      confidence: 0.95,
      timestamp: Date.now(),
    };

    const firstApplied = service.protect(image, nsfwResult);
    const secondApplied = service.protect(image, nsfwResult);

    expect(firstApplied).toBe(true);
    expect(secondApplied).toBe(false); // Duplicate guard prevented re-protection
  });

  it('should unblur image and hide overlay when Reveal Once button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('reveal-img-4');
    const graphicResult: CombinedClassificationResult = {
      imageId: 'reveal-img-4',
      isHarmful: true,
      nsfw: { probability: 0.01, label: 'SAFE' },
      violence: { probability: 0.92, label: 'GRAPHIC' },
      overallDecision: 'GRAPHIC',
      results: {},
      label: 'GRAPHIC',
      confidence: 0.92,
      timestamp: Date.now(),
    };

    service.protect(image, graphicResult);
    const overlay = document.querySelector('[data-shieldsight-id="reveal-img-4"]');
    const revealBtn = overlay?.querySelector('.shieldsight-btn-reveal') as HTMLButtonElement;

    expect(revealBtn).not.toBeNull();
    revealBtn.click();

    expect(image.element.classList.contains('shieldsight-blurred-image')).toBe(false);
    expect((overlay as HTMLElement).style.display).toBe('none');

    expect(consoleSpy).toHaveBeenCalledWith(
      '[ShieldSight AI]',
      expect.stringContaining('[ShieldSight Protection] Reveal Clicked for reveal-img-4')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[ShieldSight AI]',
      expect.stringContaining('[ShieldSight Protection] Protection Removed for reveal-img-4')
    );
  });

  it('should log Version 2 whitelist message when Always Allow button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const service = new ProtectionService();
    const image = createMockDiscoveredImage('allow-img-5');
    const bothResult: CombinedClassificationResult = {
      imageId: 'allow-img-5',
      isHarmful: true,
      nsfw: { probability: 0.91, label: 'NSFW' },
      violence: { probability: 0.95, label: 'GRAPHIC' },
      overallDecision: 'BOTH',
      results: {},
      label: 'BOTH',
      confidence: 0.95,
      timestamp: Date.now(),
    };

    service.protect(image, bothResult);
    const overlay = document.querySelector('[data-shieldsight-id="allow-img-5"]');
    const allowBtn = overlay?.querySelector('.shieldsight-btn-allow') as HTMLButtonElement;

    expect(allowBtn).not.toBeNull();
    allowBtn.click();

    expect(consoleSpy).toHaveBeenCalledWith(
      '[ShieldSight AI]',
      expect.stringContaining('[ShieldSight AI] Whitelist feature coming in Version 2.')
    );
  });
});
