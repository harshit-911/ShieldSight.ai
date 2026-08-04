import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ImageDiscoveryService } from '../../src/services/image/ImageDiscoveryService';
import { imageRegistry } from '../../src/services/image/ImageRegistry';

describe('Integration Test: Initial Page Scan', () => {
  let service: ImageDiscoveryService;

  beforeEach(() => {
    document.body.innerHTML = '';
    imageRegistry.clear();
    service = new ImageDiscoveryService();
  });

  afterEach(() => {
    service.stop();
  });

  it('should discover valid large images on initial scan', () => {
    const validImg = document.createElement('img');
    validImg.src = 'https://example.com/large-photo.jpg';
    Object.defineProperty(validImg, 'naturalWidth', { value: 800, writable: true });
    Object.defineProperty(validImg, 'naturalHeight', { value: 600, writable: true });
    Object.defineProperty(validImg, 'complete', { value: true, writable: true });
    Object.defineProperty(validImg, 'isConnected', { value: true, writable: true });
    validImg.getBoundingClientRect = () => ({
      width: 800,
      height: 600,
      top: 100,
      bottom: 700,
      left: 100,
      right: 900,
      x: 100,
      y: 100,
      toJSON: () => {},
    });

    document.body.appendChild(validImg);

    service.start();

    expect(imageRegistry.has(validImg)).toBe(true);
    expect(validImg.dataset.shieldsightId).toBe('shieldsight-img-1');
  });

  it('should ignore tiny images (<= 64x64) on initial scan', () => {
    const tinyImg = document.createElement('img');
    tinyImg.src = 'https://example.com/icon.png';
    Object.defineProperty(tinyImg, 'naturalWidth', { value: 16, writable: true });
    Object.defineProperty(tinyImg, 'naturalHeight', { value: 16, writable: true });
    Object.defineProperty(tinyImg, 'complete', { value: true, writable: true });
    Object.defineProperty(tinyImg, 'isConnected', { value: true, writable: true });

    document.body.appendChild(tinyImg);

    service.start();

    expect(imageRegistry.has(tinyImg)).toBe(false);
  });

  it('should ignore SVG icons on initial scan', () => {
    const svgImg = document.createElement('img');
    svgImg.src = 'https://example.com/vector-icon.svg';
    Object.defineProperty(svgImg, 'naturalWidth', { value: 200, writable: true });
    Object.defineProperty(svgImg, 'naturalHeight', { value: 200, writable: true });
    Object.defineProperty(svgImg, 'complete', { value: true, writable: true });

    document.body.appendChild(svgImg);

    service.start();

    expect(imageRegistry.has(svgImg)).toBe(false);
  });
});
