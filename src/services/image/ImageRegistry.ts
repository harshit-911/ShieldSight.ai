/**
 * ShieldSight AI - Image Registry
 * Manages tracking of discovered images using WeakMap for zero memory leak overhead
 * and support for URL mutation tracking.
 */

class ImageRegistry {
  private registeredElements: WeakMap<HTMLImageElement, Set<string>> = new WeakMap();
  private imageCounter: number = 0;

  /**
   * Checks if an element and its specific source URL have already been registered.
   */
  has(element: HTMLImageElement, src?: string): boolean {
    const registeredUrls = this.registeredElements.get(element);
    if (!registeredUrls) {
      return false;
    }
    const currentSrc = src || element.currentSrc || element.src;
    return registeredUrls.has(currentSrc);
  }

  /**
   * Registers a newly validated image element and assigns a unique tracking ID.
   * @returns Generated unique image ID
   */
  register(element: HTMLImageElement, src?: string): string {
    const currentSrc = src || element.currentSrc || element.src;
    let registeredUrls = this.registeredElements.get(element);

    if (!registeredUrls) {
      registeredUrls = new Set<string>();
      this.registeredElements.set(element, registeredUrls);
    }
    registeredUrls.add(currentSrc);

    // Assign unique ID attribute to DOM element if not present
    let id = element.dataset.shieldsightId;
    if (!id) {
      this.imageCounter += 1;
      id = `shieldsight-img-${this.imageCounter}`;
      element.dataset.shieldsightId = id;
    }

    return id;
  }

  /**
   * Gets total number of unique registration operations performed in this session.
   */
  getRegisteredCount(): number {
    return this.imageCounter;
  }

  /**
   * Resets internal counters. WeakMap entries clear automatically on garbage collection.
   */
  clear(): void {
    this.registeredElements = new WeakMap();
    this.imageCounter = 0;
  }
}

export const imageRegistry = new ImageRegistry();
