import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadButton } from '../../components/DownloadButton';
import { Download, FolderArchive, Monitor, ToggleRight, FolderOpen, CheckCircle2, AlertTriangle, Github, HelpCircle, FileCode, Check, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Installation Guide — ShieldSight AI',
  description: 'Step-by-step instructions for installing ShieldSight AI extension in Google Chrome, Edge, Brave, and Chromium browsers.',
};

export default function InstallPage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Download Extension ZIP',
      icon: Download,
      description: 'Download the pre-built release package or repository ZIP.',
      detail: 'Click Download to receive ShieldSightAI-v1.0.0.zip.',
    },
    {
      step: 'Step 2',
      title: 'Extract the ZIP File',
      icon: FolderArchive,
      description: 'Unpack the downloaded ZIP archive on your computer.',
      detail: 'Windows: Right-click ZIP -> Extract All... | Mac: Double-click ZIP.',
    },
    {
      step: 'Step 3',
      title: 'Open chrome://extensions',
      icon: Monitor,
      description: 'Open Chrome Extension Management in your browser.',
      detail: 'Type chrome://extensions in your Chrome, Edge, or Brave address bar and press Enter.',
    },
    {
      step: 'Step 4',
      title: 'Enable Developer Mode',
      icon: ToggleRight,
      description: 'Toggle Developer Mode switch in top-right corner.',
      detail: 'Enables the "Load Unpacked" button required for custom extensions.',
    },
    {
      step: 'Step 5',
      title: 'Click "Load Unpacked"',
      icon: FolderOpen,
      description: 'Click the top-left "Load Unpacked" button.',
      detail: 'A system file picker window will open asking you to select a directory.',
    },
    {
      step: 'Step 6',
      title: 'Select Folder with manifest.json',
      icon: CheckCircle2,
      description: 'Open the extracted folder until you see manifest.json directly.',
      detail: 'Select the folder that contains manifest.json directly inside it and click Select Folder.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 text-xs font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Version 1.0.0 Beta</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight mb-4">
            Installation Guide
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Follow these 6 simple steps to install ShieldSight AI in Google Chrome, Brave, Edge, or any Chromium browser.
          </p>

          <div className="flex justify-center">
            <DownloadButton variant="primary" showSubtext />
          </div>
        </div>

        {/* WINDOWS SPECIFIC TROUBLESHOOTING CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-amber-950/20 border border-amber-500/40 mb-12 text-left space-y-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Windows Error: "Manifest file is missing or unreadable"?
              </div>
              <div className="text-xs text-slate-300">
                If Chrome shows a manifest error on Windows, check these 3 common mistakes:
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-sans text-xs">
            <div className="p-4 rounded-xl bg-[#0B1220] border border-amber-900/30 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                1. Didn't Extract ZIP
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                You cannot load a <code className="text-slate-200">.zip</code> file directly. You must <strong>Right-click -&gt; Extract All...</strong> first!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1220] border border-amber-900/30 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                2. Selected Outer Wrapper
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Windows often creates a double folder (e.g. <code className="text-slate-200">ShieldSightAI/ShieldSightAI</code>). Open the folder until <code className="text-emerald-300 font-bold">manifest.json</code> is visible!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1220] border border-amber-900/30 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                3. Source Code ZIPs
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                If you downloaded source code (<code className="text-slate-200">ShieldSight.ai-main.zip</code>), select the <code className="text-emerald-300 font-bold font-mono">public/</code> folder inside it!
              </p>
            </div>
          </div>
        </div>

        {/* 6-Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3 relative overflow-hidden text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {item.description}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* FOLDER SELECTION STRUCTURE DIAGRAM */}
        <div className="p-8 rounded-2xl bg-[#0D1322] border border-slate-800/80 mb-16 text-left space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Exact Folder Structure Diagram
              </h2>
              <p className="text-xs text-slate-400">
                Make sure you open the folder until <code className="text-emerald-400 font-mono font-bold">manifest.json</code> is located directly inside it:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pre-built Release ZIP Structure */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Option A: Pre-built Extension ZIP (Recommended)
              </div>
              <div className="p-5 rounded-xl bg-[#0B1220] border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-emerald-400 font-bold">📁 ShieldSightAI-v1.0.0/  <span className="text-emerald-400 font-sans font-semibold">← SELECT THIS FOLDER!</span></div>
                <div className="pl-4 text-emerald-300 font-bold">├── 📄 manifest.json  <span className="text-emerald-400 font-sans font-bold">← Located directly inside</span></div>
                <div className="pl-4 text-slate-400">├── 📄 background.js</div>
                <div className="pl-4 text-slate-400">├── 📄 content.js</div>
                <div className="pl-4 text-slate-400">├── 📄 offscreen.js</div>
                <div className="pl-4 text-slate-400">├── 📁 assets/</div>
                <div className="pl-4 text-slate-400">└── 📁 models/</div>
              </div>
            </div>

            {/* Source Code ZIP Structure */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Option B: Source Code ZIP (Developer)
              </div>
              <div className="p-5 rounded-xl bg-[#0B1220] border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-400 font-bold">📁 ShieldSight.ai-main/</div>
                <div className="pl-4 text-emerald-400 font-bold">└── 📁 public/  <span className="text-emerald-400 font-sans font-semibold">← SELECT THIS FOLDER!</span></div>
                <div className="pl-8 text-emerald-300 font-bold">├── 📄 manifest.json  <span className="text-emerald-400 font-sans font-bold">← Located inside public/</span></div>
                <div className="pl-8 text-slate-400">├── 📄 offscreen.html</div>
                <div className="pl-8 text-slate-400">├── 📁 icons/</div>
                <div className="pl-8 text-slate-400">└── 📁 models/</div>
              </div>
            </div>
          </div>

          {/* Golden Rule Summary */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300 leading-relaxed flex items-start gap-3">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Golden Rule:</strong> In Chrome's <em>Load Unpacked</em> window, open the folder until you see <strong className="text-emerald-300 font-mono">manifest.json</strong> inside the file view, then click <strong>Select Folder</strong>!
            </div>
          </div>
        </div>

        {/* Troubleshooting & Support */}
        <div className="p-8 rounded-2xl bg-[#0D1322] border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Need Help or Still Having Trouble?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              If you still receive a manifest error or need installation assistance, report an issue on GitHub.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/harshit-911/ShieldSight.ai/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Report an Issue
            </a>
            <a
              href="https://github.com/harshit-911/ShieldSight.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              View Repository
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
