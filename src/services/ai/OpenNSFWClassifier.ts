/**
 * ShieldSight AI - OpenNSFW2 Local AI Classifier
 * Implements ImageClassifier interface using ONNX Runtime Web.
 * Performs 100% in-browser local AI image classification with zero cloud network dependencies.
 */

import * as ort from 'onnxruntime-web';
import { DiscoveredImage } from '../../types';
import { ImageClassifier } from './ImageClassifier';
import { OpenNSFWResult, NSFWLabel } from './ClassificationTypes';
import { ImagePreprocessor } from './ImagePreprocessor';
import { modelLoader, ModelLoader } from './ModelLoader';

export const NSFW_PROBABILITY_THRESHOLD = 0.6;

export class OpenNSFWClassifier implements ImageClassifier {
  readonly id: string = 'opennsfw2-onnx';
  readonly name: string = 'OpenNSFW2 Classifier';

  private loader: ModelLoader;
  private threshold: number = NSFW_PROBABILITY_THRESHOLD;
  private metrics = {
    successfullyClassifiedCount: 0,
    skippedSecurityCount: 0,
    totalPreprocessingTimeMs: 0,
    totalInferenceTimeMs: 0,
  };

  constructor(loader: ModelLoader = modelLoader) {
    this.loader = loader;
  }

  /**
   * Sets dynamic sensitivity threshold (e.g. 0.8 / 0.6 / 0.4).
   */
  setThreshold(val: number): void {
    this.threshold = val;
    console.log(`[ShieldSight Classifier] OpenNSFW2 sensitivity threshold updated to: ${val}`);
  }

  /**
   * Pre-initializes ONNX session and model weights.
   */
  async initialize(): Promise<void> {
    await this.loader.loadModel();
  }

  /**
   * Returns current pipeline performance and security metrics.
   */
  getPipelineMetrics() {
    const total = this.metrics.successfullyClassifiedCount;
    return {
      successfullyClassifiedCount: total,
      skippedSecurityCount: this.metrics.skippedSecurityCount,
      averagePreprocessingTimeMs: total > 0 ? Math.round(this.metrics.totalPreprocessingTimeMs / total) : 0,
      averageInferenceTimeMs: total > 0 ? Math.round(this.metrics.totalInferenceTimeMs / total) : 0,
    };
  }

  /**
   * Executes local ONNX model classification on a discovered image URL.
   * Fetches image as Blob and processes via ImageBitmap to prevent canvas tainting.
   */
  async classify(image: DiscoveredImage): Promise<OpenNSFWResult> {
    const overallStart = performance.now();

    // 1. Ensure model session is initialized
    const session = await this.loader.loadModel();

    let tensorData: Float32Array;
    const preprocessStart = performance.now();

    try {
      // 2. Untainted Blob + ImageBitmap preprocessing
      tensorData = await ImagePreprocessor.preprocessUrl(image.src);
      const preprocessDuration = performance.now() - preprocessStart;
      this.metrics.totalPreprocessingTimeMs += preprocessDuration;
    } catch (error) {
      this.metrics.skippedSecurityCount += 1;
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.warn(`[ShieldSight Security] Skipped image ${image.id} due to CORS/security restriction: ${errorMsg}`);
      throw new Error(`[ShieldSight Security] CORS restriction for image ${image.id}: ${errorMsg}`);
    }

    // 3. Wrap in ONNX Tensor: shape [1, 224, 224, 3]
    const inputTensor = new ort.Tensor('float32', tensorData, [1, 224, 224, 3]);
    const inputName = session.inputNames[0] || 'input:0';
    const outputName = session.outputNames[0] || 'outputs';

    // 4. Execute ONNX Model Inference
    const inferenceStart = performance.now();
    const feeds: Record<string, ort.Tensor> = { [inputName]: inputTensor };
    const outputMap = await session.run(feeds);
    const inferenceDuration = performance.now() - inferenceStart;
    this.metrics.totalInferenceTimeMs += inferenceDuration;

    // 5. Output Interpretation: Index 0 = SFW (Safe), Index 1 = NSFW
    const outputTensor = outputMap[outputName];
    const outputData = outputTensor.data as Float32Array;

    const nsfwProbability = outputData.length >= 2 ? outputData[1] : outputData[0] || 0.0;
    const totalDurationMs = Math.round(performance.now() - overallStart);

    const label: NSFWLabel = nsfwProbability >= this.threshold ? 'NSFW' : 'SAFE';
    const confidence = nsfwProbability >= this.threshold
      ? nsfwProbability
      : 1.0 - nsfwProbability;

    this.metrics.successfullyClassifiedCount += 1;

    const result: OpenNSFWResult = {
      imageId: image.id,
      isHarmful: label === 'NSFW',
      probability: Math.round(nsfwProbability * 1000) / 1000,
      nsfwLabel: label,
      label,
      confidence: Math.round(confidence * 1000) / 1000,
      inferenceTimeMs: totalDurationMs,
      timestamp: Date.now(),
    };

    return result;
  }
}

export const openNSFWClassifier = new OpenNSFWClassifier();
