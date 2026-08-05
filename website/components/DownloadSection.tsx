'use client';

import { Download, BookOpen, Github, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function DownloadSection() {
  return (
    <section id="download" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#111827] to-[#0D1322] border border-slate-800 p-8 sm:p-14 shadow-2xl overflow-hidden text-center">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
              Start Protecting Your Family Today
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
              Install the ShieldSight AI Chrome extension in seconds. Lightweight, private, and 100% on-device.
            </p>

            {/* Checklist */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-300 font-medium mb-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free & Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Account Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Chromium MV3 Compatible</span>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <a
                href="https://github.com/harshit-911/ShieldSight.ai/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download Extension
              </a>

              <Link
                href="/docs#installation"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                Installation Guide
              </Link>

              <a
                href="https://github.com/harshit-911/ShieldSight.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
              </a>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                <span>Documentation</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
