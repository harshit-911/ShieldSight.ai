import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';
import { ImagePreprocessor } from '../../src/services/ai/ImagePreprocessor';

describe('ShieldSight AI - Full Preprocessing & Inference Audit', () => {
  it('should run real inference on 6 image categories and print complete tensor stats & probabilities', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    const inputName = session.inputNames[0]; // 'input:0'
    const outputName = session.outputNames[0]; // 'outputs'

    console.log('\n=================== 1. MODEL INPUT SPECIFICATIONS ===================');
    console.log('Input Tensor Name:', inputName);
    console.log('Input Tensor Layout: NHWC [1, 224, 224, 3] (Height x Width x Channels)');
    console.log('Color Channel Order: BGR (Blue, Green, Red)');
    console.log('Mean Subtraction Constants: BGR [104.007, 116.669, 122.679]');
    console.log('Output Tensor Name:', outputName);
    console.log('Output Tensor Index Mapping: Index 0 = SFW (Safe) | Index 1 = NSFW');
    console.log('======================================================================\n');

    // Helper to construct BGR Float32Array tensor
    function buildBgrTensor(pixelGenerator: (x: number, y: number) => [number, number, number]): Float32Array {
      const data = new Float32Array(224 * 224 * 3);
      const bgrMean = [104.00698793, 116.66876762, 122.67891434];
      let idx = 0;

      for (let y = 0; y < 224; y++) {
        for (let x = 0; x < 224; x++) {
          const [r, g, b] = pixelGenerator(x, y);
          data[idx] = b - bgrMean[0];     // B
          data[idx + 1] = g - bgrMean[1]; // G
          data[idx + 2] = r - bgrMean[2]; // R
          idx += 3;
        }
      }
      return data;
    }

    async function evaluateImage(name: string, pixelGen: (x: number, y: number) => [number, number, number]) {
      const tensorData = buildBgrTensor(pixelGen);

      // Inspect first 20 tensor values, min, max, avg
      let minVal = Infinity;
      let maxVal = -Infinity;
      let sumVal = 0;
      for (let i = 0; i < tensorData.length; i++) {
        const v = tensorData[i];
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
        sumVal += v;
      }
      const avgVal = sumVal / tensorData.length;
      const first20 = Array.from(tensorData.slice(0, 20));

      const inputTensor = new ort.Tensor('float32', tensorData, [1, 224, 224, 3]);
      const startTime = performance.now();
      const outputMap = await session.run({ [inputName]: inputTensor });
      const inferenceTimeMs = Math.round(performance.now() - startTime);

      const rawOutputs = Array.from(outputMap[outputName].data as Float32Array);
      const sfwProb = rawOutputs[0];
      const nsfwProb = rawOutputs[1];
      const label = nsfwProb >= 0.5 ? 'NSFW' : 'SAFE';

      console.log(`\n--- Audit Evaluation: ${name} ---`);
      console.log('First 20 Tensor Values:', first20);
      console.log(`Tensor Stats -> Min: ${minVal.toFixed(2)}, Max: ${maxVal.toFixed(2)}, Avg: ${avgVal.toFixed(2)}`);
      console.log(`Inference Time: ${inferenceTimeMs}ms`);
      console.log(`Complete Raw Output Vector: [${rawOutputs[0].toFixed(6)}, ${rawOutputs[1].toFixed(6)}]`);
      console.log(`Parsed Probabilities -> Safe (Index 0): ${(sfwProb * 100).toFixed(2)}% | NSFW (Index 1): ${(nsfwProb * 100).toFixed(2)}%`);
      console.log(`Final Classification Label: ${label}`);

      return { sfwProb, nsfwProb, label, rawOutputs };
    }

    // 1. Blank White Image (255, 255, 255)
    const whiteRes = await evaluateImage('Blank White Image', () => [255, 255, 255]);

    // 2. Blank Black Image (0, 0, 0)
    const blackRes = await evaluateImage('Blank Black Image', () => [0, 0, 0]);

    // 3. Landscape Image (Sky & Nature Tones)
    const landscapeRes = await evaluateImage('Landscape Image', (_x, y) => {
      if (y < 112) return [70, 160, 220]; // Sky
      return [40, 180, 50]; // Forest
    });

    // 4. Portrait Image (Clothed Face & Background)
    const portraitRes = await evaluateImage('Portrait Image', (x, y) => {
      const dist = Math.hypot(x - 112, y - 100);
      if (dist < 45) return [215, 165, 135]; // Face
      if (y > 140) return [30, 40, 90]; // Clothing (Navy Blue)
      return [180, 190, 200]; // Neutral Background
    });

    // 5. Bikini Image Sample (High Skin Exposure + Swimsuit Boundaries)
    const bikiniRes = await evaluateImage('Bikini Image Sample', (x, y) => {
      // Swimsuit bounds
      if (y > 160 && y < 190 && Math.abs(x - 112) < 40) return [220, 20, 60]; // Crimson Swimwear
      if (y > 70 && y < 110 && Math.abs(x - 112) < 55) return [220, 20, 60]; // Top
      // Torso/Legs skin tone
      if (y > 40 && y < 210) return [235, 175, 140];
      return [120, 150, 180]; // Background
    });

    // 6. Explicit Adult Test Image Sample (High-intensity unconstrained explicit skin distribution)
    const explicitRes = await evaluateImage('Explicit Adult Test Image Sample', (_x, y) => {
      if (y > 20 && y < 210) return [245, 180, 145]; // Explicit skin area
      return [200, 140, 110];
    });

    // --- Validation Checks ---
    // Ensure all output probabilities are finite and non-NaN
    [whiteRes, blackRes, landscapeRes, portraitRes, bikiniRes, explicitRes].forEach((r) => {
      expect(Number.isNaN(r.sfwProb)).toBe(false);
      expect(Number.isNaN(r.nsfwProb)).toBe(false);
      expect(Number.isFinite(r.sfwProb)).toBe(true);
      expect(Number.isFinite(r.nsfwProb)).toBe(true);
    });

    // Verify non-constant probabilities
    expect(landscapeRes.nsfwProb).not.toEqual(bikiniRes.nsfwProb);
    expect(portraitRes.nsfwProb).not.toEqual(explicitRes.nsfwProb);
  });
});
