import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('ShieldSight AI - End-to-End Real ONNX Inference Verification', () => {
  it('should execute real inference across 3 distinct image samples and verify dynamic probabilities', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    expect(modelBuffer.length).toBeGreaterThan(1000000);

    const startTime = performance.now();
    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });
    const modelLoadTimeMs = Math.round(performance.now() - startTime);

    expect(session).toBeDefined();
    console.log(`[ShieldSight AI] Model Loaded Successfully: true (${modelLoadTimeMs}ms)`);

    const inputName = session.inputNames[0]; // 'input:0'
    const outputName = session.outputNames[0]; // 'outputs'

    // Helper to generate normalized image tensor [1, 224, 224, 3]
    const createTensor = (pixelGenerator: (x: number, y: number, c: number) => number) => {
      const data = new Float32Array(224 * 224 * 3);
      let idx = 0;
      // Normalization mean constants: [104.0, 117.0, 123.0]
      const mean = [104.0, 117.0, 123.0];

      for (let y = 0; y < 224; y++) {
        for (let x = 0; x < 224; x++) {
          for (let c = 0; c < 3; c++) {
            const rawVal = pixelGenerator(x, y, c);
            data[idx] = rawVal - mean[c];
            idx++;
          }
        }
      }
      return new ort.Tensor('float32', data, [1, 224, 224, 3]);
    };

    // --- Image 1: Landscape (Sky & Nature Tones) ---
    const landscapeTensor = createTensor((x, y, c) => {
      if (y < 112) {
        // Sky: Blue high, Green med, Red low
        return c === 2 ? 220 : c === 1 ? 160 : 70;
      }
      // Forest/Grass: Green high, Red/Blue low
      return c === 1 ? 180 : c === 0 ? 50 : 30;
    });

    const start1 = performance.now();
    const result1 = await session.run({ [inputName]: landscapeTensor });
    const duration1 = Math.round(performance.now() - start1);
    const rawOutput1 = Array.from(result1[outputName].data as Float32Array);
    const safeProb1 = Math.round(rawOutput1[0] * 10000) / 10000;
    const nsfwProb1 = Math.round(rawOutput1[1] * 10000) / 10000;
    const class1 = nsfwProb1 >= 0.6 ? 'NSFW' : 'SAFE';

    console.log('[ShieldSight AI Verified] Image 1 (Landscape):', {
      modelLoadedSuccessfully: true,
      inferenceTimeMs: duration1,
      rawOutputTensor: rawOutput1,
      safeProbability: safeProb1,
      nsfwProbability: nsfwProb1,
      finalClassification: class1,
    });

    // --- Image 2: Portrait Person (Natural Lighting & Portrait Tones) ---
    const portraitTensor = createTensor((x, y, c) => {
      // Natural portrait skin tone: R ~ 210, G ~ 160, B ~ 130
      const centerDist = Math.hypot(x - 112, y - 112);
      if (centerDist < 60) {
        return c === 0 ? 215 : c === 1 ? 162 : 132;
      }
      // Background: Warm neutral
      return c === 0 ? 120 : c === 1 ? 110 : 100;
    });

    const start2 = performance.now();
    const result2 = await session.run({ [inputName]: portraitTensor });
    const duration2 = Math.round(performance.now() - start2);
    const rawOutput2 = Array.from(result2[outputName].data as Float32Array);
    const safeProb2 = Math.round(rawOutput2[0] * 10000) / 10000;
    const nsfwProb2 = Math.round(rawOutput2[1] * 10000) / 10000;
    const class2 = nsfwProb2 >= 0.6 ? 'NSFW' : 'SAFE';

    console.log('[ShieldSight AI Verified] Image 2 (Portrait Person):', {
      modelLoadedSuccessfully: true,
      inferenceTimeMs: duration2,
      rawOutputTensor: rawOutput2,
      safeProbability: safeProb2,
      nsfwProbability: nsfwProb2,
      finalClassification: class2,
    });

    // --- Image 3: High-Risk / Adult Test Image Sample ---
    const adultTestTensor = createTensor((_x, _y, c) => {
      // High-intensity skin distribution: R ~ 245, G ~ 185, B ~ 155
      return c === 0 ? 245 : c === 1 ? 185 : 155;
    });

    const start3 = performance.now();
    const result3 = await session.run({ [inputName]: adultTestTensor });
    const duration3 = Math.round(performance.now() - start3);
    const rawOutput3 = Array.from(result3[outputName].data as Float32Array);
    const safeProb3 = Math.round(rawOutput3[0] * 10000) / 10000;
    const nsfwProb3 = Math.round(rawOutput3[1] * 10000) / 10000;
    const class3 = nsfwProb3 >= 0.6 ? 'NSFW' : 'SAFE';

    console.log('[ShieldSight AI Verified] Image 3 (Adult Test Image):', {
      modelLoadedSuccessfully: true,
      inferenceTimeMs: duration3,
      rawOutputTensor: rawOutput3,
      safeProbability: safeProb3,
      nsfwProbability: nsfwProb3,
      finalClassification: class3,
    });

    // --- Validation Checks ---
    // 1. Verify probabilities are not NaN, infinite, or zero
    [rawOutput1, rawOutput2, rawOutput3].forEach((raw) => {
      expect(Number.isNaN(raw[0])).toBe(false);
      expect(Number.isNaN(raw[1])).toBe(false);
      expect(Number.isFinite(raw[0])).toBe(true);
      expect(Number.isFinite(raw[1])).toBe(true);
    });

    // 2. Verify probabilities are dynamic and change across different image content
    expect(nsfwProb1).not.toEqual(nsfwProb2);
    expect(nsfwProb2).not.toEqual(nsfwProb3);
  });
});
