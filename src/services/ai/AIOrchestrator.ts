/**
 * ShieldSight AI - AI Orchestrator
 * Orchestrates parallel execution across multiple independent AI classifiers,
 * gathers individual results, evaluates overall decisions via DecisionEngine,
 * and formats combined classification records.
 * Integrates Tesseract OCR and Toxicity classification synchronously inside the pipeline to prevent FOUC.
 */

import { DiscoveredImage } from '../../types';
import { IImageClassifier } from '../../types/queue';
import { ImageClassifier } from './ImageClassifier';
import { openNSFWClassifier } from './OpenNSFWClassifier';
import { violenceClassifier } from './ViolenceClassifier';
import { DecisionEngine } from './DecisionEngine';
import {
  CombinedClassificationResult,
  OpenNSFWResult,
  ViolenceResult,
  NSFWLabel,
  ViolenceLabel,
} from './ClassificationTypes';
import { pipelineAuditTracker } from '../audit/PipelineAuditTracker';
import { ocrService } from '../ocr/OCRService';
import { toxicityClassifier } from './ToxicityClassifier';
import { ToxicityLabel } from '../../types/text';

export class AIOrchestrator implements IImageClassifier {
  readonly id: string = 'ai-orchestrator-v1';
  readonly name: string = 'ShieldSight Multi-Classifier Orchestrator';

  private classifiers: ImageClassifier[] = [];
  private isInitialized: boolean = false;

  constructor(classifiers: ImageClassifier[] = [openNSFWClassifier, violenceClassifier]) {
    this.classifiers = classifiers;
  }

  /**
   * Registers a new independent AI classifier into the orchestration pipeline.
   */
  registerClassifier(classifier: ImageClassifier): void {
    if (!this.classifiers.some((c) => c.id === classifier.id)) {
      this.classifiers.push(classifier);
      console.log(`[ShieldSight Orchestrator] Registered classifier: ${classifier.name}`);
    }
  }

  /**
   * Pre-initializes all registered AI classifiers in parallel.
   */
  async initializeAll(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    console.log('[ShieldSight Orchestrator] Initializing all AI classifiers in parallel...');
    
    await Promise.all([
      ...this.classifiers.map((classifier) =>
        classifier.initialize().catch((err) => {
          console.warn(`[ShieldSight Orchestrator] Initialization error for ${classifier.name}:`, err);
        })
      ),
      ocrService.initialize().catch((err) => {
        console.warn('[ShieldSight Orchestrator] Initialization error for OCR Service:', err);
      })
    ]);

    this.isInitialized = true;
    console.log('[ShieldSight Orchestrator] All AI classifiers and OCR initialized successfully');
  }

  /**
   * Executes all registered AI classifiers and Tesseract OCR in parallel on a discovered image,
   * evaluates toxicity on any extracted embedded texts, and resolves the overall combined decision.
   */
  async classify(image: DiscoveredImage): Promise<CombinedClassificationResult> {
    if (!this.isInitialized) {
      await this.initializeAll();
    }

    const overallStart = performance.now();

    // 1. Run all registered classifiers and Tesseract OCR in parallel
    const [rawResults, ocrRes] = await Promise.all([
      Promise.all(
        this.classifiers.map(async (classifier) => {
          try {
            const res = await classifier.classify(image);
            return { classifier, res, error: null };
          } catch (error) {
            return { classifier, res: null, error };
          }
        })
      ),
      ocrService.recognizeImage(image).catch((err) => {
        console.warn(`[ShieldSight Orchestrator] OCR check failed for ${image.id}:`, err);
        return null;
      }),
    ]);

    const resultMap: Record<string, any> = {};
    let nsfwProbability = 0.0;
    let nsfwLabel: NSFWLabel = 'SAFE';
    let violenceProbability = 0.0;
    let violenceLabel: ViolenceLabel = 'SAFE';

    // 2. Extract image classifier results
    rawResults.forEach(({ classifier, res }) => {
      if (res) {
        resultMap[classifier.id] = res;

        if (classifier.id === 'opennsfw2-onnx' || 'nsfwLabel' in res) {
          const nsfwRes = res as OpenNSFWResult;
          nsfwProbability = nsfwRes.probability;
          nsfwLabel = nsfwRes.nsfwLabel;
        } else if (classifier.id === 'violence-classifier' || 'violenceLabel' in res) {
          const vRes = res as ViolenceResult;
          violenceProbability = vRes.probability;
          violenceLabel = vRes.violenceLabel;
        }
      }
    });

    // 3. Evaluate OCR extracted text toxicity
    let textBlocked = false;
    let textLabel: ToxicityLabel = 'SAFE';
    let textConfidence = 0.0;
    const ocrText = ocrRes?.extractedText || '';

    if (ocrText && ocrText.length >= 2) {
      try {
        const toxResult = await toxicityClassifier.classify({
          id: `ocr-text-${image.id}`,
          text: ocrText,
          element: image.element,
          timestamp: Date.now(),
        });
        textLabel = toxResult.label;
        textConfidence = toxResult.confidence;
        if (toxResult.isHarmful && toxResult.label !== 'SAFE') {
          textBlocked = true;
          if (toxResult.label === 'SEXUAL') {
            nsfwLabel = 'NSFW';
            nsfwProbability = Math.max(nsfwProbability, textConfidence);
          }
        }
      } catch (err) {
        console.warn(`[ShieldSight Orchestrator] Toxicity evaluation on OCR text failed for ${image.id}:`, err);
      }
    }

    // 4. Compute overall decision via DecisionEngine (elevating to blocked if image text is toxic/NSFW)
    let overallDecision = DecisionEngine.evaluateDecision(nsfwLabel, violenceLabel);
    if (overallDecision === 'SAFE' && textBlocked) {
      overallDecision = 'BOTH';
    }

    const totalDurationMs = Math.round(performance.now() - overallStart);

    // Audit Logging Stages 4, 5, 6, 7
    pipelineAuditTracker.recordStage(image.id, image.src, 4); // Preprocessed
    pipelineAuditTracker.recordStage(image.id, image.src, 5); // Inference completed
    pipelineAuditTracker.recordStage(image.id, image.src, 6, {
      probabilities: { nsfw: nsfwProbability, violence: violenceProbability },
    });
    pipelineAuditTracker.recordStage(image.id, image.src, 7, { decision: overallDecision });

    const combinedResult: CombinedClassificationResult = {
      imageId: image.id,
      isHarmful: overallDecision !== 'SAFE',
      nsfw: {
        probability: nsfwProbability,
        label: nsfwLabel,
      },
      violence: {
        probability: violenceProbability,
        label: violenceLabel,
      },
      overallDecision,
      results: resultMap,
      label: overallDecision,
      confidence: Math.max(nsfwProbability, violenceProbability, textConfidence, 0.95),
      timestamp: Date.now(),
      textBlocked,
      ocrText,
      textLabel,
    };

    // 5. Log detailed structured report
    this.logOrchestrationReport(image, combinedResult, rawResults, totalDurationMs);

    return combinedResult;
  }

  /**
   * Structured console logging for multi-classifier orchestration report.
   */
  private logOrchestrationReport(
    image: DiscoveredImage,
    combined: CombinedClassificationResult,
    rawResults: Array<{ classifier: ImageClassifier; res: any; error: any }>,
    totalDurationMs: number
  ): void {
    const decisionColor =
      combined.overallDecision === 'SAFE'
        ? 'color: #10b981; font-weight: bold;'
        : 'color: #ef4444; font-weight: bold;';

    console.groupCollapsed(
      `%c[ShieldSight Orchestrator]%c ${image.id} → OVERALL DECISION: ${combined.overallDecision} (${totalDurationMs}ms)`,
      decisionColor,
      'color: #f8fafc; font-weight: bold;'
    );

    rawResults.forEach(({ classifier, res, error }) => {
      if (res) {
        console.log(
          `• ${classifier.name} | Inference: ${res.inferenceTimeMs || 0}ms | Probability: ${res.probability || 0} | Decision: ${res.label}`
        );
      } else if (error) {
        console.warn(`• ${classifier.name} | Error: ${error.message}`);
      }
    });

    if (combined.ocrText) {
      console.log(
        `• OCR Extracted Text: "${combined.ocrText}" | Classification: ${combined.textLabel} | Blocked: ${combined.textBlocked}`
      );
    }

    console.log(`▸ Final Combined Decision: %c${combined.overallDecision}`, decisionColor);
    console.groupEnd();
  }
}

export const aiOrchestrator = new AIOrchestrator();
