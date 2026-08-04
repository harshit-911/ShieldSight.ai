/**
 * ShieldSight AI - DOM Utilities
 * Helper functions for DOM inspection, visibility checks, image extraction, and Shadow DOM / Iframe traversal.
 */

export const MIN_IMAGE_DIMENSION_PX = 64;
export const DEFAULT_VIEWPORT_MARGIN_PX = 500;

/**
 * Checks whether an element is visible in the computed layout.
 * Filters out display:none, visibility:hidden, opacity:0, and zero-dimension elements.
 */
export function isElementVisible(element: Element): boolean {
  if (!element.isConnected) {
    return false;
  }

  // Handle environments where getComputedStyle might be unavailable or mocked
  if (typeof window !== 'undefined' && window.getComputedStyle) {
    try {
      const style = window.getComputedStyle(element);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      ) {
        return false;
      }
    } catch {
      // Fallback if computed style fails
    }
  }

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    return false;
  }

  return true;
}

/**
 * Verifies if an image meets the minimum dimension threshold (>64x64).
 * Filters out icons, tracking pixels, emojis, and micro-thumbnails.
 */
export function isMeaningfulImageSize(
  naturalWidth: number,
  naturalHeight: number
): boolean {
  return (
    naturalWidth > MIN_IMAGE_DIMENSION_PX &&
    naturalHeight > MIN_IMAGE_DIMENSION_PX
  );
}

/**
 * Checks whether an image source URL represents an SVG data URI or icon string.
 */
export function isSvgOrIconUrl(src: string): boolean {
  if (!src) return false;
  const lower = src.toLowerCase();
  return (
    lower.startsWith('data:image/svg+xml') ||
    lower.endsWith('.svg') ||
    lower.includes('favicon')
  );
}

/**
 * Checks if an element is currently within the viewport or reasonably close to it.
 * @param marginPx Safety margin in pixels beyond the visible viewport bounds
 */
export function isNearViewport(
  element: Element,
  marginPx: number = DEFAULT_VIEWPORT_MARGIN_PX
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    (typeof window !== 'undefined' && window.innerHeight) ||
    (typeof document !== 'undefined' && document.documentElement.clientHeight) ||
    800;
  const windowWidth =
    (typeof window !== 'undefined' && window.innerWidth) ||
    (typeof document !== 'undefined' && document.documentElement.clientWidth) ||
    1280;

  return (
    rect.bottom >= -marginPx &&
    rect.top <= windowHeight + marginPx &&
    rect.right >= -marginPx &&
    rect.left <= windowWidth + marginPx
  );
}

/**
 * Extracts HTMLImageElement instances from a DOM node or subtree.
 */
export function extractImagesFromNode(node: Node): HTMLImageElement[] {
  const images: HTMLImageElement[] = [];

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.tagName === 'IMG') {
      images.push(element as HTMLImageElement);
    }
    if (element.querySelectorAll) {
      const nestedImgs = element.querySelectorAll('img');
      nestedImgs.forEach((img) => images.push(img));
    }
  }

  return images;
}

/**
 * Traverses accessible Shadow DOM roots under a given parent node.
 */
export function findShadowRoots(root: Node): ShadowRoot[] {
  const shadowRoots: ShadowRoot[] = [];

  const traverse = (currentNode: Node) => {
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const element = currentNode as Element;
      if (element.shadowRoot) {
        shadowRoots.push(element.shadowRoot);
        traverse(element.shadowRoot);
      }
      element.childNodes.forEach((child) => traverse(child));
    } else if (currentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      currentNode.childNodes.forEach((child) => traverse(child));
    }
  };

  traverse(root);
  return shadowRoots;
}

/**
 * Safely extracts images from same-origin iframe elements.
 */
export function extractImagesFromIframes(root: Node): HTMLImageElement[] {
  const images: HTMLImageElement[] = [];
  if (nodeTypeIsElement(root)) {
    const element = root as Element;
    const iframes = element.tagName === 'IFRAME' ? [element] : Array.from(element.querySelectorAll('iframe'));
    
    iframes.forEach((iframe) => {
      try {
        const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
        if (iframeDoc && iframeDoc.images) {
          Array.from(iframeDoc.images).forEach((img) => images.push(img));
        }
      } catch {
        // Cross-origin iframe security exception ignored safely
      }
    });
  }
  return images;
}

function nodeTypeIsElement(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE;
}
