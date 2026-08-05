'use client';

import { Download, BookOpen, Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function DownloadSection() {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mb-4">
          Start Protecting Your Family Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Install the ShieldSight AI Chrome extension in seconds. Lightweight, private, and 100% on-device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="https://github.com/harshit-911/ShieldSight.ai/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Download Extension
          </a>

          <Link
            href="/docs#installation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Installation Guide
          </Link>
        </div>

        <div className="flex justify-center gap-6 text-xs text-slate-400">
          <a href="https://github.com/harshit-911/ShieldSight.ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors flex items-center gap-1">
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          <Link href="/docs" className="hover:text-slate-200 transition-colors flex items-center gap-1">
            Documentation <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
