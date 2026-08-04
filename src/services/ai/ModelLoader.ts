/**
 * ShieldSight AI - Model Loader
 * Handles initialization, loading, and caching of ONNX Runtime Web model sessions.
 * Guarantees that local model weights are loaded exactly once as binary data.
 */

import * as ort from 'onnxruntime-web';

export class ModelLoader {
  private session: ort.InferenceSession | null = null;
  private loadPromise: Promise<ort.InferenceSession> | null = null;
  private modelUrl: string;
  private loadTimeMs: number = 0;

  constructor(modelUrl?: string) {
    this.modelUrl = modelUrl || this.getDefaultModelUrl();
  }

  private getDefaultModelUrl(): string {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL('models/opennsfw2.onnx');
    }
    return '/models/opennsfw2.onnx';
  }

  /**
   * Loads and caches the ONNX InferenceSession from binary model data.
   * Throws an explicit Error if the model fails to load.
   */
  async loadModel(): Promise<ort.InferenceSession> {
    if (this.session) {
      return this.session;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.initSession();
    return this.loadPromise;
  }

  private async initSession(): Promise<ort.InferenceSession> {
    const startTime = performance.now();
    console.log(`[ShieldSight ModelLoader] Loading binary ONNX model session from: ${this.modelUrl}`);

    try {
      let modelData: Uint8Array;

      // In browser/extension environment, fetch binary model buffer directly
      if (typeof fetch !== 'undefined') {
        const response = await fetch(this.modelUrl);
        if (!response.ok) {
          throw new Error(`HTTP fetch failed with status ${response.status}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        modelData = new Uint8Array(arrayBuffer);
      } else {
        throw new Error('Global fetch API is unavailable in current environment');
      }

      // Check for HTML text response fallback (begins with '<' / 0x3C)
      if (modelData.length > 0 && modelData[0] === 0x3c) {
        const htmlSnippet = new TextDecoder().decode(modelData.slice(0, 100));
        throw new Error(
          `URL returned an HTML document instead of an ONNX binary file (received: "${htmlSnippet.trim()}..."). Verify file path and extension permissions.`
        );
      }

      // Verify binary buffer is non-empty and valid
      if (modelData.byteLength < 1000) {
        throw new Error(`Invalid ONNX model binary (size: ${modelData.byteLength} bytes). Expected > 1MB.`);
      }

      const options: ort.InferenceSession.SessionOptions = {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      };

      // Initialize ONNX Runtime session directly from binary Uint8Array
      this.session = await ort.InferenceSession.create(modelData, options);
      this.loadTimeMs = Math.round(performance.now() - startTime);

      console.log(
        `%c[ShieldSight Model Loader]%c Model initialized successfully in ${this.loadTimeMs}ms (${(modelData.byteLength / (1024 * 1024)).toFixed(2)} MB)`,
        'color: #10b981; font-weight: bold;',
        'color: #f8fafc; font-weight: bold;',
        {
          modelUrl: this.modelUrl,
          sizeBytes: modelData.byteLength,
          loadTimeMs: this.loadTimeMs,
          runtime: 'onnxruntime-web (WASM)',
          inputNames: this.session.inputNames,
          outputNames: this.session.outputNames,
        }
      );

      return this.session;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[ShieldSight ModelLoader ERROR] Failed to load ONNX model session: ${errorMsg}`);
      this.loadPromise = null;
      throw new Error(`[ShieldSight AI Error] Failed to load ONNX model: ${errorMsg}. Classification halted.`);
    }
  }

  /**
   * Returns model session load duration in milliseconds.
   */
  getLoadTimeMs(): number {
    return this.loadTimeMs;
  }

  /**
   * Returns true if model session is currently loaded and ready for inference.
   */
  isLoaded(): boolean {
    return this.session !== null;
  }
}

export const modelLoader = new ModelLoader();
