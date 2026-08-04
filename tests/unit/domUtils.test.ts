import { describe, it, expect, beforeEach } from 'vitest';
import {
  isElementVisible,
  isMeaningfulImageSize,
  isSvgOrIconUrl,
  isNearViewport,
  extractImagesFromNode,
  findShadowRoots,
} from '../../src/utils/domUtils';

describe('DOM Utilities Unit Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('isElementVisible', () => {
    it('should return false if element is not connected to DOM', () => {
      const img = document.createElement('img');
      expect(isElementVisible(img)).toBe(false);
    });

    it('should return false if display is none', () => {
      const img = document.createElement('img');
      img.style.display = 'none';
      document.body.appendChild(img);
      expect(isElementVisible(img)).toBe(false);
    });

    it('should return false if visibility is hidden', () => {
      const img = document.createElement('img');
      img.style.visibility = 'hidden';
      document.body.appendChild(img);
      expect(isElementVisible(img)).toBe(false);
    });

    it('should return false if opacity is 0', () => {
      const img = document.createElement('img');
      img.style.opacity = '0';
      document.body.appendChild(img);
      expect(isElementVisible(img)).toBe(false);
    });
  });

  describe('isMeaningfulImageSize', () => {
    it('should return true if dimensions are greater than 64x64', () => {
      expect(isMeaningfulImageSize(65, 65)).toBe(true);
      expect(isMeaningfulImageSize(800, 600)).toBe(true);
    });

    it('should return false if width or height is <= 64', () => {
      expect(isMeaningfulImageSize(64, 64)).toBe(false);
      expect(isMeaningfulImageSize(16, 16)).toBe(false);
      expect(isMeaningfulImageSize(100, 32)).toBe(false);
    });
  });

  describe('isSvgOrIconUrl', () => {
    it('should identify SVG data URIs', () => {
      expect(isSvgOrIconUrl('data:image/svg+xml;base64,PHN2Zy...')).toBe(true);
    });

    it('should identify .svg file extensions', () => {
      expect(isSvgOrIconUrl('https://example.com/logo.svg')).toBe(true);
    });

    it('should identify favicon URLs', () => {
      expect(isSvgOrIconUrl('https://example.com/favicon.ico')).toBe(true);
    });

    it('should return false for standard bitmap image URLs', () => {
      expect(isSvgOrIconUrl('https://example.com/photo.jpg')).toBe(false);
      expect(isSvgOrIconUrl('https://example.com/banner.png')).toBe(false);
    });
  });

  describe('extractImagesFromNode', () => {
    it('should extract single img element', () => {
      const img = document.createElement('img');
      expect(extractImagesFromNode(img)).toHaveLength(1);
    });

    it('should extract nested img elements inside container', () => {
      const container = document.createElement('div');
      container.innerHTML = '<img src="a.png" /><img src="b.png" />';
      expect(extractImagesFromNode(container)).toHaveLength(2);
    });
  });

  describe('findShadowRoots', () => {
    it('should locate open shadow roots', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = '<img src="shadow.png" />';

      const roots = findShadowRoots(document.body);
      expect(roots).toHaveLength(1);
      expect(roots[0]).toBe(shadow);
    });
  });
});
