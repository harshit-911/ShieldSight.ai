import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImageDiscoveryService } from '../../src/services/image/ImageDiscoveryService';
import { imageRegistry } from '../../src/services/image/ImageRegistry';

describe('Integration Test: MutationObserver & Dynamic Content', () => {
  let service: ImageDiscoveryService;

  beforeEach(() => {
    document.body.innerHTML = '';
    imageRegistry.clear();
    service = new ImageDiscoveryService();
  });

  afterEach(() => {
    service.stop();
  });

  it('should detect images dynamically inserted into DOM via MutationObserver', async () => {
    service.start();

    const dynamicImg = document.createElement('img');
    dynamicImg.src = 'https://example.com/dynamic-photo.jpg';
    Object.defineProperty(dynamicImg, 'naturalWidth', { value: 1024, writable: true });
    Object.defineProperty(dynamicImg, 'naturalHeight', { value: 768, writable: true });
    Object.defineProperty(dynamicImg, 'complete', { value: true, writable: true });
    Object.defineProperty(dynamicImg, 'isConnected', { value: true, writable: true });
    dynamicImg.getBoundingClientRect = () => ({
      width: 1024,
      height: 768,
      top: 50,
      bottom: 818,
      left: 50,
      right: 1074,
      x: 50,
      y: 50,
      toJSON: () => {},
    });

    document.body.appendChild(dynamicImg);

    // Wait for microtask queue to flush MutationObserver callback
    await new Promise((r) => setTimeout(r, 50));

    expect(imageRegistry.has(dynamicImg)).toBe(true);
  });

  it('should detect lazy-loaded src attribute mutations', async () => {
    const lazyImg = document.createElement('img');
    lazyImg.src = 'data:image/svg+xml;base64,placeholder';
    Object.defineProperty(lazyImg, 'naturalWidth', { value: 800, writable: true });
    Object.defineProperty(lazyImg, 'naturalHeight', { value: 600, writable: true });
    Object.defineProperty(lazyImg, 'complete', { value: true, writable: true });
    Object.defineProperty(lazyImg, 'isConnected', { value: true, writable: true });
    lazyImg.getBoundingClientRect = () => ({
      width: 800,
      height: 600,
      top: 10,
      bottom: 610,
      left: 10,
      right: 810,
      x: 10,
      y: 10,
      toJSON: () => {},
    });

    document.body.appendChild(lazyImg);
    service.start();

    // Placeholder SVG should be ignored
    expect(imageRegistry.has(lazyImg)).toBe(false);

    // Simulate lazy loading src swap
    lazyImg.src = 'https://example.com/real-photo.jpg';
    lazyImg.setAttribute('src', 'https://example.com/real-photo.jpg');

    await new Promise((r) => setTimeout(r, 50));

    expect(imageRegistry.has(lazyImg, 'https://example.com/real-photo.jpg')).toBe(true);
  });
});
