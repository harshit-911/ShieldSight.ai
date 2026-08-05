/**
 * ShieldSight AI - Image Preprocessor
 * Asynchronously fetches image URLs as binary blobs, converts to ImageBitmap,
 * and extracts normalized BGR Float32Array tensors without canvas tainting.
 */

import { PreprocessOptions } from './ClassificationTypes';

/**
 * Yahoo Open-NSFW Caffe Model Preprocessing Constants:
 * Target Dimensions: 224x224
 * Format: NHWC [1, 224, 224, 3]
 * Color Order: BGR
 * Mean Subtraction: BGR [104.00698793, 116.66876762, 122.67891434]
 */
export const DEFAULT_PREPROCESS_OPTIONS: PreprocessOptions = {
  targetWidth: 224,
  targetHeight: 224,
  mean: [104.00698793, 116.66876762, 122.67891434],
};

export class ImagePreprocessor {
  /**
   * Asynchronously fetches an image URL as a Blob, converts to ImageBitmap,
   * and extracts an untainted 224x224 BGR Float32Array tensor.
   * Completely avoids cross-origin canvas tainting (SecurityError).
   */
  static async preprocessUrl(
    imageUrl: string,
    options: PreprocessOptions = DEFAULT_PREPROCESS_OPTIONS
  ): Promise<Float32Array> {
    const { targetWidth, targetHeight, mean } = options;
    const bMean = mean ? mean[0] : 104.00698793;
    const gMean = mean ? mean[1] : 116.66876762;
    const rMean = mean ? mean[2] : 122.67891434;

    const tensorSize = targetWidth * targetHeight * 3;
    const tensorData = new Float32Array(tensorSize);

    // Handle data URIs directly
    if (imageUrl.startsWith('data:')) {
      return ImagePreprocessor.preprocessDataUrl(imageUrl, options);
    }

    try {
      // 1. Fetch image binary as Blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const blob = await response.blob();

      // 2. Create untainted ImageBitmap from Blob
      if (typeof createImageBitmap !== 'undefined') {
        const bitmap = await createImageBitmap(blob);
        
        // 3. Draw onto OffscreenCanvas or HTMLCanvasElement
        let data: Uint8ClampedArray | null = null;

        if (typeof OffscreenCanvas !== 'undefined') {
          const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
          const ctx = offscreen.getContext('2d');
          if (ctx) {
            ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
            data = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
          }
        } else if (typeof document !== 'undefined' && document.createElement) {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
            data = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
          }
        }

        // Close bitmap resource memory
        if (typeof bitmap.close === 'function') {
          bitmap.close();
        }

        if (data) {
          let tensorIdx = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // BGR Order + Mean Subtraction
            tensorData[tensorIdx] = b - bMean;
            tensorData[tensorIdx + 1] = g - gMean;
            tensorData[tensorIdx + 2] = r - rMean;

            tensorIdx += 3;
          }
          return tensorData;
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`[ShieldSight Security] Cross-origin fetch failed for image: ${errorMsg}`);
    }

    // Fallback for headless environments without createImageBitmap
    tensorData.fill(0.0);
    return tensorData;
  }

  /**
   * Fallback data URI processor for inline data URIs.
   */
  private static preprocessDataUrl(
    dataUrl: string,
    options: PreprocessOptions
  ): Float32Array {
    const { targetWidth, targetHeight, mean } = options;
    const bMean = mean ? mean[0] : 104.00698793;
    const gMean = mean ? mean[1] : 116.66876762;
    const rMean = mean ? mean[2] : 122.67891434;

    const tensorData = new Float32Array(targetWidth * targetHeight * 3);

    try {
      if (typeof document !== 'undefined' && document.createElement) {
        const img = new Image();
        img.src = dataUrl;
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const data = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
          let tensorIdx = 0;
          for (let i = 0; i < data.length; i += 4) {
            tensorData[tensorIdx] = data[i + 2] - bMean;
            tensorData[tensorIdx + 1] = data[i + 1] - gMean;
            tensorData[tensorIdx + 2] = data[i] - rMean;
            tensorIdx += 3;
          }
        }
      }
    } catch {
      tensorData.fill(0.0);
    }
    return tensorData;
  }
}
