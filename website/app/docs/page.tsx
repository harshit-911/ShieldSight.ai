import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BookOpen, Download, Terminal, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Documentation & Installation — ShieldSight AI',
  description: 'Installation Guide and Documentation for ShieldSight AI Extension.',
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation & Guide</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
          Installation Guide & Documentation
        </h1>
        <p className="text-sm text-slate-400 mb-12">
          Step-by-step instructions for loading ShieldSight AI into Chromium browsers.
        </p>

        <div id="installation" className="space-y-8 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              Developer Unpacked Installation Steps
            </h2>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-200 mb-1">Download Extension Zip or Clone Repository</div>
                  <p className="text-xs text-slate-400">
                    Download the latest built extension package from GitHub Releases or build locally using `npm run build`.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-200 mb-1">Open Chrome Extensions Page</div>
                  <p className="text-xs text-slate-400">
                    Navigate to <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 font-mono text-xs">chrome://extensions</code> in your browser address bar.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-200 mb-1">Enable Developer Mode & Load Unpacked</div>
                  <p className="text-xs text-slate-400">
                    Toggle <strong className="text-slate-200">Developer Mode</strong> in the top-right corner, click <strong className="text-slate-200">Load Unpacked</strong>, and select the <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 font-mono text-xs">dist</code> build directory.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-500" />
              Building From Source
            </h2>
            <div className="p-4 rounded-xl bg-[#0B1220] border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-slate-500"># Clone repository</div>
              <div>git clone https://github.com/harshit-911/ShieldSight.ai.git</div>
              <div className="text-slate-500 pt-2"># Install dependencies & run tests</div>
              <div>npm install && npm test</div>
              <div className="text-slate-500 pt-2"># Build production distribution package</div>
              <div>npm run build</div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
