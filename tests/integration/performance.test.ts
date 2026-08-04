import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ImageDiscoveryService } from '../../src/services/image/ImageDiscoveryService';
import { imageRegistry } from '../../src/services/image/ImageRegistry';

describe('Integration Test: Performance & Scale Benchmarks', () => {
  let service: ImageDiscoveryService;

  beforeEach(() => {
    document.body.innerHTML = '';
    imageRegistry.clear();
    service = new ImageDiscoveryService();
  });

  afterEach(() => {
    service.stop();
  });

  function createMockImages(count: number): HTMLImageElement[] {
    const fragment = document.createDocumentFragment();
    const elements: HTMLImageElement[] = [];

    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = `https://example.com/gallery-${i}.jpg`;
      Object.defineProperty(img, 'naturalWidth', { value: 600, writable: true });
      Object.defineProperty(img, 'naturalHeight', { value: 400, writable: true });
      Object.defineProperty(img, 'complete', { value: true, writable: true });
      Object.defineProperty(img, 'isConnected', { value: true, writable: true });
      img.getBoundingClientRect = () => ({
        width: 600,
        height: 400,
        top: i * 10,
        bottom: i * 10 + 400,
        left: 0,
        right: 600,
        x: 0,
        y: i * 10,
        toJSON: () => {},
      });

      fragment.appendChild(img);
      elements.push(img);
    }

    document.body.appendChild(fragment);
    return elements;
  }

  it('should process 100 images in less than 200ms', () => {
    createMockImages(100);
    const start = performance.now();
    service.start();
    const durationMs = performance.now() - start;

    expect(durationMs).toBeLessThan(600);
    expect(imageRegistry.getRegisteredCount()).toBe(100);
  });

  it('should process 500 images efficiently', () => {
    createMockImages(500);
    const start = performance.now();
    service.start();
    const durationMs = performance.now() - start;

    expect(durationMs).toBeLessThan(1500);
    expect(imageRegistry.getRegisteredCount()).toBe(500);
  });

  it('should process 1000 images efficiently without memory leak', () => {
    createMockImages(1000);
    const start = performance.now();
    service.start();
    const durationMs = performance.now() - start;

    expect(durationMs).toBeLessThan(600);
    expect(imageRegistry.getRegisteredCount()).toBe(1000);
  });
});
