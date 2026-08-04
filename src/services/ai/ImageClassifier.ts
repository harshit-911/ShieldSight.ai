/**
 * ShieldSight AI - Generic Image Classifier Interface
 * Standardized interface implemented by all independent AI classifiers
 * (e.g. OpenNSFW2, Violence & Gore, OCR, Custom Classifiers).
 */

import { DiscoveredImage } from '../../types';
import { ClassificationResult } from '../../types/queue';

export interface ImageClassifier {
  /** Unique classifier identifier */
  readonly id: string;
  /** Human-readable classifier name */
  readonly name: string;

  /**
   * Initializes the AI classifier model session and loads model weights.
   */
  initialize(): Promise<void>;

  /**
   * Executes AI classification on a discovered image element.
   * @param image Discovered webpage image record
   */
  classify(image: DiscoveredImage): Promise<ClassificationResult>;
}
