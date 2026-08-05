'use client';

import { motion } from 'framer-motion';
import { DownloadButton } from './DownloadButton';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Status & Version Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-slate-400 text-xs font-mono mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Version 1.0.0 Beta</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">On-Device AI Engine</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-bold text-slate-100 tracking-tight leading-[1.1] mb-5"
        >
          Protecting Every Click.{' '}
          <span className="text-slate-400 font-normal block sm:inline">
            Protecting Every Family.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          On-device AI protection against explicit images, graphic violence, and harmful language while keeping your browsing 100% private.
        </motion.p>

        {/* Download Action Component */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex justify-center mb-14"
        >
          <DownloadButton variant="primary" showSubtext />
        </motion.div>

        {/* Essential Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pt-6 border-t border-slate-800/40 flex justify-center items-center gap-8 text-xs text-slate-400 font-mono"
        >
          <div>
            <span className="text-slate-200 font-semibold block font-sans">100% Local</span>
            <span>On-Device AI</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-slate-200 font-semibold block font-sans">&lt; 25ms</span>
            <span>Latency</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div>
            <span className="text-slate-200 font-semibold block font-sans">Zero</span>
            <span>Cloud Logging</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
