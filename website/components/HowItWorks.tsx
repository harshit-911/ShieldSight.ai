'use client';

import { useState } from 'react';
import { Globe, Scan, Cpu, ShieldCheck, EyeOff } from 'lucide-react';

const pipelineStages = [
  {
    step: '01',
    title: 'Website',
    subtitle: 'Page Loading & DOM',
    icon: Globe,
    description: 'User navigates to any website. ShieldSight initializes its non-intrusive DOM observer.',
    details: ['Monitors active tab DOM elements', 'Zero impact on page load speeds', 'Supports images & text'],
  },
  {
    step: '02',
    title: 'Content Discovery',
    subtitle: 'Viewport Scanner',
    icon: Scan,
    description: 'IntersectionObserver identifies images and text blocks entering the visible viewport.',
    details: ['Prioritizes visible elements first', 'Filters out UI icons', 'Queues media into local buffer'],
  },
  {
    step: '03',
    title: 'AI Analysis',
    subtitle: 'Local Inference',
    icon: Cpu,
    description: 'ONNX WebAssembly model & local Tesseract OCR engine execute inference 100% offline.',
    details: ['OpenNSFW2 & Violence Vision models', 'Tesseract WASM OCR text extractor', 'Indian Language Normalization Engine'],
  },
  {
    step: '04',
    title: 'Risk Assessment',
    subtitle: 'DecisionEngine Scoring',
    icon: ShieldCheck,
    description: 'DecisionEngine aggregates scores and measures combined risk metrics.',
    details: ['Evaluates adult, graphic & toxic scores', 'Compares against sensitivity threshold', 'Flags restricted domain ratings'],
  },
  {
    step: '05',
    title: 'Protection',
    subtitle: 'Instant Blur & Badge',
    icon: EyeOff,
    description: 'Unsafe content is instantly blurred and covered with a safety warning card.',
    details: ['CSS blur applied immediately', 'One-click temporary reveal option', 'Full-page warning for high-risk sites'],
  },
];

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            How It Works
          </h2>
        </div>

        {/* Minimal Timeline Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8 border-b border-slate-800/50 pb-6">
          {pipelineStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`text-left p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-900 border border-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500 mb-1">{stage.step}</div>
                <div className="text-xs font-semibold">{stage.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-8 rounded-xl bg-[#0D1322] border border-slate-800/60">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              STAGE {pipelineStages[activeStage].step}
            </span>
            <h3 className="text-lg font-bold text-slate-100">
              {pipelineStages[activeStage].title} — <span className="text-slate-400 font-normal text-sm">{pipelineStages[activeStage].subtitle}</span>
            </h3>
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mb-6">
            {pipelineStages[activeStage].description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/40">
            {pipelineStages[activeStage].details.map((detail, dIdx) => (
              <div key={dIdx} className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
