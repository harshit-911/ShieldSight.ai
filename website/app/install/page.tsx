import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadButton } from '../../components/DownloadButton';
import { Download, FolderArchive, Monitor, ToggleRight, FolderOpen, CheckCircle2, AlertCircle, Github, HelpCircle, FileCode, Check } from 'lucide-react';

export const metadata = {
  title: 'Installation Guide — ShieldSight AI',
  description: 'Step-by-step instructions for installing ShieldSight AI extension in Google Chrome and Chromium browsers.',
};

export default function InstallPage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Download Repository ZIP',
      icon: Download,
      description: 'Download the ShieldSight AI package or repository ZIP.',
      detail: 'Click Download to receive ShieldSight.ai-main.zip.',
    },
    {
      step: 'Step 2',
      title: 'Extract the ZIP File',
      icon: FolderArchive,
      description: 'Unpack the downloaded ZIP archive on your computer.',
      detail: 'Right-click the ZIP and select "Extract All" (Windows) or double-click to unzip (Mac).',
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
      title: 'Select the "public" Folder',
      icon: CheckCircle2,
      description: 'Open ShieldSight.ai-main and select the public/ folder.',
      detail: 'Select ShieldSight.ai-main/public (where manifest.json is located) and click Select Folder.',
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

        {/* TARGET EXTENSION FOLDER SELECTION CALLOUT */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-blue-500/40 mb-14 text-left space-y-4 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Where is manifest.json Located?
              </div>
              <div className="text-xs text-slate-400">
                In the extracted <code className="text-slate-200 font-mono">ShieldSight.ai-main</code> folder, open the <strong><code className="text-emerald-300 font-mono font-bold">public/</code></strong> folder!
              </div>
            </div>
          </div>

          {/* Folder Path Box */}
          <div className="p-4 rounded-xl bg-[#0B1220] border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs text-slate-200">
            <span className="text-emerald-400 font-bold select-all truncate">
              ShieldSight.ai-main / public
            </span>
            <span className="text-[10px] text-slate-500 font-sans uppercase shrink-0 font-bold">
              Exact Folder to Select
            </span>
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
                Downloaded ZIP Folder Structure
              </h2>
              <p className="text-xs text-slate-400">
                Open <code className="text-slate-200 font-mono">ShieldSight.ai-main</code> and select the <strong><code className="text-emerald-400 font-mono font-bold">public/</code></strong> folder:
              </p>
            </div>
          </div>

          {/* Directory File Structure Visualizer */}
          <div className="p-5 rounded-xl bg-[#0B1220] border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-slate-400 font-bold">📁 ShieldSight.ai-main/</div>
            <div className="pl-4 text-emerald-400 font-bold">└── 📁 public/  <span className="text-emerald-400 font-sans font-semibold">← SELECT THIS FOLDER IN CHROME!</span></div>
            <div className="pl-8 text-slate-200">├── 📄 manifest.json  <span className="text-emerald-400 font-sans font-semibold font-bold">← Located directly inside public/</span></div>
            <div className="pl-8 text-slate-400">├── 📄 offscreen.html</div>
            <div className="pl-8 text-slate-400">├── 📁 icons/</div>
            <div className="pl-8 text-slate-400">├── 📁 models/</div>
            <div className="pl-8 text-slate-400">└── 📁 tessdata/</div>
          </div>

          {/* Summary Note */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300 leading-relaxed flex items-start gap-3">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong>Quick Rule:</strong> In Chrome's <em>Load Unpacked</em> file window, click into <strong><code className="bg-blue-950 px-1.5 py-0.5 rounded font-mono text-blue-200">ShieldSight.ai-main</code></strong>, click on <strong><code className="bg-blue-950 px-1.5 py-0.5 rounded font-mono text-emerald-300 font-bold">public</code></strong>, and click <strong>Select Folder</strong> / <strong>Open</strong>!
            </div>
          </div>
        </div>

        {/* Troubleshooting & Support */}
        <div className="p-8 rounded-2xl bg-[#0D1322] border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Need Help or Encountered an Issue?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              If you experience any difficulties during installation or want to report a bug, submit an issue directly on GitHub.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/harshit-911/ShieldSight.ai/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
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
