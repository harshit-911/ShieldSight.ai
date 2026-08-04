import { describe, it } from 'vitest';
import * as ort from 'onnxruntime-web';
import fs from 'fs';
import path from 'path';

describe('Deep ONNX Preprocessing & Class Mapping Audit', () => {
  it('should test NCHW vs NHWC, BGR vs RGB, and print model input/output statistics', async () => {
    const modelPath = path.resolve('public/models/opennsfw2.onnx');
    const modelBuffer = fs.readFileSync(modelPath);

    const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
      executionProviders: ['wasm'],
    });

    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    console.log('=== ONNX SESSION INFO ===');
    console.log('Input Name:', inputName);
    console.log('Output Name:', outputName);

    // Test 1: Layout Check (NHWC [1, 224, 224, 3] vs NCHW [1, 3, 224, 224])
    const nhwcDummy = new Float32Array(1 * 224 * 224 * 3).fill(100.0);
    const nchwDummy = new Float32Array(1 * 3 * 224 * 224).fill(100.0);

    let nhwcValid = false;
    let nchwValid = false;

    try {
      await session.run({ [inputName]: new ort.Tensor('float32', nhwcDummy, [1, 224, 224, 3]) });
      nhwcValid = true;
    } catch {
      nhwcValid = false;
    }

    try {
      await session.run({ [inputName]: new ort.Tensor('float32', nchwDummy, [1, 3, 224, 224]) });
      nchwValid = true;
    } catch {
      nchwValid = false;
    }

    console.log(`Layout Support -> NHWC [1,224,224,3]: ${nhwcValid} | NCHW [1,3,224,224]: ${nchwValid}`);

    // Helper to evaluate tensor
    async function evalImage(
      rVal: number,
      gVal: number,
      bVal: number,
      isBgr: boolean,
      isNormalized01: boolean
    ) {
      const data = new Float32Array(224 * 224 * 3);
      const bgrMean = [104.00698793, 116.66876762, 122.67891434];
      let idx = 0;

      for (let i = 0; i < 224 * 224; i++) {
        let r = rVal;
        let g = gVal;
        let b = bVal;

        if (isNormalized01) {
          r = r / 255.0;
          g = g / 255.0;
          b = b / 255.0;
          if (isBgr) {
            data[idx] = b;
            data[idx + 1] = g;
            data[idx + 2] = r;
          } else {
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
        } else {
          if (isBgr) {
            data[idx] = b - bgrMean[0];
            data[idx + 1] = g - bgrMean[1];
            data[idx + 2] = r - bgrMean[2];
          } else {
            data[idx] = r - bgrMean[2];
            data[idx + 1] = g - bgrMean[1];
            data[idx + 2] = b - bgrMean[0];
          }
        }
        idx += 3;
      }

      const inputTensor = new ort.Tensor('float32', data, [1, 224, 224, 3]);
      const res = await session.run({ [inputName]: inputTensor });
      return Array.from(res[outputName].data as Float32Array);
    }

    console.log('\n--- EVALUATING BGR MEAN-SUBTRACTED PREPROCESSING (YAHOO CAFFE SPEC) ---');
    console.log('White Image (255,255,255):', await evalImage(255, 255, 255, true, false));
    console.log('Black Image (0,0,0):      ', await evalImage(0, 0, 0, true, false));
    console.log('Landscape (Sky/Green):    ', await evalImage(70, 160, 220, true, false));
    console.log('Skin Tone (240, 175, 140):', await evalImage(240, 175, 140, true, false));

    console.log('\n--- EVALUATING RGB NORMALIZED [0,1] PREPROCESSING ---');
    console.log('White Image (255,255,255):', await evalImage(255, 255, 255, false, true));
    console.log('Black Image (0,0,0):      ', await evalImage(0, 0, 0, false, true));
    console.log('Landscape (Sky/Green):    ', await evalImage(70, 160, 220, false, true));
    console.log('Skin Tone (240, 175, 140):', await evalImage(240, 175, 140, false, true));
  });
});
