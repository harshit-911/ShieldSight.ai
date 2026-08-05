'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Shield, Lock } from 'lucide-react';

export function InteractiveDemo() {
  const [selectedImage, setSelectedImage] = useState<'safe' | 'unsafe'>('unsafe');
  const [selectedComment, setSelectedComment] = useState<'normal' | 'abusive'>('abusive');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [revealedContent, setRevealedContent] = useState<Record<string, boolean>>({});

  const handleRunScan = () => {
    setIsScanning(true);
    setHasScanned(false);
    setRevealedContent({});

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsScanning(false);
    setHasScanned(false);
    setRevealedContent({});
  };

  const toggleReveal = (key: string) => {
    setRevealedContent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine overall simulated risk level
  const isHighRisk = selectedImage === 'unsafe' || selectedComment === 'abusive';
  const riskLabel = !hasScanned ? 'READY' : isHighRisk ? 'HIGH RISK' : 'SAFE';
  const riskBadgeColor = !hasScanned
    ? 'bg-slate-800 text-slate-400 border-slate-700'
    : isHighRisk
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1322] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            Interactive Product Demonstration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            See ShieldSight AI in Action
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Select sample media and text combinations below, then trigger the on-device AI scanner to experience real-time protection.
          </p>
        </div>

        {/* Demo Configurator Control Bar */}
        <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            {/* Image Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sample Image Content
              </label>
              <div className="flex items-center gap-2 bg-[#0B1220] p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedImage('safe')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    selectedImage === 'safe'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Safe Image
                </button>
                <button
                  onClick={() => setSelectedImage('unsafe')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    selectedImage === 'unsafe'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Explicit Image
                </button>
              </div>
            </div>

            {/* Comment Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sample Text Content
              </label>
              <div className="flex items-center gap-2 bg-[#0B1220] p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSelectedComment('normal')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    selectedComment === 'normal'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Normal Comment
                </button>
                <button
                  onClick={() => setSelectedComment('abusive')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    selectedComment === 'abusive'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Abusive Comment
                </button>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isScanning ? 'Scanning Content...' : 'Run AI Scan'}
            </button>
          </div>
        </div>

        {/* Mock Browser Window Container */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Browser Top Navigation Bar */}
          <div className="bg-[#0B1220] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address Bar */}
            <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 px-4 py-1.5 rounded-lg text-xs text-slate-400 font-mono w-full max-w-md mx-4">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="truncate">https://social-feed.example.com/chat</span>
            </div>

            {/* Simulated Protection Meter */}
            <div className={`px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wider ${riskBadgeColor}`}>
              STATUS: {riskLabel}
            </div>
          </div>

          {/* Browser Inner Page Viewport */}
          <div className="p-6 sm:p-8 bg-[#0D1322] relative min-h-[420px]">
            {/* Scan Progress Overlay Banner */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xl flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>On-Device AI Multimodal Scan In Progress...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Card Item 1: Image Feed Post */}
              <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
                      JS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Jane Smith</div>
                      <div className="text-[10px] text-slate-500">Shared an image • 2m ago</div>
                    </div>
                  </div>
                </div>

                {/* Simulated Image Box with Blur Protection */}
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0B1220] h-64 flex items-center justify-center">
                  {selectedImage === 'safe' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200">Mountain Landscape Photo</p>
                      <p className="text-xs text-slate-500 mt-1">Verified Safe Content</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Image Content */}
                      <div className={`w-full h-full flex flex-col items-center justify-center bg-rose-950/20 text-rose-300 p-6 text-center transition-all ${
                        hasScanned && !revealedContent['img-1'] ? 'filter blur-[12px] select-none pointer-events-none' : ''
                      }`}>
                        <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
                        <p className="text-xs font-mono">EXPLICIT / ADULT TEST MEDIA SAMPLE</p>
                      </div>

                      {/* Safety Blur Overlay Card */}
                      {hasScanned && !revealedContent['img-1'] && (
                        <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
                            <ShieldAlert className="w-5 h-5 text-rose-400" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-100 mb-1">Adult Content Hidden</h4>
                          <p className="text-xs text-slate-400 mb-4 max-w-xs">
                            ShieldSight AI detected explicit visual media and obscured it locally.
                          </p>
                          <button
                            onClick={() => toggleReveal('img-1')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            Reveal Once
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Item 2: Chat Comment */}
              <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400">
                    AK
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Alex Kumar</div>
                    <div className="text-[10px] text-slate-500">Posted a comment • 1m ago</div>
                  </div>
                </div>

                {selectedComment === 'normal' ? (
                  <div className="text-sm text-slate-300 bg-[#0B1220] p-3 rounded-xl border border-slate-800/60">
                    Great work on this project! Really looking forward to the official launch next week.
                  </div>
                ) : (
                  <div className="relative">
                    {hasScanned && !revealedContent['txt-1'] ? (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-200">Harmful Language Hidden</div>
                            <div className="text-[10px] text-slate-400">Reason: Abusive / Toxic Phrase</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleReveal('txt-1')}
                          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
                        >
                          Reveal
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-rose-300 bg-rose-950/20 p-3 rounded-xl border border-rose-900/30 font-mono text-xs">
                        tu c h u t ! y a hai b c h d
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
