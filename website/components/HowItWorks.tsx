'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Scan, Cpu, ShieldCheck, EyeOff, ArrowRight } from 'lucide-react';

const pipelineStages = [
  {
    id: 'stage-1',
    step: '01',
    title: 'Website',
    subtitle: 'Page Loading & DOM',
    icon: Globe,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    description: 'User navigates to any website. ShieldSight initializes its non-intrusive DOM observer.',
    details: ['Monitors active tab DOM elements', 'Zero impact on page load speeds', 'Supports images, video frames & text'],
  },
  {
    id: 'stage-2',
    step: '02',
    title: 'Content Discovery',
    subtitle: 'Lazy Viewport Scanner',
    icon: Scan,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    description: 'IntersectionObserver identifies images and text blocks entering the visible viewport.',
    details: ['Prioritizes visible elements first', 'Filters out tiny icons & logos', 'Queues media into local AI buffer'],
  },
  {
    id: 'stage-3',
    step: '03',
    title: 'AI Analysis',
    subtitle: 'Multimodal Local Inference',
    icon: Cpu,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    description: 'ONNX WebAssembly model & local Tesseract OCR engine execute inference 100% offline.',
    details: ['OpenNSFW2 & Violence Vision models', 'Tesseract WASM OCR text extractor', 'Indian Language Normalization Engine'],
  },
  {
    id: 'stage-4',
    step: '04',
    title: 'Risk Assessment',
    subtitle: 'DecisionEngine Scoring',
    icon: ShieldCheck,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    description: 'DecisionEngine aggregates scores and measures combined risk metrics.',
    details: ['Evaluates adult, graphic & toxic scores', 'Compares against sensitivity threshold', 'Flags restricted domain ratings'],
  },
  {
    id: 'stage-5',
    step: '05',
    title: 'Protection',
    subtitle: 'Instant Blur & Safety Badge',
    icon: EyeOff,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    description: 'Unsafe content is instantly blurred and covered with an interactive safety warning card.',
    details: ['CSS blur applied without FOUC', 'One-click temporary reveal option', 'Full-page warning for high-risk sites'],
  },
];

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1322] border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">
            Real-Time Defense Pipeline
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            How ShieldSight AI Works
          </p>
          <p className="mt-4 text-base text-slate-400">
            A 5-stage synchronous architecture that analyzes and protects content before your eyes can process it.
          </p>
        </div>

        {/* Animated Horizontal Pipeline Bar */}
        <div className="hidden lg:grid grid-cols-5 gap-3 mb-12 relative">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-2xl border text-left transition-all relative ${
                  isActive
                    ? `${stage.bgColor} ${stage.borderColor} border-2 shadow-lg`
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold ${stage.color}`}>{stage.step}</span>
                  <div className={`w-8 h-8 rounded-lg ${stage.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-1">{stage.title}</h3>
                <p className="text-xs text-slate-400 truncate">{stage.subtitle}</p>

                {idx < pipelineStages.length - 1 && (
                  <ArrowRight className="hidden" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Card View */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
                STAGE {pipelineStages[activeStage].step} OF 05
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3">
                {pipelineStages[activeStage].title} — <span className="text-slate-400 font-medium">{pipelineStages[activeStage].subtitle}</span>
              </h3>
              <p className="text-base text-slate-300 mb-6 leading-relaxed">
                {pipelineStages[activeStage].description}
              </p>

              <div className="space-y-3">
                {pipelineStages[activeStage].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Visual Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm p-8 rounded-2xl bg-[#0B1220] border border-slate-800 text-center shadow-inner"
              >
                {(() => {
                  const Icon = pipelineStages[activeStage].icon;
                  return (
                    <div className={`w-20 h-20 mx-auto rounded-2xl ${pipelineStages[activeStage].bgColor} border ${pipelineStages[activeStage].borderColor} flex items-center justify-center mb-6`}>
                      <Icon className={`w-10 h-10 ${pipelineStages[activeStage].color}`} />
                    </div>
                  );
                })()}
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  System Status
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {pipelineStages[activeStage].title} Pipeline Active
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Controls for Mobile */}
          <div className="flex lg:hidden items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <button
              disabled={activeStage === 0}
              onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 font-mono">
              {activeStage + 1} / {pipelineStages.length}
            </span>
            <button
              disabled={activeStage === pipelineStages.length - 1}
              onClick={() => setActiveStage((prev) => Math.min(pipelineStages.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white disabled:opacity-40"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
