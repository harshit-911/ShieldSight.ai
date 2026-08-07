'use client';

import { Presentation, ExternalLink, Maximize2 } from 'lucide-react';

export function PresentationSection() {
  return (
    <section id="presentation" className="py-20 bg-[#0B1220] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 mb-4">
            <Presentation className="w-3.5 h-3.5" />
            <span>ACADEMIC PROJECT DEFENSE DECK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-4">
            Interactive Slide Deck
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore our 8-slide presentation deck detailing ShieldSight AI’s on-device architecture, tri-modal safety engines, and latency benchmarks.
          </p>
        </div>

        {/* Embedded Presentation Frame Container */}
        <div className="relative rounded-2xl border border-slate-800 bg-[#0D1322] shadow-2xl overflow-hidden group">
          
          {/* Top Bar of Presentation Preview Player */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#080D1A] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-400">ShieldSight_AI_Presentation.html</span>
            </div>
            
            <a
              href="/presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>Open Fullscreen</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Interactive iFrame */}
          <iframe
            src="/presentation.html"
            title="ShieldSight AI Project Presentation"
            className="w-full h-[520px] border-0 bg-[#0B1220]"
            loading="lazy"
          />
        </div>

        {/* Presenter Tip Box */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Presenter Tip:</strong> Click inside the slide deck above and press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">F</kbd> for fullscreen presentation mode. Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">→</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">←</kbd> to navigate slides.</span>
          </div>
          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-medium whitespace-nowrap"
          >
            Launch Presenter Mode ↗
          </a>
        </div>

      </div>
    </section>
  );
}
