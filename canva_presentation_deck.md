# SHIELDSIGHT AI — CANVA PRESENTATION SLIDE DECK

---

## 🎨 HOW TO AUTO-GENERATE SLIDES IN CANVA (1-MINUTE GUIDE)

1. Open **[canva.com](https://canva.com)** and search for **"Presentation"** (16:9 widescreen format).
2. Click **"Canva Docs"** or use the **"Magic Write / Docs to Deck"** feature:
   - Click **Create a Doc** $\rightarrow$ Paste the Slide Deck text below $\rightarrow$ Click **Convert** $\rightarrow$ Select **Presentation**.
3. Alternatively, pick any modern dark-mode presentation template (Search: *"Cybersecurity Presentation"* or *"AI Tech Presentation"*) and copy-paste each slide content!

---

# SLIDE DECK CONTENT

---

### SLIDE 1: TITLE SLIDE
**Title:** ShieldSight AI  
**Subtitle:** On-Device Multimodal Artificial Intelligence Content Moderation & Parental Safety System  
**Presenter:** [Your Name / Team Name]  
**Degree & Course:** B.Tech / Computer Science & Engineering Final Project  
**Tech Highlights:** 100% On-Device AI • Chrome Manifest V3 • ONNX Runtime Web • WebAssembly OCR • Next.js 15  

---

### SLIDE 2: THE PROBLEM
**Header:** Why Existing Content Filters Fail  
**Key Points:**
- 🔴 **Privacy Intrusion:** Existing cloud tools send private user browsing history, family photos, and chat logs to remote server APIs.
- 🔴 **High Latency & Slow Speed:** Cloud API requests take 300ms–1000ms over the internet, slowing down browser page load times.
- 🔴 **Bypass Vulnerability:** Traditional URL blocklists fail to moderate dynamic user-generated content on modern SPAs, YouTube, Reddit, and social media.

---

### SLIDE 3: THE SOLUTION — SHIELDSIGHT AI
**Header:** Privacy-Preserving On-Device AI Content Moderation  
**Key Innovations:**
- 🛡️ **100% Client-Side Inference:** Executes deep neural networks directly in browser WebGL/WASM memory with **zero server dependencies**.
- 🛡️ **Zero Telemetry:** Not a single byte of browsing history or personal data leaves the user's computer.
- 🛡️ **Real-Time Dynamic Redaction:** Blurs explicit images and harmful text automatically with interactive safety badges.

---

### SLIDE 4: MULTIMODAL AI ARCHITECTURE
**Header:** Tri-Modal Data Fusion Engine  
**Key Modalities:**
1. 📷 **Computer Vision:** `opennsfw2.onnx` & `violence.onnx` neural models for explicit and violent media classification ($224 \times 224$ tensors).
2. 💬 **Multilingual NLP Engine:** Real-time text moderation covering **English**, **Romanized Hinglish**, and **Devanagari Hindi (`हिंदी`)**.
3. 🔤 **WebAssembly OCR Bridge:** Tesseract.js (WASM) extracts text embedded inside images (e.g. memes & graphic banners) and feeds it to NLP moderation.

---

### SLIDE 5: SYSTEM ARCHITECTURE & DATA FLOW
**Header:** Chrome Manifest V3 Architecture  
**Execution Flow:**
```
[ Web Page DOM ] ──(MutationObserver)──> [ Content Script ]
                                                 │
                                                 ▼
[ Popup Control UI ] ◄──(State Sync)─── [ Offscreen Document Context ]
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        ▼                        ▼                        ▼
               [ NLP Text Engine ]       [ ONNX Vision Models ]     [ WASM OCR Engine ]
                        │                        │                        │
                        └────────────────────────┼────────────────────────┘
                                                 │
                                                 ▼ (Safety Verdict)
                                        [ Dynamic CSS Blur & Redaction ]
```

---

### SLIDE 6: CORE TECHNOLOGY STACK
**Header:** Modern Technical Stack & Frameworks  
- **Browser Extension:** TypeScript 5.7, React 19, Vite 5.4, Chrome Manifest V3  
- **Machine Learning Runtimes:** ONNX Runtime Web (`onnxruntime-web`), Tesseract WebAssembly  
- **Web Platform:** Next.js 15 (App Router), Tailwind CSS 3.4, Vercel Edge Hosting  
- **Testing & CI/CD:** Vitest (99 automated test cases), GitHub Actions Release Workflow  

---

### SLIDE 7: REAL-TIME DEMONSTRATION
**Header:** Live Content Moderation Demo  
- **Text Moderation:** Automatically redacts abusive language, harassment, threats, and toxic Hinglish/Hindi text (`"Tu chutiya hai"`, `"तुम गधे हो"`).
- **Visual Safety:** Real-time hardware-accelerated blurring of explicit and violent media.
- **Master Power Control:** Instant **Turn ON / Turn OFF** toggle switch in extension popup UI.

---

### SLIDE 8: VERIFICATION & EXPERIMENTAL RESULTS
**Header:** Performance Benchmarks & Test Suite  
- 🧪 **Vitest Unit Test Suite:** **32 passed test files / 99 test cases passing in 2.59s**.
- ⚡ **ONNX Vision Model Latency:** **~26 ms** per image using WebGL hardware acceleration.
- ⚡ **Text Moderation Latency:** **~2 ms** per text block.
- ⚡ **Next.js Web Page Speed:** **161 ms** initial load on Vercel.

---

### SLIDE 9: COMMERCIAL WEB PLATFORM & RELEASE PIPELINE
**Header:** Production Web Deployment & Release Automation  
- 🌐 **Web Platform:** Hosted live on Vercel featuring a 6-step interactive Installation Guide (`/install`).
- 📦 **GitHub Release Automation:** `.github/workflows/release.yml` automatically tests, builds `dist/`, and packages versioned ZIP assets (`ShieldSightAI-v1.0.0.zip`).
- 📥 **Smart Download Workflow:** Direct release asset download with automatic beta development build fallback.

---

### SLIDE 10: CONCLUSION & FUTURE SCOPE
**Header:** Summary & Future Expansion  
**Key Takeaways:**
- Proves real-time AI content moderation can run 100% on-device inside standard web browsers with zero privacy risks.  
**Future Scope:**
- 🚀 **WebGPU Acceleration:** Upgrading from WebGL to WebGPU for sub-10ms 4K image classification.
- 🚀 **Cross-Browser Store Publishing:** Submitting to Chrome Web Store and Firefox Add-ons Marketplace.

---

## 💡 RECOMMENDED CANVA TEMPLATES & STYLING TIPS

- **Color Palette:** Deep Navy Background (`#0B1220`), Card Surface (`#0D1322`), Emerald Accent (`#10B981`), Electric Blue (`#2563EB`).
- **Typography:** Inter, Outfit, or Space Grotesk (Bold headings, clean monospace accents).
- **Visual Elements:** Use Shield icons 🛡️, Brain/AI vectors, and code snippet cards for high technical impact!
