/**
 * ShieldSight AI - Image Discovery Service
 * Core service for discovering, validating, and registering webpage images.
 */

import { DiscoverySource, DiscoveredImage } from '../../types';
import { imageRegistry } from './ImageRegistry';
import {
  isMeaningfulImageSize,
  isSvgOrIconUrl,
  isNearViewport,
  extractImagesFromNode,
  findShadowRoots,
  extractImagesFromIframes,
} from '../../utils/domUtils';

import { pipelineAuditTracker } from '../audit/PipelineAuditTracker';

type DiscoveredImageListener = (image: DiscoveredImage) => void;

export class ImageDiscoveryService {
  private observer: MutationObserver | null = null;
  private isActive: boolean = false;
  private listeners: Set<DiscoveredImageListener> = new Set();
  private metrics = {
    initialScanTimeMs: 0,
    discoveredCount: 0,
    processedCount: 0,
  };

  /**
   * Registers a listener to be notified when a new image is discovered and validated.
   */
  onDiscovered(listener: DiscoveredImageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Starts the image discovery engine (initial scan + mutation observer).
   */
  start(): void {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    console.log('[ShieldSight Discovery Engine] Starting image discovery system');

    const startTime = performance.now();
    this.scanInitialDOM();
    this.metrics.initialScanTimeMs = performance.now() - startTime;

    this.setupMutationObserver();
  }

  /**
   * Pauses image discovery and disconnects observers.
   */
  stop(): void {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.disconnectObserver();
    console.log('[ShieldSight Discovery Engine] Image discovery system paused');
  }

  /**
   * Returns current discovery engine performance metrics.
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Scans existing DOM images, accessible Shadow DOMs, and same-origin iframes.
   */
  private scanInitialDOM(): void {
    try {
      // 1. Scan standard document images
      if (typeof document !== 'undefined' && document.images) {
        const documentImages = Array.from(document.images);
        documentImages.forEach((img) => this.processImageElement(img, 'initial_scan'));
      }

      // 2. Scan accessible Shadow DOMs
      const rootNode = document.body || document.documentElement;
      if (rootNode) {
        const shadowRoots = findShadowRoots(rootNode);
        shadowRoots.forEach((shadowRoot) => {
          const shadowImages = Array.from(shadowRoot.querySelectorAll('img'));
          shadowImages.forEach((img) => this.processImageElement(img, 'shadow_dom'));
        });

        // 3. Scan same-origin iframes
        const iframeImages = extractImagesFromIframes(rootNode);
        iframeImages.forEach((img) => this.processImageElement(img, 'initial_scan'));
      }
    } catch (error) {
      console.warn('[ShieldSight Discovery Engine] Error during initial DOM scan:', error);
    }
  }

  /**
   * Sets up MutationObserver to inspect newly added nodes and src attribute mutations.
   */
  private setupMutationObserver(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      if (!this.isActive) {
        return;
      }

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            this.handleAddedNode(node);
          });
        } else if (mutation.type === 'attributes' && mutation.target.nodeName === 'IMG') {
          this.processImageElement(mutation.target as HTMLImageElement, 'mutation');
        }
      });
    });

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      this.observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'data-src'],
      });
    }
  }

  /**
   * Disconnects the MutationObserver.
   */
  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Processes a newly added DOM node and inspects contained images.
   */
  private handleAddedNode(node: Node): void {
    const images = extractImagesFromNode(node);
    images.forEach((img) => this.processImageElement(img, 'mutation'));

    // Check for Shadow DOM inside added node
    const shadowRoots = findShadowRoots(node);
    shadowRoots.forEach((shadowRoot) => {
      const shadowImages = Array.from(shadowRoot.querySelectorAll('img'));
      shadowImages.forEach((img) => this.processImageElement(img, 'shadow_dom'));
    });

    // Check for same-origin iframes inside added node
    const iframeImages = extractImagesFromIframes(node);
    iframeImages.forEach((img) => this.processImageElement(img, 'mutation'));
  }

  /**
   * Validates and registers an image element once loaded.
   */
  private processImageElement(
    img: HTMLImageElement,
    source: DiscoverySource
  ): void {
    if (!this.isActive || !img) {
      return;
    }

    const currentSrc = img.currentSrc || img.src;
    if (imageRegistry.has(img, currentSrc)) {
      return;
    }

    this.metrics.processedCount += 1;

    if (img.complete) {
      this.validateAndRegister(img, source);
    } else {
      // Attach one-time load listeners if image is still loading
      const onLoad = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        if (this.isActive) {
          this.validateAndRegister(img, source);
        }
      };

      const onError = (event: Event) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        console.warn(`[ShieldSight Discovery Engine] Image load error for URL: ${currentSrc}`, event);
      };

      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
    }
  }

  /**
   * Performs dimension, visibility, SVG filtering, and duplicate checks before registering.
   */
  private validateAndRegister(
    img: HTMLImageElement,
    source: DiscoverySource
  ): void {
    const currentSrc = img.currentSrc || img.src;

    if (imageRegistry.has(img, currentSrc)) {
      return;
    }

    // 1. Filter out SVG icons and favicon strings
    if (isSvgOrIconUrl(currentSrc)) {
      return;
    }

    // 2. Check natural dimensions (>64x64)
    if (!isMeaningfulImageSize(img.naturalWidth, img.naturalHeight)) {
      return;
    }

    // 4. Check proximity to viewport
    isNearViewport(img);

    // Register in registry and retrieve assigned unique ID
    const id = imageRegistry.register(img, currentSrc);
    this.metrics.discoveredCount += 1;

    const record: DiscoveredImage = {
      id,
      element: img,
      src: currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      discoverySource: source,
      timestamp: Date.now(),
    };

    // Stage 1 Audit Logging
    pipelineAuditTracker.recordStage(record.id, record.src, 1);

    this.logDiscoveredImage(record);
    this.notifyListeners(record);
  }

  /**
   * Notifies subscribed listeners of newly discovered image.
   */
  private notifyListeners(record: DiscoveredImage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(record);
      } catch (err) {
        console.error('[ShieldSight Discovery Engine] Listener error:', err);
      }
    });
  }

  /**
   * Structured console logging for newly discovered image records.
   */
  private logDiscoveredImage(record: DiscoveredImage): void {
    console.log(
      `%c[ShieldSight Image Discovered]%c ${record.id}`,
      'color: #10b981; font-weight: bold;',
      'color: #f8fafc; font-weight: bold;',
      {
        id: record.id,
        url: record.src,
        dimensions: `${record.naturalWidth}x${record.naturalHeight}`,
        source: record.discoverySource,
        timestamp: new Date(record.timestamp).toISOString(),
      }
    );
  }
}

export const imageDiscoveryService = new ImageDiscoveryService();
