import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { DownloadButton } from '../../components/DownloadButton';
import { Download, FolderArchive, Monitor, ToggleRight, FolderOpen, CheckCircle2, AlertCircle, Github, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Installation Guide — ShieldSight AI',
  description: 'Step-by-step instructions for installing ShieldSight AI extension in Google Chrome and Chromium browsers.',
};

export default function InstallPage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Download Extension ZIP',
      icon: Download,
      description: 'Get the latest ShieldSight AI extension package ZIP file.',
      detail: 'Click the Download button to receive ShieldSightAI-v1.0.0.zip.',
    },
    {
      step: 'Step 2',
      title: 'Extract the ZIP File',
      icon: FolderArchive,
      description: 'Unzip the downloaded archive on your computer.',
      detail: 'Right-click the ZIP and select "Extract All" or double-click to unpack.',
    },
    {
      step: 'Step 3',
      title: 'Open chrome://extensions',
      icon: Monitor,
      description: 'Navigate to Chrome Extension Management.',
      detail: 'Type chrome://extensions in your browser address bar.',
    },
    {
      step: 'Step 4',
      title: 'Enable Developer Mode',
      icon: ToggleRight,
      description: 'Toggle Developer Mode switch in top-right corner.',
      detail: 'Enables loading custom extension packages.',
    },
    {
      step: 'Step 5',
      title: 'Click "Load Unpacked"',
      icon: FolderOpen,
      description: 'Select the unpacked extension directory.',
      detail: 'Click the "Load Unpacked" button at top-left of extensions page.',
    },
    {
      step: 'Step 6',
      title: 'Select Extracted Folder',
      icon: CheckCircle2,
      description: 'Choose the extracted extension directory.',
      detail: 'ShieldSight AI icon will immediately appear in your browser toolbar!',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
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

        {/* 6-Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-3 relative overflow-hidden"
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

        {/* Troubleshooting & Issue Support */}
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
