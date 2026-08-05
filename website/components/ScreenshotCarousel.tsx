'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Shield, AlertTriangle, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  {
    id: 'popup',
    title: 'Extension Popup UI',
    subtitle: 'One-Click Master Toggle & Diagnostics',
    icon: Layout,
    description: 'Clean consumer control popup displaying real-time protection state, sensitivity thresholds, and active scan metrics.',
    badge: 'Popup Interface',
    mockContent: (
      <div className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#0D1322] border border-slate-800 text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-100" />
            <span className="text-xs font-semibold text-slate-100">ShieldSight AI</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
            <span>Adult Content Filter</span>
            <span className="text-slate-200 font-semibold">ON</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
            <span>Harmful Language Filter</span>
            <span className="text-slate-200 font-semibold">ON</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
            <span>OCR Image Text Filter</span>
            <span className="text-slate-200 font-semibold">ON</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs">
          <span className="text-slate-500">Items Scanned: </span>
          <span className="text-slate-100 font-bold">142</span>
        </div>
      </div>
    ),
  },
  {
    id: 'overlay',
    title: 'Protection Overlay',
    subtitle: 'Flat Blur & Safety Card',
    icon: Shield,
    description: 'Instant visual blur and inline safety card applied over explicit images and toxic text blocks before your eyes process them.',
    badge: 'Content Protection',
    mockContent: (
      <div className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#0D1322] border border-slate-800 text-center">
        <div className="w-10 h-10 mx-auto rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-300">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold text-slate-100 mb-1">Sensitive Content Obscured</div>
        <p className="text-[11px] text-slate-400 max-w-xs mx-auto mb-3 leading-relaxed">
          ShieldSight AI detected explicit visual content and blurred it locally.
        </p>
        <button className="px-3 py-1 rounded bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
          Reveal Content
        </button>
      </div>
    ),
  },
  {
    id: 'warning',
    title: 'Website Restriction Warning',
    subtitle: 'Security Interstitial',
    icon: AlertTriangle,
    description: 'Renders a matte full-page security warning interstitial if an entire website poses high explicit or violent safety risks.',
    badge: 'Domain Interstitial',
    mockContent: (
      <div className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#0D1322] border border-slate-800 text-center">
        <div className="w-10 h-10 mx-auto rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-300">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs font-semibold text-slate-100 mb-1">Restricted Domain Warning</div>
        <p className="text-[11px] text-slate-400 max-w-xs mx-auto mb-4 leading-relaxed">
          This domain has been flagged for frequent explicit content.
        </p>
        <button className="px-3 py-1.5 rounded bg-slate-100 text-slate-950 text-xs font-semibold">
          Go Back Safely
        </button>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Parental Safety Dashboard',
    subtitle: 'Safety Metrics',
    icon: BarChart3,
    description: 'High-level aggregated statistics giving parents insights into blocked categories without logging visited URLs or private chat content.',
    badge: 'Parental Analytics',
    mockContent: (
      <div className="w-full max-w-sm mx-auto p-5 rounded-xl bg-[#0D1322] border border-slate-800 text-left">
        <div className="text-xs font-semibold text-slate-100 mb-3">Monthly Safety Summary</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
            <div className="text-[10px] text-slate-500">Adult Filtered</div>
            <div className="text-sm font-bold text-slate-100 mt-0.5">328</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60">
            <div className="text-[10px] text-slate-500">Toxic Chats</div>
            <div className="text-sm font-bold text-slate-100 mt-0.5">84</div>
          </div>
        </div>
      </div>
    ),
  },
];

export function ScreenshotCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Showcase
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Product Experience
          </h2>
        </div>

        {/* Minimal Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800/40 pb-4">
          {screenshots.map((s, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 border border-slate-800 text-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>

        {/* Active Item View */}
        <div className="p-8 rounded-xl bg-[#0D1322] border border-slate-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {screenshots[currentIndex].badge}
              </span>
              <h3 className="text-xl font-bold text-slate-100">
                {screenshots[currentIndex].title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {screenshots[currentIndex].description}
              </p>

              <div className="flex items-center gap-2 pt-4">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {screenshots[currentIndex].mockContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
