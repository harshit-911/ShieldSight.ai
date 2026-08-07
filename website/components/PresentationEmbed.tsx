'use client';

import { Presentation, Maximize2, Sparkles } from 'lucide-react';

export function PresentationEmbed() {
  return (
    <section id="presentation" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D1322] border-t border-slate-800/60 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Academic Slide Deck
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">
            Project Defense Presentation
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Explore our project defense slides directly below. Control slides using keyboard arrow keys (<kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-xs">→</kbd>) or open in presenter mode.
          </p>
        </div>

        {/* Presentation Container Card */}
        <div className="bg-[#0B1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Embed Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Presentation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">ShieldSight AI Slide Deck</h3>
                <p className="text-xs text-slate-400">Interactive Web Presentation • 8 Slides</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/presentation.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Open Fullscreen
              </a>
            </div>
          </div>

          {/* Embedded Iframe */}
          <div className="relative w-full h-[550px] sm:h-[650px] bg-[#0B1220]">
            <iframe
              src="/presentation.html"
              title="ShieldSight AI Project Presentation"
              className="w-full h-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
