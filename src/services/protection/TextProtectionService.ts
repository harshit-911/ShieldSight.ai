/**
 * ShieldSight AI - Text Protection Service
 * Applies CSS blur filters and glassmorphism safety badges over toxic or harmful text blocks.
 * Supports temporary 'Reveal' unblur actions per page session.
 * Completely isolated from image protection logic.
 * XSS Hardened: 100% Safe DOM construction without unsafe innerHTML.
 */

import { DiscoveredTextBlock, ToxicityResult } from '../../types/text';
import { ensureTextProtectionStyles } from './textProtectionUtils';
import { logger } from '../../utils/logger';

export class TextProtectionService {
  private protectedElements: WeakSet<HTMLElement> = new WeakSet();
  private activeBadges: Map<string, HTMLElement> = new Map();

  constructor() {
    ensureTextProtectionStyles();
  }

  /**
   * Applies visual text blur and inline glassmorphism badge if classified as toxic/harmful.
   */
  protect(block: DiscoveredTextBlock, result: ToxicityResult): boolean {
    if (!result.isHarmful || result.label === 'SAFE') {
      return false;
    }

    const el = block.element;
    if (this.protectedElements.has(el)) {
      return false;
    }

    this.protectedElements.add(el);

    // Apply CSS Blur
    el.classList.add('shieldsight-blurred-text');

    // Create & attach inline glassmorphism badge safely
    this.attachBadge(block, result);

    logger.styled(
      '[ShieldSight Text Protection]',
      `Text Block Protected: ${block.id} | Category: ${result.label} | Confidence: ${Math.round(result.confidence * 100)}%`,
      'color: #ec4899; font-weight: bold;',
      'color: #f8fafc; font-weight: bold;'
    );

    return true;
  }

  /**
   * Temporarily removes blur and hides safety badge for current page session.
   */
  unprotect(textId: string, el: HTMLElement): void {
    el.classList.remove('shieldsight-blurred-text');
    el.style.filter = 'none';

    const badge = this.activeBadges.get(textId);
    if (badge && badge.parentElement) {
      badge.parentElement.removeChild(badge);
      this.activeBadges.delete(textId);
    }
    logger.info(`[ShieldSight Text Protection] Protection Revealed for ${textId}`);
  }

  /**
   * Safe DOM construction for inline glassmorphism badge (XSS Immune).
   */
  private attachBadge(block: DiscoveredTextBlock, _result: ToxicityResult): void {
    const el = block.element;
    const parent = el.parentElement;
    if (!parent) return;

    const parentPos = window.getComputedStyle(parent).position;
    if (parentPos === 'static') {
      parent.style.position = 'relative';
    }

    const badge = document.createElement('span');
    badge.className = 'shieldsight-text-badge';
    badge.setAttribute('data-shieldsight-text-id', block.id);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'shieldsight-badge-icon';
    iconSpan.textContent = '🛡️';

    const textSpan = document.createElement('span');
    textSpan.className = 'shieldsight-badge-text';
    textSpan.textContent = 'Sensitive Language Hidden';

    const revealBtn = document.createElement('button');
    revealBtn.className = 'shieldsight-badge-reveal';
    revealBtn.type = 'button';
    revealBtn.textContent = 'Reveal';

    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.unprotect(block.id, el);
    });

    badge.appendChild(iconSpan);
    badge.appendChild(textSpan);
    badge.appendChild(revealBtn);

    if (el.nextSibling) {
      parent.insertBefore(badge, el.nextSibling);
    } else {
      parent.appendChild(badge);
    }

    this.activeBadges.set(block.id, badge);
  }
}

export const textProtectionService = new TextProtectionService();
