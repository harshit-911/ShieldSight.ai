'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Shield, AlertTriangle, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  {
    id: 'popup',
    title: 'Extension Popup UI',
    subtitle: 'One-Click Master Toggle & Live Diagnostics',
    icon: Layout,
    description: 'Clean consumer control popup displaying real-time protection state, sensitivity thresholds, and active scan metrics.',
    badge: 'Popup Interface',
    mockContent: (
      <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">ShieldSight AI</div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Protection Active
              </div>
            </div>
          </div>
          <div className="w-10 h-6 rounded-full bg-blue-600 p-1 flex justify-end">
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Adult Content Filter</span>
            <span className="font-semibold text-emerald-400">ENABLED</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Harmful Language Filter</span>
            <span className="font-semibold text-emerald-400">ENABLED</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">OCR Image Text Filter</span>
            <span className="font-semibold text-emerald-400">ENABLED</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 text-center">
          <div className="text-xs text-blue-300 font-medium">Scanned This Session</div>
          <div className="text-2xl font-bold text-white mt-1">142 Items Protected</div>
        </div>
      </div>
    ),
  },
  {
    id: 'overlay',
    title: 'Protection Overlay',
    subtitle: 'Flat Matte Blur & Safety Card',
    icon: Shield,
    description: 'Instant visual blur and inline safety card applied over explicit images and toxic text blocks before your eyes process them.',
    badge: 'Content Protection',
    mockContent: (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#0B1220] border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="p-8 rounded-xl bg-rose-950/20 border border-rose-900/30 text-center filter blur-md select-none opacity-40">
          explicit content sample image preview text block
        </div>
        <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h4 className="text-base font-bold text-slate-100 mb-1">Sensitive Media Obscured</h4>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            ShieldSight AI detected explicit visual content and blurred it locally.
          </p>
          <button className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700">
            Reveal Content
          </button>
        </div>
      </div>
    ),
  },
  {
    id: 'warning',
    title: 'Website Restriction Warning',
    subtitle: 'Full-Page Security Interstitial',
    icon: AlertTriangle,
    description: 'Renders a matte full-page security warning interstitial if an entire website poses high explicit or violent safety risks.',
    badge: 'Domain Interstitial',
    mockContent: (
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-[#0C101D] border border-slate-800 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-rose-400" />
        </div>
        <h4 className="text-lg font-bold text-slate-100 mb-1">Restricted Domain Warning</h4>
        <p className="text-xs text-rose-400 font-semibold mb-4">High Risk Website Rating</p>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          This domain has been flagged for frequent explicit content. ShieldSight AI has paused automated display.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white">Go Back Safely</button>
          <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">Proceed Anyway</button>
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Parental Safety Dashboard',
    subtitle: 'Privacy-Preserving Safety Metrics',
    icon: BarChart3,
    description: 'High-level aggregated statistics giving parents insights into blocked categories without logging visited URLs or private chat content.',
    badge: 'Parental Analytics',
    mockContent: (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[#111827] border border-slate-800 text-left shadow-2xl">
        <div className="text-sm font-bold text-slate-100 mb-4">Monthly Safety Report</div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-[#0B1220] border border-slate-800">
            <div className="text-[10px] text-slate-500">Adult Images Filtered</div>
            <div className="text-lg font-bold text-blue-400 mt-1">328</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0B1220] border border-slate-800">
            <div className="text-[10px] text-slate-500">Toxic Chats Obscured</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">84</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#0B1220] border border-slate-800">
          <div className="text-[10px] text-slate-500 mb-2">Protection Breakdown</div>
          <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
            <div className="h-full bg-blue-500 w-[60%]" />
            <div className="h-full bg-emerald-500 w-[25%]" />
            <div className="h-full bg-amber-500 w-[15%]" />
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">
            Product Experience
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Designed for Simplicity & Peace of Mind
          </p>
          <p className="mt-4 text-base text-slate-400">
            Explore the clean, non-intrusive product experience built for modern browser environments.
          </p>
        </div>

        {/* Carousel Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {screenshots.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-[#111827] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Item Viewer */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                {screenshots[currentIndex].badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                {screenshots[currentIndex].title}
              </h3>
              <p className="text-sm font-medium text-slate-400">
                {screenshots[currentIndex].subtitle}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {screenshots[currentIndex].description}
              </p>

              <div className="flex items-center gap-3 pt-6">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                  aria-label="Previous Screenshot"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                  aria-label="Next Screenshot"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-xs text-slate-500 font-mono ml-2">
                  0{currentIndex + 1} / 0{screenshots.length}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
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
