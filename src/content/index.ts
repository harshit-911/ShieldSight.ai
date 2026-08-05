/**
 * ShieldSight AI - Content Script
 * Injected into active web pages. Orchestrates Image Discovery Service, Text Discovery Service,
 * Image & Text Processing Queues, and Protection Layers in parallel.
 * Performance Optimized: Uses IntersectionObserver to prioritize visible viewport content for AI inference.
 * Website Restriction Warnings: Renders full-screen safety warnings for HIGH/CRITICAL threat websites.
 */

import { storageService, SENSITIVITY_THRESHOLDS, ShieldSightSettings } from '../services/storage';
import { imageDiscoveryService } from '../services/image/ImageDiscoveryService';
import { imageProcessingQueue } from '../services/queue/ImageProcessingQueue';
import { protectionService } from '../services/protection/ProtectionService';
import { openNSFWClassifier } from '../services/ai/OpenNSFWClassifier';
import { violenceClassifier } from '../services/ai/ViolenceClassifier';
import { CombinedClassificationResult } from '../services/ai/ClassificationTypes';
import { DecisionEngine } from '../services/ai/DecisionEngine';

import { textDiscoveryService } from '../services/text/TextDiscoveryService';
import { textProcessingQueue } from '../services/queue/TextProcessingQueue';
import { textProtectionService } from '../services/protection/TextProtectionService';
import { ToxicityResult } from '../types/text';
import { DiscoveredImage } from '../types';

import { conversationDiscoveryService } from '../services/conversation/ConversationDiscoveryService';
import { conversationQueue } from '../services/conversation/ConversationQueue';
import { obscureMessage } from '../services/conversation/ConversationUtils';
import { presentationService } from '../services/presentation/PresentationService';

console.log('[ShieldSight AI] Content script injected successfully (Image & Text Moderation Engine Active)');

class ContentProtectionEngine {
  private isEnabled: boolean = true;
  private isPresentationMode: boolean = false;
  private unsubscribeImageDiscovery: (() => void) | null = null;
  private unsubscribeImageQueueCompleted: (() => void) | null = null;
  private unsubscribeImageQueueFailed: (() => void) | null = null;
  private unsubscribeTextDiscovery: (() => void) | null = null;
  private unsubscribeTextQueueCompleted: (() => void) | null = null;
  private unsubscribeConversationDiscovery: (() => void) | null = null;
  private unsubscribeConversationCompleted: (() => void) | null = null;

  // Viewport Observer for lazy AI inference scheduling
  private viewportObserver: IntersectionObserver | null = null;
  private observedImagesMap: Map<HTMLImageElement, DiscoveredImage> = new Map();
  private warningOverlay: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const settings = await storageService.getSettings();
    this.isEnabled = settings.protectionEnabled;
    this.isPresentationMode = settings.presentationModeEnabled;
    this.applySettings(settings);

    console.log(`[ShieldSight AI] Initial Protection State: ${this.isEnabled ? 'ENABLED' : 'DISABLED'}`);

    // Listen for real-time state toggles and sensitivity updates from extension popup / storage
    storageService.onSettingsChange((newSettings) => {
      this.isPresentationMode = newSettings.presentationModeEnabled;
      this.applySettings(newSettings);
      this.handleStateChange(newSettings.protectionEnabled);
    });

    if (this.isEnabled) {
      this.activateProtection();
    }
  }

  /**
   * Applies dynamic sensitivity thresholds immediately to Decision Engine and classifiers.
   */
  private applySettings(settings: ShieldSightSettings): void {
    const nsfwThreshold = SENSITIVITY_THRESHOLDS[settings.nsfwSensitivity] || 0.6;
    const violenceThreshold = SENSITIVITY_THRESHOLDS[settings.violenceSensitivity] || 0.6;

    openNSFWClassifier.setThreshold(nsfwThreshold);
    violenceClassifier.setThreshold(violenceThreshold);
  }

  private handleStateChange(enabled: boolean): void {
    if (this.isEnabled === enabled) return;
    this.isEnabled = enabled;

    console.log(`[ShieldSight AI] Protection status updated: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    if (enabled) {
      this.activateProtection();
    } else {
      this.deactivateProtection();
    }
  }

  /**
   * Activates both Image and Text Protection pipelines in parallel.
   */
  private activateProtection(): void {
    console.log('[ShieldSight AI Engine] Protection active - Starting Image & Text Discovery, Queue, & Protection Services');
    
    // Initialize IntersectionObserver to lazily process offscreen elements
    if (typeof IntersectionObserver !== 'undefined') {
      this.viewportObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const imgEl = entry.target as HTMLImageElement;
              const imageObj = this.observedImagesMap.get(imgEl);
              if (imageObj) {
                // Post-layout render size check: Skip tiny avatars and thumbnails instantly
                const rect = imgEl.getBoundingClientRect();
                if (rect.width > 0 && rect.width < 64 && rect.height > 0 && rect.height < 64) {
                  // Safely unblur and remove scanning card immediately
                  protectionService.protect(imageObj, {
                    imageId: imageObj.id,
                    isHarmful: false,
                    nsfw: { probability: 0, label: 'SAFE' },
                    violence: { probability: 0, label: 'SAFE' },
                    overallDecision: 'SAFE',
                    results: {},
                    label: 'SAFE',
                    confidence: 0,
                    timestamp: Date.now(),
                  });
                } else {
                  imageProcessingQueue.enqueue(imageObj);
                }
                this.observedImagesMap.delete(imgEl);
                this.viewportObserver?.unobserve(imgEl);
              }
            }
          });
        },
        { rootMargin: '150px' }
      );
    }

    // --- 1. IMAGE PIPELINE SUBSCRIPTIONS ---
    if (!this.unsubscribeImageDiscovery) {
      this.unsubscribeImageDiscovery = imageDiscoveryService.onDiscovered((discoveredImage) => {
        protectionService.applyPreBlur(discoveredImage);

        if (this.viewportObserver) {
          const imgEl = discoveredImage.element;
          this.observedImagesMap.set(imgEl, discoveredImage);
          this.viewportObserver.observe(imgEl);
        } else {
          imageProcessingQueue.enqueue(discoveredImage);
        }
      });
    }

    if (!this.unsubscribeImageQueueCompleted) {
      this.unsubscribeImageQueueCompleted = imageProcessingQueue.on('JOB_COMPLETED', (event) => {
        if (event.job && event.job.result) {
          const combinedResult = event.job.result as CombinedClassificationResult;
          protectionService.protect(event.job.image, combinedResult);

          if (this.isPresentationMode) {
            presentationService.renderPipelineHUD(event.job.image, combinedResult);
          }

          // Evaluate risk score for full-page warning interstitial triggers
          const riskAssessment = DecisionEngine.assessRisk(
            combinedResult.nsfw.probability,
            combinedResult.violence.probability
          );

          if (
            (riskAssessment.riskLevel === 'HIGH' || riskAssessment.riskLevel === 'CRITICAL') &&
            !sessionStorage.getItem('shieldsight-bypass-warning')
          ) {
            this.showWebsiteWarning(riskAssessment.violationCategories);
          }

          const nsfwBlocked = combinedResult.nsfw.label === 'NSFW';
          const graphicBlocked = combinedResult.violence.label === 'GRAPHIC';
          const duration = event.job.endTime ? event.job.endTime - (event.job.startTime || Date.now()) : 50;

          storageService.recordClassification(nsfwBlocked, graphicBlocked, duration);
        }
      });
    }

    if (!this.unsubscribeImageQueueFailed) {
      this.unsubscribeImageQueueFailed = imageProcessingQueue.on('JOB_FAILED', (event) => {
        if (event.job) {
          console.warn(`[ShieldSight Content] Job failed for image ${event.job.image.id}. Removing scanning overlay.`);
          protectionService.protect(event.job.image, {
            imageId: event.job.image.id,
            isHarmful: false,
            nsfw: { probability: 0, label: 'SAFE' },
            violence: { probability: 0, label: 'SAFE' },
            overallDecision: 'SAFE',
            results: {},
            label: 'SAFE',
            confidence: 0,
            timestamp: Date.now(),
          });
        }
      });
    }

    // --- 2. TEXT PIPELINE SUBSCRIPTIONS ---
    if (!this.unsubscribeTextDiscovery) {
      this.unsubscribeTextDiscovery = textDiscoveryService.onDiscovered((discoveredBlock) => {
        textProcessingQueue.enqueue(discoveredBlock);
      });
    }

    if (!this.unsubscribeTextQueueCompleted) {
      this.unsubscribeTextQueueCompleted = textProcessingQueue.on('JOB_COMPLETED', (event) => {
        if (event.job && event.job.result) {
          const result = event.job.result as ToxicityResult;
          textProtectionService.protect(event.job.block, result);
        }
      });
    }

    if (!this.unsubscribeConversationDiscovery) {
      this.unsubscribeConversationDiscovery = conversationDiscoveryService.onDiscovered((message) => {
        conversationQueue.enqueue(message);
      });
    }

    if (!this.unsubscribeConversationCompleted) {
      this.unsubscribeConversationCompleted = conversationQueue.on('MESSAGE_COMPLETED', (event) => {
        if (event.message && event.result && event.result.isHarmful) {
          obscureMessage(event.message, event.result);
        }
      });
    }

    // Start queues and discovery services
    imageProcessingQueue.start();
    imageDiscoveryService.start();

    textProcessingQueue.start();
    textDiscoveryService.start();

    // Start real-time messaging protection module
    conversationQueue.start();
    conversationDiscoveryService.start();
  }

  /**
   * Renders a full-screen matte security warning interstitial for restricted pages.
   */
  private showWebsiteWarning(categories: string[]): void {
    if (this.warningOverlay) return;

    // Build Matte Warning Interstitial elements safely
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = '#0c101d';
    overlay.style.color = '#f3f4f6';
    overlay.style.zIndex = '9999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    overlay.style.padding = '20px';

    const card = document.createElement('div');
    card.style.background = '#111827';
    card.style.border = '1px solid #1f2937';
    card.style.borderRadius = '12px';
    card.style.padding = '32px';
    card.style.maxWidth = '400px';
    card.style.width = '100%';
    card.style.textAlign = 'center';
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.7)';

    const icon = document.createElement('div');
    icon.style.fontSize = '36px';
    icon.style.marginBottom = '16px';
    icon.textContent = '🛡️';

    const title = document.createElement('h2');
    title.style.fontSize = '18px';
    title.style.fontWeight = '800';
    title.style.margin = '0 0 8px 0';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '0.05em';
    title.textContent = 'ShieldSight Restriction';

    const subtitle = document.createElement('p');
    subtitle.style.fontSize = '12px';
    subtitle.style.fontWeight = '600';
    subtitle.style.color = '#f87171';
    subtitle.style.margin = '0 0 16px 0';
    subtitle.textContent = 'This website contains harmful content.';

    const detectedTitle = document.createElement('div');
    detectedTitle.style.fontSize = '10px';
    detectedTitle.style.fontWeight = '700';
    detectedTitle.style.textTransform = 'uppercase';
    detectedTitle.style.color = '#64748b';
    detectedTitle.style.textAlign = 'left';
    detectedTitle.style.marginBottom = '8px';
    detectedTitle.textContent = 'Detected Violations';

    const list = document.createElement('div');
    list.style.textAlign = 'left';
    list.style.fontSize = '11px';
    list.style.background = '#0c101d';
    list.style.border = '1px solid #1f2937';
    list.style.borderRadius = '6px';
    list.style.padding = '12px';
    list.style.marginBottom = '20px';

    categories.forEach((cat) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.color = '#d1d5db';
      item.style.marginBottom = '6px';

      const check = document.createElement('span');
      check.textContent = '✓';
      check.style.color = '#f87171';
      check.style.fontWeight = 'bold';

      const label = document.createElement('span');
      label.textContent = this.formatCategoryLabel(cat);

      item.appendChild(check);
      item.appendChild(label);
      list.appendChild(item);
    });

    const desc = document.createElement('p');
    desc.style.fontSize = '11px';
    desc.style.color = '#9ca3af';
    desc.style.lineHeight = '1.4';
    desc.style.margin = '0 0 24px 0';
    desc.textContent = 'To help keep this browsing session safe, access to this website has been restricted by your safety policy.';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.flexDirection = 'column';
    actions.style.gap = '8px';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.textContent = 'Go Back';
    backBtn.style.background = '#1f2937';
    backBtn.style.color = '#ffffff';
    backBtn.style.border = '1px solid #374151';
    backBtn.style.padding = '10px';
    backBtn.style.borderRadius = '6px';
    backBtn.style.fontSize = '11px';
    backBtn.style.fontWeight = '700';
    backBtn.style.cursor = 'pointer';
    backBtn.style.textTransform = 'uppercase';
    backBtn.style.letterSpacing = '0.03em';

    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.history.back();
    });

    const bypassBtn = document.createElement('button');
    bypassBtn.type = 'button';
    bypassBtn.textContent = 'Continue Anyway';
    bypassBtn.style.background = 'transparent';
    bypassBtn.style.color = '#6b7280';
    bypassBtn.style.border = 'none';
    bypassBtn.style.fontSize = '10px';
    bypassBtn.style.fontWeight = '600';
    bypassBtn.style.cursor = 'pointer';

    bypassBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStorage.setItem('shieldsight-bypass-warning', 'true');
      if (overlay.parentElement) {
        overlay.parentElement.removeChild(overlay);
      }
      this.warningOverlay = null;
    });

    actions.appendChild(backBtn);
    actions.appendChild(bypassBtn);

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(detectedTitle);
    card.appendChild(list);
    card.appendChild(desc);
    card.appendChild(actions);

    overlay.appendChild(card);
    (document.body || document.documentElement).appendChild(overlay);
    this.warningOverlay = overlay;
  }

  private formatCategoryLabel(cat: string): string {
    switch (cat) {
      case 'NSFW_CONTENT':
        return 'Adult Content';
      case 'GRAPHIC_VIOLENCE':
        return 'Graphic Violence';
      case 'TOXIC_LANGUAGE':
        return 'Harmful Language';
      case 'EMBEDDED_TEXT':
        return 'Unsafe Image Content';
      default:
        return 'Sensitive Content';
    }
  }

  /**
   * Deactivates protection: pauses Image and Text discovery engines and queues.
   */
  private deactivateProtection(): void {
    console.log('[ShieldSight AI Engine] Protection paused - Stopping Discovery & Queue Services');
    conversationDiscoveryService.stop();

    imageDiscoveryService.stop();
    imageProcessingQueue.pause();

    textDiscoveryService.stop();
    textProcessingQueue.pause();

    if (this.viewportObserver) {
      this.viewportObserver.disconnect();
      this.viewportObserver = null;
    }
    this.observedImagesMap.clear();

    if (this.warningOverlay && this.warningOverlay.parentElement) {
      this.warningOverlay.parentElement.removeChild(this.warningOverlay);
    }
    this.warningOverlay = null;

    if (this.unsubscribeImageDiscovery) {
      this.unsubscribeImageDiscovery();
      this.unsubscribeImageDiscovery = null;
    }

    if (this.unsubscribeImageQueueCompleted) {
      this.unsubscribeImageQueueCompleted();
      this.unsubscribeImageQueueCompleted = null;
    }

    if (this.unsubscribeImageQueueFailed) {
      this.unsubscribeImageQueueFailed();
      this.unsubscribeImageQueueFailed = null;
    }

    if (this.unsubscribeTextDiscovery) {
      this.unsubscribeTextDiscovery();
      this.unsubscribeTextDiscovery = null;
    }

    if (this.unsubscribeTextQueueCompleted) {
      this.unsubscribeTextQueueCompleted();
      this.unsubscribeTextQueueCompleted = null;
    }
  }
}

// Instantiate content protection controller
new ContentProtectionEngine();
