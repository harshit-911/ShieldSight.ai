/**
 * ShieldSight AI - Text Discovery Service
 * Scans the DOM for visible text elements (<p>, <span>, <h1>-<h6>, <blockquote>, etc.)
 * Ignores <script>, <style>, <nav>, <header>, <footer>, hidden elements, and HTML attributes.
 * Listens for dynamic text additions via MutationObserver.
 */

import { DiscoveredTextBlock } from '../../types/text';

type TextDiscoveryListener = (discoveredBlock: DiscoveredTextBlock) => void;

export class TextDiscoveryService {
  private discoveredElements: WeakSet<HTMLElement> = new WeakSet();
  private listeners: Set<TextDiscoveryListener> = new Set();
  private observer: MutationObserver | null = null;
  private isRunning: boolean = false;
  private idCounter: number = 0;

  private readonly IGNORED_TAGS = new Set([
    'SCRIPT',
    'STYLE',
    'NOSCRIPT',
    'SVG',
    'CANVAS',
    'IFRAME',
    'NAV',
    'HEADER',
    'FOOTER',
    'BUTTON',
    'INPUT',
    'TEXTAREA',
    'SELECT',
    'OPTION',
  ]);

  /**
   * Starts initial DOM text scan and attaches MutationObserver for dynamic text content.
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[ShieldSight Text Discovery] Service Started');

    this.scanDocument();
    this.setupMutationObserver();
  }

  /**
   * Stops text discovery scanning and disconnects MutationObserver.
   */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    console.log('[ShieldSight Text Discovery] Service Stopped');
  }

  /**
   * Registers a callback listener for newly discovered text blocks.
   */
  onDiscovered(listener: TextDiscoveryListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Performs complete scan of visible text elements on the current page.
   */
  scanDocument(): void {
    if (!this.isRunning) return;

    const candidates = Array.from(
      document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, blockquote, li, td, article, figcaption')
    );

    candidates.forEach((el) => {
      if (el instanceof HTMLElement) {
        this.processElement(el);
      }
    });
  }

  /**
   * Evaluates an individual HTMLElement for text block extraction.
   */
  private processElement(el: HTMLElement): void {
    if (this.discoveredElements.has(el)) return;
    if (this.isIgnoredElement(el)) return;
    if (!this.isElementVisible(el)) return;

    // Extract direct text content (avoid duplicating child text blocks)
    const textContent = this.extractDirectText(el);
    if (!textContent || textContent.length < 5) return;

    this.discoveredElements.add(el);
    this.idCounter += 1;

    const discoveredBlock: DiscoveredTextBlock = {
      id: `shieldsight-text-${this.idCounter}`,
      element: el,
      text: textContent,
      timestamp: Date.now(),
    };

    this.notifyListeners(discoveredBlock);
  }

  /**
   * Extracts direct non-empty text content from element.
   */
  private extractDirectText(el: HTMLElement): string {
    let directText = '';
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.nodeValue || '';
      }
    });

    const trimmed = directText.trim();
    if (trimmed.length >= 5) {
      return trimmed;
    }

    // Fallback to full textContent if element is leaf-like node
    return el.childElementCount === 0 ? (el.textContent || '').trim() : '';
  }

  /**
   * Checks whether element tag is ignored (script, style, nav, inputs, attributes).
   */
  private isIgnoredElement(el: HTMLElement): boolean {
    if (this.IGNORED_TAGS.has(el.tagName.toUpperCase())) return true;
    if (el.closest('nav, header, footer, script, style, svg')) return true;
    return false;
  }

  /**
   * Verifies element is currently visible in DOM.
   */
  private isElementVisible(el: HTMLElement): boolean {
    if (el.hasAttribute('hidden')) return false;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    return true;
  }

  /**
   * Sets up MutationObserver to detect dynamically inserted text blocks.
   */
  private setupMutationObserver(): void {
    if (typeof MutationObserver === 'undefined') return;

    this.observer = new MutationObserver((mutations) => {
      if (!this.isRunning) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (this.isIgnoredElement(el)) return;

            if (el.matches('p, span, h1, h2, h3, h4, h5, h6, blockquote, li, td, article, figcaption')) {
              this.processElement(el);
            }

            const children = Array.from(
              el.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, blockquote, li, td, article, figcaption')
            );
            children.forEach((child) => {
              if (child instanceof HTMLElement) {
                this.processElement(child);
              }
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private notifyListeners(block: DiscoveredTextBlock): void {
    this.listeners.forEach((listener) => {
      try {
        listener(block);
      } catch (err) {
        console.error('[ShieldSight Text Discovery] Listener error:', err);
      }
    });
  }
}

export const textDiscoveryService = new TextDiscoveryService();
