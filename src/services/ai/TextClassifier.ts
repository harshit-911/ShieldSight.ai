/**
 * ShieldSight AI - Generic Text Classifier Interface
 * Standard contract for local text moderation plugins.
 */

import { DiscoveredTextBlock, ToxicityResult } from '../../types/text';

export interface TextClassifier {
  readonly id: string;
  readonly name: string;

  /**
   * Pre-initializes model weights, session, or tokenizer.
   */
  initialize(): Promise<void>;

  /**
   * Executes local text classification on a discovered text block.
   */
  classify(textBlock: DiscoveredTextBlock): Promise<ToxicityResult>;
}
