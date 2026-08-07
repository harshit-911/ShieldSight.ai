# PROJECT REPORT: SHIELDSIGHT AI

**Project Title:** ShieldSight AI — On-Device Artificial Intelligence Content Moderation & Parental Safety Extension  
**Domain:** Artificial Intelligence, Web Security, Privacy-Preserving Machine Learning, Browser Extensions  
**Technology Stack:** TypeScript, React, Vite, Next.js (App Router), ONNX Runtime Web, Tesseract.js (WASM), Tailwind CSS, Vitest, GitHub Actions  

---

## EXECUTIVE SUMMARY / ABSTRACT

ShieldSight AI is an advanced, privacy-preserving browser extension and commercial web platform engineered to protect families, children, and web users from explicit, violent, toxic, and inappropriate digital content. Unlike traditional content moderation platforms that transmit user browsing data, images, and text to cloud servers—compromising personal privacy—ShieldSight AI executes **100% on-device AI inference**.

Using lightweight **ONNX Runtime Web**, **WebAssembly (WASM)**, and **Tesseract OCR**, ShieldSight AI inspects web page elements, text streams, and visual content locally inside Chrome's isolated Offscreen Document environment. The system dynamically blurs hazardous visual material and redacts toxic text without sending a single byte of telemetry or personal browsing data off the user's machine.

This report documents the architectural design, algorithmic workflows, performance benchmarks, component implementation, and automated deployment pipelines of ShieldSight AI.

---

## 1. INTRODUCTION & MOTIVATION

### 1.1 Background
The proliferation of digital media has exposed children and web users to an unprecedented volume of harmful online content, including violence, explicit media, and severe online harassment. Existing parental control tools rely heavily on centralized web filters or cloud APIs.

### 1.2 Limitations of Existing Solutions
- **Privacy Intrusion:** Cloud API services require sending full webpage DOM text, user chat logs, and private images to remote third-party servers.
- **Latency & Overhead:** High network latency from API calls degrades page load performance.
- **Bypass Vulnerability:** Simple domain blocklists fail to analyze dynamic, user-generated content on modern single-page applications (SPAs) and social platforms.

### 1.3 ShieldSight AI Vision
ShieldSight AI solves these challenges by embedding neural network models (`opennsfw2.onnx`, `violence.onnx`) directly within the browser engine via Chrome Manifest V3. By utilizing client-side WebGL/WASM acceleration, content moderation occurs locally in real time.

---

## 2. SYSTEM REQUIREMENTS

### 2.1 Software Requirements
| Component | Specification |
| :--- | :--- |
| **Operating System** | macOS 12+, Windows 10/11, Linux (Ubuntu 20.04+) |
| **Browser Runtime** | Google Chrome v116+, Brave, Microsoft Edge, or any Chromium Manifest V3 browser |
| **Development Engine** | Node.js v18.x+, npm v9.x+ |
| **Frameworks** | React 19, Next.js 15 (App Router), Vite 5.4, Tailwind CSS 3.4 |
| **AI / ML Runtime** | ONNX Runtime Web (`onnxruntime-web`), Tesseract.js WASM |

### 2.2 Hardware Requirements
| Parameter | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Processor** | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ (Apple Silicon or Intel i5+) |
| **RAM** | 4 GB | 8 GB or higher |
| **Graphics Acceleration** | WebGL 2.0 compatible GPU | Integrated or Dedicated GPU with WebGL 2.0 |
| **Storage** | 150 MB free disk space | 500 MB free disk space |

---

## 3. SYSTEM ARCHITECTURE & MODULE DESIGN

ShieldSight AI follows a decoupled, asynchronous multi-tier architecture compliant with Chrome Extension Manifest V3 regulations.

```
+-------------------------------------------------------------------+
|                        Web Page DOM Context                       |
|  - Dynamic MutationObserver                                      |
|  - DOM Element Discovery Engine                                  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                Chrome Extension Messaging Bridge                  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Offscreen Document Context                    |
|  +-----------------------+  +----------------------------------+  |
|  |  ONNX Vision Engine   |  |  WebAssembly Tesseract OCR Engine |  |
|  | (OpenNSFW2 + Violence)|  |   (Image Embedded Text Extraction)|  |
|  +-----------------------+  +----------------------------------+  |
|  +-------------------------------------------------------------+  |
|  |             Regex & ONNX Text Moderation Pipeline            |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Visual & Redaction Output                     |
|  - CSS Backdrop Blur Filters                                      |
|  - Minimalist Interactive Safety Warning Badges                   |
+-------------------------------------------------------------------+
```

### 3.1 Core Modules

1. **Content Script (`src/content.ts`):**
   - Continuously monitors DOM changes using `MutationObserver`.
   - Discovers text blocks, images, and chat streams without blocking UI rendering.
   - Applies CSS dynamic blur filters (`backdrop-filter: blur(20px)`) and inline safety badges over flagged elements.

2. **Offscreen Document Processor (`src/offscreen/`):**
   - Operates in a dedicated offscreen DOM context to perform CPU/GPU heavy machine learning tasks without freezing browser user tabs.
   - Hosts ONNX Runtime Web sessions for image classification and Tesseract WebAssembly for OCR text extraction.

3. **Text Protection Engine (`src/services/protection/textProtectionUtils.ts`):**
   - Evaluates text blocks against pattern-matching filters and lightweight sentiment/toxicity logits.
   - Instantiates interactive safety warnings allowing users to temporarily reveal content if desired.

4. **Visual Safety & ONNX Inference Engine (`src/services/ai/`):**
   - Normalizes input image elements to standard $224 \times 224$ tensor representations.
   - Runs dual ONNX inference:
     - `opennsfw2.onnx`: Evaluates probability of explicit visual content.
     - `violence.onnx`: Evaluates probability of graphic or violent media.

5. **React Extension Popup UI (`src/popup/Popup.tsx`):**
   - Ultra-minimalist dashboard styled with dark-mode aesthetic (`#0B1220` background).
   - Displays real-time statistics: Items Scanned, Threat Items Blocked, Protection Mode status.

6. **Next.js Commercial Web Platform (`website/`):**
   - Modern Next.js 15 App Router platform hosted on Vercel.
   - Features a 6-step visual Installation Guide (`/install`), smart download button (`DownloadButton.tsx`), and automated version detection.

---

## 4. IMPLEMENTATION DETAILS

### 4.1 On-Device Neural Network Inference
ShieldSight AI initializes neural networks directly in client WebAssembly memory:

```typescript
// Initializing ONNX Inference Session inside Offscreen Context
import * as ort from 'onnxruntime-web';

export async function initVisionModels() {
  const nsfwSession = await ort.InferenceSession.create('/models/opennsfw2.onnx', {
    executionProviders: ['webgl', 'wasm'],
  });
  const violenceSession = await ort.InferenceSession.create('/models/violence.onnx', {
    executionProviders: ['webgl', 'wasm'],
  });
  return { nsfwSession, violenceSession };
}
```

### 4.2 WebAssembly OCR Pipeline
Images containing embedded text (e.g. meme images, graphic screenshots) are routed to WebAssembly Tesseract OCR:

```typescript
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageBuffer: ArrayBuffer): Promise<string> {
  const worker = await createWorker('eng', 1, {
    workerPath: '/lib/tesseract/worker.min.js',
    corePath: '/lib/tesseract/tesseract-core.wasm.js',
  });
  const { data: { text } } = await worker.recognize(imageBuffer);
  await worker.terminate();
  return text;
}
```

---

## 5. AUTOMATED CI/CD & RELEASE PIPELINE

ShieldSight AI implements an automated production release workflow via GitHub Actions (`.github/workflows/release.yml`).

### 5.1 Release Automation Workflow
- **Trigger:** Automatic upon pushing Git tags matching `v*` (e.g., `v1.0.0`).
- **Steps:**
  1. Checkout code repository.
  2. Execute unit test suite (`npm test`).
  3. Compile extension bundle (`npm run build`).
  4. Package `dist/` directory into `ShieldSightAI-v<version>.zip`.
  5. Publish GitHub Release with release notes and asset attachment.

---

## 6. VERIFICATION & EXPERIMENTAL RESULTS

### 6.1 Automated Unit & Integration Testing
The project incorporates comprehensive Vitest automated unit tests:

| Metric | Result |
| :--- | :--- |
| **Total Test Files** | **32 passed (32)** |
| **Total Test Cases** | **99 passed (99)** |
| **Code Coverage** | Text Discovery, Language Detection, ONNX Inference, Messaging |
| **Execution Duration** | 2.90 seconds |

### 6.2 Latency & Performance Benchmarks

| Operation | Environment | Average Latency |
| :--- | :--- | :--- |
| **Text Moderation Evaluation** | Offscreen DOM Context | **~2 ms** |
| **Real ONNX Vision Inference (`opennsfw2.onnx`)** | WebGL Hardware Accelerated | **~26 ms** |
| **WASM Tesseract OCR Extraction** | WebAssembly Thread | **~180 ms** |
| **Next.js Web Page Load (`/install`)** | Vercel Edge Server | **~161 ms** |

---

## 7. PRIVACY & SECURITY GUARANTEES

1. **Zero External API Dependencies:** All neural model weights (`.onnx`) and language files (`.traineddata`) are bundled locally in the extension package.
2. **Manifest V3 Isolation:** Background processing takes place in restricted sandboxes without cross-origin permissions.
3. **Zero Telemetry Collection:** ShieldSight AI does not log, store, or transmit browsing history or user chat logs.

---

## 8. CONCLUSION & FUTURE SCOPE

ShieldSight AI successfully demonstrates that real-time AI content moderation can be executed **100% on-device inside standard web browsers**, achieving latency benchmark targets while preserving absolute user privacy.

### 8.1 Future Scope
- **WebGPU Acceleration:** Transitioning ONNX Runtime Web execution provider from WebGL to WebGPU for sub-10ms 4K image classification.
- **Custom Fine-Tuned NLP Transformers:** Integrating Transformers.js (`xenova/transformers`) for contextual sentiment analysis.
- **Cross-Browser Store Publishing:** Submitting ShieldSight AI to the Chrome Web Store and Firefox Add-ons Marketplace.

---

## REFERENCES

1. Google Chrome Extensions Documentation, *Manifest V3 Architecture Guide*, 2026.
2. ONNX Runtime Web Documentation, *WebAssembly and WebGL Execution Providers*, Microsoft, 2025.
3. Tesseract.js, *Pure Javascript & WASM OCR Engine*, Open Source, 2025.
4. Next.js App Router Documentation, *Static Site Generation & Vercel Deployment*, Vercel, 2026.

---
*Report Generated for Academic & Technical Evaluation — ShieldSight AI v1.0.0*
