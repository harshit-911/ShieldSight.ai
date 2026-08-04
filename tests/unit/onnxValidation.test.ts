import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('ONNX Model Validation', () => {
  it('should parse real OpenNSFW2 ONNX binary without protobuf errors', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    expect(modelBuffer.length).toBeGreaterThan(1000000); // Should be ~22 MB

    // Create session directly from Uint8Array
    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    console.log('ONNX Model Inputs:', session.inputNames);
    console.log('ONNX Model Outputs:', session.outputNames);

    expect(session.inputNames.length).toBeGreaterThan(0);
    expect(session.outputNames.length).toBeGreaterThan(0);
  });
});
