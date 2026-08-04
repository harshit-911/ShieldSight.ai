import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('Real ONNX Inference Validation', () => {
  it('should run real inference and return probabilities without throwing', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    const inputName = session.inputNames[0]; // 'input:0'
    const outputName = session.outputNames[0]; // 'outputs'

    // Create 224x224 RGB Float32Array tensor
    const tensorData = new Float32Array(224 * 224 * 3);
    
    // Sample 1: Fill with low values (dark image)
    tensorData.fill(50.0);
    const inputTensor1 = new ort.Tensor('float32', tensorData, [1, 224, 224, 3]);

    const startTime1 = performance.now();
    const output1 = await session.run({ [inputName]: inputTensor1 });
    const duration1 = performance.now() - startTime1;

    const outputData1 = output1[outputName].data as Float32Array;
    console.log('Sample 1 Output Raw Tensor:', outputData1);
    console.log(`Sample 1 Inference Duration: ${Math.round(duration1)}ms`);

    // Sample 2: Fill with high values (bright image)
    const tensorData2 = new Float32Array(224 * 224 * 3);
    tensorData2.fill(220.0);
    const inputTensor2 = new ort.Tensor('float32', tensorData2, [1, 224, 224, 3]);

    const output2 = await session.run({ [inputName]: inputTensor2 });
    const outputData2 = output2[outputName].data as Float32Array;
    console.log('Sample 2 Output Raw Tensor:', outputData2);

    expect(outputData1.length).toBeGreaterThan(0);
    expect(outputData2.length).toBeGreaterThan(0);
  });
});
