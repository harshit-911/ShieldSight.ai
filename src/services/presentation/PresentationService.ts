/**
 * ShieldSight AI - Presentation Mode Pipeline HUD Service
 * Visually demonstrates the live AI moderation pipeline for evaluation.
 * 100% XSS Hardened: Safe DOM node construction.
 * Disappears automatically after 3 seconds.
 */

import { DiscoveredImage } from '../../types';
import { CombinedClassificationResult } from '../ai/ClassificationTypes';
import { ensurePresentationStyles } from './presentationUtils';

export class PresentationService {
  constructor() {
    ensurePresentationStyles();
  }

  /**
   * Renders glassmorphic step-by-step HUD pipeline overlay over target image.
   * Auto-removes after 3.0 seconds.
   */
  renderPipelineHUD(
    image: DiscoveredImage,
    result: CombinedClassificationResult,
    ocrCharCount: number = 0,
    toxicityLabel: string = 'SAFE'
  ): void {
    const imgEl = image.element;
    const parent = imgEl.parentElement;
    if (!parent) return;

    const parentComputedPos = window.getComputedStyle(parent).position;
    if (parentComputedPos === 'static') {
      parent.style.position = 'relative';
    }

    // Safe DOM Node Construction
    const overlay = document.createElement('div');
    overlay.className = 'shieldsight-hud-overlay';
    overlay.setAttribute('data-shieldsight-hud-id', image.id);

    const card = document.createElement('div');
    card.className = 'shieldsight-hud-card';

    const header = document.createElement('div');
    header.className = 'shieldsight-hud-header';
    header.textContent = '⚡ ShieldSight AI Pipeline';
    card.appendChild(header);

    // Pipeline Steps
    const steps = [
      { text: 'Image Detected' },
      { text: `NSFW Model: `, val: `${(result.nsfw.probability).toFixed(3)}` },
      { text: `Violence Model: `, val: `${(result.violence.probability).toFixed(3)}` },
      { text: `OCR: `, val: ocrCharCount > 0 ? `Detected ${ocrCharCount} chars` : 'No embedded text' },
      { text: `Toxicity: `, val: toxicityLabel, isSafe: toxicityLabel === 'SAFE' },
      {
        text: `Decision: `,
        val: result.overallDecision !== 'SAFE' ? 'BLOCKED' : 'SAFE',
        isBlocked: result.overallDecision !== 'SAFE',
      },
      { text: result.overallDecision !== 'SAFE' ? 'Protection Applied' : 'Image Rendered' },
    ];

    steps.forEach((step, idx) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'shieldsight-hud-step';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = step.text;
      stepEl.appendChild(labelSpan);

      if (step.val) {
        const valSpan = document.createElement('span');
        if (step.isBlocked) {
          valSpan.className = 'shieldsight-hud-val-blocked';
        } else if (step.isSafe) {
          valSpan.className = 'shieldsight-hud-val-safe';
        } else {
          valSpan.className = 'shieldsight-hud-val';
        }
        valSpan.textContent = step.val;
        stepEl.appendChild(valSpan);
      }

      card.appendChild(stepEl);

      if (idx < steps.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'shieldsight-hud-arrow';
        arrow.textContent = '↓';
        card.appendChild(arrow);
      }
    });

    overlay.appendChild(card);

    if (imgEl.nextSibling) {
      parent.insertBefore(overlay, imgEl.nextSibling);
    } else {
      parent.appendChild(overlay);
    }

    // Auto-remove overlay after 3.0 seconds
    setTimeout(() => {
      if (overlay.parentElement) {
        overlay.parentElement.removeChild(overlay);
      }
    }, 3000);
  }
}

export const presentationService = new PresentationService();
