'use client';

import { DownloadButton } from './DownloadButton';
import { BookOpen, Github, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function DownloadSection() {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-100">
          <ShieldCheck className="w-6 h-6 text-slate-100" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight mb-3">
          Start Protecting Your Family Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Install the ShieldSight AI Chrome extension in seconds. Lightweight, private, and 100% on-device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <DownloadButton variant="primary" showSubtext />

          <Link
            href="/install"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Installation Guide
          </Link>
        </div>

        {/* Action Link Grid */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800/40">
          <a
            href="https://github.com/harshit-911/ShieldSight.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" /> View Source Code
          </a>

          <Link href="/docs" className="hover:text-slate-200 transition-colors flex items-center gap-1.5">
            Documentation <ArrowRight className="w-3 h-3" />
          </Link>

          <a
            href="https://github.com/harshit-911/ShieldSight.ai/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Report an Issue
          </a>
        </div>
      </div>
    </section>
  );
}
