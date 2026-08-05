'use client';

import { motion } from 'framer-motion';
import { Download, Play, Shield, Lock, Zap, EyeOff } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden mesh-background">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Cybersecurity Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium mb-8 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>On-Device Multimodal Protection Engine v1.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-semibold">Manifest V3 Certified</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tight leading-[1.1] mb-6"
        >
          Protecting Every Click.{' '}
          <span className="block mt-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            Protecting Every Family.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          ShieldSight AI uses on-device multimodal AI to help reduce exposure to explicit images, graphic violence, harmful language, and unsafe online interactions while keeping your browsing private.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="#download"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-xl shadow-blue-600/25 active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            Download Extension
          </Link>
          <Link
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-base transition-all"
          >
            <Play className="w-4 h-4 fill-current text-blue-400" />
            Watch Demo
          </Link>
        </motion.div>

        {/* Trust Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60"
        >
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-left">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Lock className="w-4 h-4" />
              <span className="text-xl font-bold text-slate-100">100%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Local Processing</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-left">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xl font-bold text-slate-100">&lt; 25ms</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Ultra-Fast Latency</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-left">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <EyeOff className="w-4 h-4" />
              <span className="text-xl font-bold text-slate-100">0</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Cloud Data Uploads</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-left">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xl font-bold text-slate-100">Zero</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Browsing History Logging</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
