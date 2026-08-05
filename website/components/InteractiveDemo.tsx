'use client';

import { useState } from 'react';
import { RefreshCw, Play, ShieldAlert, Eye, Lock, CheckCircle2 } from 'lucide-react';

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
    }, 1000);
  };

  const handleReset = () => {
    setIsScanning(false);
    setHasScanned(false);
    setRevealedContent({});
  };

  const toggleReveal = (key: string) => {
    setRevealedContent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isHighRisk = selectedImage === 'unsafe' || selectedComment === 'abusive';
  const riskLabel = !hasScanned ? 'READY' : isHighRisk ? 'HIGH RISK' : 'SAFE';

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Interactive Product Demo
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Test On-Device AI Moderation
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              {isScanning ? 'Scanning...' : 'Run AI Scan'}
            </button>
          </div>
        </div>

        {/* Segmented Option Controls */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs">
          <div className="flex items-center gap-2 bg-[#0D1322] p-1 rounded-lg border border-slate-800">
            <span className="text-slate-500 font-mono px-2">IMAGE:</span>
            <button
              onClick={() => setSelectedImage('safe')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedImage === 'safe' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
              }`}
            >
              Safe
            </button>
            <button
              onClick={() => setSelectedImage('unsafe')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedImage === 'unsafe' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
              }`}
            >
              Explicit
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#0D1322] p-1 rounded-lg border border-slate-800">
            <span className="text-slate-500 font-mono px-2">TEXT:</span>
            <button
              onClick={() => setSelectedComment('normal')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedComment === 'normal' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setSelectedComment('abusive')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedComment === 'abusive' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'
              }`}
            >
              Abusive
            </button>
          </div>
        </div>

        {/* Minimalist Mock Browser Container */}
        <div className="bg-[#0D1322] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-[#090D18] px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>https://social-feed.example.com</span>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              STATUS: {riskLabel}
            </span>
          </div>

          <div className="p-6 space-y-4 max-w-xl mx-auto">
            {/* Image Box */}
            <div className="border border-slate-800/60 rounded-xl p-4 bg-[#0B1220] relative">
              <div className="text-xs font-semibold text-slate-400 mb-3">User Media Attachment</div>
              <div className="h-48 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                {selectedImage === 'safe' ? (
                  <div className="text-center text-xs text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Safe Landscape Image</span>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <div className={`w-full h-full flex flex-col items-center justify-center text-xs text-rose-400 p-4 ${
                      hasScanned && !revealedContent['img-1'] ? 'filter blur-md select-none pointer-events-none' : ''
                    }`}>
                      EXPLICIT MEDIA SAMPLE
                    </div>

                    {hasScanned && !revealedContent['img-1'] && (
                      <div className="absolute inset-0 bg-[#0B1220]/90 flex flex-col items-center justify-center p-4 text-center">
                        <ShieldAlert className="w-5 h-5 text-rose-400 mb-2" />
                        <div className="text-xs font-semibold text-slate-200 mb-1">Adult Content Hidden</div>
                        <button
                          onClick={() => toggleReveal('img-1')}
                          className="px-3 py-1 rounded bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 mt-2 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Reveal
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Box */}
            <div className="border border-slate-800/60 rounded-xl p-4 bg-[#0B1220]">
              <div className="text-xs font-semibold text-slate-400 mb-2">Comment Text</div>
              {selectedComment === 'normal' ? (
                <div className="text-xs text-slate-300">Great work on this project! Looking forward to launch.</div>
              ) : (
                <div>
                  {hasScanned && !revealedContent['txt-1'] ? (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Harmful Language Hidden</span>
                      <button
                        onClick={() => toggleReveal('txt-1')}
                        className="px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                      >
                        Reveal
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-300 font-mono">tu c h u t ! y a hai b c h d</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
