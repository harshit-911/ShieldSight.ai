import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Lock, ShieldCheck, HardDrive } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — ShieldSight AI',
  description: 'ShieldSight AI Privacy Policy — 100% On-Device AI Content Moderation Architecture.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Data Collection Policy</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-12">
          Effective Date: August 5, 2026 • Version 1.0
        </p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              1. Our Privacy Commitment
            </h2>
            <p>
              ShieldSight AI was designed from the ground up to protect users without violating their fundamental right to privacy. Unlike traditional web monitoring tools that transmit your browsing data or screenshot frames to remote servers, ShieldSight AI executes all machine learning models locally inside your browser environment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-500" />
              2. 100% On-Device Processing
            </h2>
            <p>
              When ShieldSight AI scans images, text blocks, or chat messages:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>No image data or text content is ever uploaded to cloud servers.</li>
              <li>No browsing history, URLs, or search queries are recorded or logged.</li>
              <li>No remote telemetry, analytics tracking, or fingerprinting scripts are embedded.</li>
              <li>All neural network inference (ONNX WebAssembly) and OCR text extractions (Tesseract WASM) run entirely offline inside your browser runtime.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" />
              3. Local Settings Storage
            </h2>
            <p>
              Your protection preferences (sensitivity thresholds, enabled categories, custom blacklist entries) are saved strictly in your browser’s local storage API (`chrome.storage.local`). They remain on your device and are never shared with third parties.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
