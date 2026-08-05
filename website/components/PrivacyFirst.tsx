'use client';

import { HardDrive, CloudOff, Lock, Zap } from 'lucide-react';

const privacyCards = [
  {
    icon: HardDrive,
    title: '100% Local Processing',
    description: 'All AI models run natively inside your browser. Data never leaves your device.',
  },
  {
    icon: CloudOff,
    title: 'No Cloud Uploads',
    description: 'Zero external network calls or remote logging of your browsing habits.',
  },
  {
    icon: Lock,
    title: 'Private by Design',
    description: 'Manifest V3 compliant with isolated extension execution context.',
  },
  {
    icon: Zap,
    title: 'Fast On-Device AI',
    description: 'WebAssembly ONNX runtime performs inference in under 25 milliseconds.',
  },
];

export function PrivacyFirst() {
  return (
    <section id="privacy" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-slate-100 mb-6">
          Privacy First
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {privacyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-5 rounded-xl bg-[#0D1322] border border-slate-800/60"
              >
                <Icon className="w-4 h-4 text-slate-300 mb-3" />
                <h3 className="text-xs font-semibold text-slate-100 mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
