# 🛡️ ShieldSight AI

> Safer Browsing for Every Family. Local, real-time safety moderation directly in the browser.

ShieldSight AI is a privacy-first, local-only Chrome extension designed to protect families and kids from harmful content online. By executing state-of-the-art machine learning models directly inside the browser sandbox, ShieldSight scans, classifies, and obscures harmful elements in real time without sending user data to external servers.

---

## 🚀 Key Features

* **Adult Content & Graphic Violence Filtering**: Integrates OpenNSFW2 and custom safety models to obscure explicit images with dynamic, high-density pre-blurs.
* **Optical Character Recognition (OCR)**: Uses local Tesseract.js WASM workers to extract text embedded inside images, routing it to toxicity filters.
* **Harmful Language Moderation**: Scans web texts and paragraph blocks for harassment, threats, hate speech, and abusive language.
* **Real-time Conversation Protection**: Intercepts chat feeds on messaging platforms (WhatsApp Web, Discord, Facebook, etc.) to obscure abusive or grooming messages before they are read.
* **Full-Screen Safety Warnings**: Displays a Windows Security-inspired warning interstitial when visiting domains containing high threat scores.
* **Parent-Friendly Controls**: Simplifies safety configuration into Standard, Child Safe, and Maximum settings, hiding developer complexity behind an Advanced Policies drawer.

---

## 🏗️ Architecture

```
                 Web Element / DOM Node Discovered
                                ↓
                 Immediate Temporary Pre-Blur (FOUC)
                                ↓
        Prioritized viewport queueing (IntersectionObserver)
                                ↓
                  AI Pipelines & Local Classifier
       (OpenNSFW2 ONNX, SqueezeNet, Toxicity Transformer, Tesseract OCR)
                                ↓
                 Risk Assessment Decision Engine
             (Computes threat score: SAFE to CRITICAL)
                                ↓
                 Secure DOM Protection Overlay Card
                (Diagnostics under "Learn More")
```

---

## 🛠️ Tech Stack & Modularity

- **Core**: TypeScript, HTML, CSS (TailwindCSS for popup).
- **Extension Framework**: Vite + Manifest V3.
- **Inference Runtimes**: ONNX Runtime Web (`onnxruntime-web`), Tesseract.js (WASM).
- **Testing Engine**: Vitest (84 core unit and integration tests passing).

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- NPM

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```
This compiles assets into the `dist/` directory.

### 3. Load in Google Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked** (top left).
4. Select the build output directory (`dist/`) of this repository.

---

## 🧪 Testing

ShieldSight includes a comprehensive Vitest suite covering the Decision Engine, OCR workers, content queues, and MutationObserver streams.

Run all tests:
```bash
npm test
```

Verify Type Safety:
```bash
npx tsc --noEmit
```

---

## 🔒 Privacy & Safety Compliance
- **100% Client-Side**: No telemetry or page texts leave the machine.
- **No Unsafe InnerHTML**: Exclusively builds safe nodes (`document.createElement`) to guarantee full XSS immunity.
- **Minimal Permissions**: Utilizes only `storage` and `activeTab` to operate.
