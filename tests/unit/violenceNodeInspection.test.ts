import { describe, it, expect } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('Violence ONNX Model Inspection', () => {
  it('should parse violence.onnx session inputs and outputs', async () => {
    const modelPath = path.resolve('public/models/violence.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    console.log('Violence Model Inputs:', session.inputNames);
    console.log('Violence Model Outputs:', session.outputNames);

    expect(session.inputNames.length).toBeGreaterThan(0);
    expect(session.outputNames.length).toBeGreaterThan(0);
  });
});
