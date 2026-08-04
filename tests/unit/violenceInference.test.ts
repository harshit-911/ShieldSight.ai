import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('Violence ONNX Model Real Inference Verification', () => {
  it('should run real inference on violence.onnx and return logits', async () => {
    const modelPath = path.resolve('public/models/violence.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    const inputName = session.inputNames[0]; // 'data_0'
    const outputName = session.outputNames[0]; // 'softmaxout_1'

    // Create 224x224 NCHW [1, 3, 224, 224] Float32Array tensor
    const tensorData = new Float32Array(1 * 3 * 224 * 224).fill(0.5);
    const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);

    const startTime = performance.now();
    const outputMap = await session.run({ [inputName]: inputTensor });
    const duration = Math.round(performance.now() - startTime);

    const rawOutputs = Array.from(outputMap[outputName].data as Float32Array);

    console.log(`[ShieldSight Violence Model] Real Inference Duration: ${duration}ms`);
    console.log(`[ShieldSight Violence Model] Raw Output Tensor Length: ${rawOutputs.length}`);
    console.log(`[ShieldSight Violence Model] Top 5 Logits:`, rawOutputs.slice(0, 5));

    expect(rawOutputs.length).toBeGreaterThan(0);
    expect(Number.isNaN(rawOutputs[0])).toBe(false);
  });
});
