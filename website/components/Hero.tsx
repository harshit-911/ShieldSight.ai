'use client';

import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220]">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Minimal Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>On-Device AI Protection Engine v1.0</span>
        </motion.div>

        {/* Minimalist Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-100 tracking-tight leading-[1.15] mb-6"
        >
          Protecting Every Click.{' '}
          <span className="text-slate-400 font-normal block sm:inline">
            Protecting Every Family.
          </span>
        </motion.h1>

        {/* Minimalist Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          ShieldSight AI uses on-device multimodal AI to help reduce exposure to explicit images, graphic violence, harmful language, and unsafe online interactions while keeping your browsing private.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link
            href="#download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Download Extension
          </Link>
          <Link
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-slate-300 hover:text-white text-xs font-semibold transition-all group"
          >
            <span>Explore Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Minimal Metrics Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-slate-800/50 flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-xs text-slate-400 font-mono"
        >
          <div>
            <span className="text-slate-100 font-bold block text-sm font-sans">100% Local</span>
            <span>On-device processing</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-100 font-bold block text-sm font-sans">&lt; 25ms</span>
            <span>Inference latency</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-100 font-bold block text-sm font-sans">Zero</span>
            <span>Cloud logging</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
