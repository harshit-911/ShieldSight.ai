import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImageDiscoveryService } from '../../src/services/image/ImageDiscoveryService';
import { imageRegistry } from '../../src/services/image/ImageRegistry';

describe('ImageDiscoveryService Unit Tests', () => {
  let discoveryService: ImageDiscoveryService;

  beforeEach(() => {
    document.body.innerHTML = '';
    imageRegistry.clear();
    discoveryService = new ImageDiscoveryService();
  });

  afterEach(() => {
    discoveryService.stop();
  });

  it('should start and stop service cleanly without throwing errors', () => {
    expect(() => discoveryService.start()).not.toThrow();
    expect(() => discoveryService.stop()).not.toThrow();
  });

  it('should collect performance metrics during scan', () => {
    discoveryService.start();
    const metrics = discoveryService.getMetrics();
    expect(metrics).toHaveProperty('initialScanTimeMs');
    expect(metrics).toHaveProperty('discoveredCount');
    expect(metrics).toHaveProperty('processedCount');
  });

  it('should handle broken image load errors gracefully without throwing', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    discoveryService.start();

    const brokenImg = document.createElement('img');
    brokenImg.src = 'https://example.com/non-existent-404.jpg';
    document.body.appendChild(brokenImg);

    // Trigger error event
    const errorEvent = new Event('error');
    brokenImg.dispatchEvent(errorEvent);

    expect(() => brokenImg.dispatchEvent(errorEvent)).not.toThrow();
    consoleWarnSpy.mockRestore();
  });
});
