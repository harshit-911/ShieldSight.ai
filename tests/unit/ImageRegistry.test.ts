import { describe, it, expect, beforeEach } from 'vitest';
import { imageRegistry } from '../../src/services/image/ImageRegistry';

describe('ImageRegistry Unit Tests', () => {
  beforeEach(() => {
    imageRegistry.clear();
  });

  it('should register a new image element and assign a unique data ID', () => {
    const img = document.createElement('img');
    img.src = 'https://example.com/photo.jpg';

    expect(imageRegistry.has(img)).toBe(false);

    const id = imageRegistry.register(img);
    expect(id).toBe('shieldsight-img-1');
    expect(img.dataset.shieldsightId).toBe('shieldsight-img-1');
    expect(imageRegistry.has(img)).toBe(true);
  });

  it('should increment IDs sequentially for separate image elements', () => {
    const img1 = document.createElement('img');
    img1.src = 'https://example.com/1.jpg';
    const img2 = document.createElement('img');
    img2.src = 'https://example.com/2.jpg';

    const id1 = imageRegistry.register(img1);
    const id2 = imageRegistry.register(img2);

    expect(id1).toBe('shieldsight-img-1');
    expect(id2).toBe('shieldsight-img-2');
  });

  it('should prevent duplicate registration for identical image element and URL', () => {
    const img = document.createElement('img');
    img.src = 'https://example.com/photo.jpg';

    imageRegistry.register(img);
    expect(imageRegistry.has(img, 'https://example.com/photo.jpg')).toBe(true);
  });

  it('should allow registering a new URL if an image element changes src attribute', () => {
    const img = document.createElement('img');
    img.src = 'https://example.com/initial.jpg';

    imageRegistry.register(img, 'https://example.com/initial.jpg');
    expect(imageRegistry.has(img, 'https://example.com/initial.jpg')).toBe(true);
    expect(imageRegistry.has(img, 'https://example.com/new.jpg')).toBe(false);

    imageRegistry.register(img, 'https://example.com/new.jpg');
    expect(imageRegistry.has(img, 'https://example.com/new.jpg')).toBe(true);
  });
});
