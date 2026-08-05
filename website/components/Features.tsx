'use client';

import { ShieldAlert, AlertTriangle, MessageSquare, Scan } from 'lucide-react';

const features = [
  {
    icon: ShieldAlert,
    title: 'Adult Content',
    description: 'Detects and obscures explicit images before they are rendered on screen.',
  },
  {
    icon: AlertTriangle,
    title: 'Graphic Violence',
    description: 'Identifies disturbing visual content and helps reduce exposure automatically.',
  },
  {
    icon: MessageSquare,
    title: 'Harmful Language',
    description: 'Detects abusive, threatening, and inappropriate language in web conversations.',
  },
  {
    icon: Scan,
    title: 'OCR Scanning',
    description: 'Extracts and scans text embedded inside images and screenshots offline.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-[#0D1322] border border-slate-800/60"
              >
                <Icon className="w-4 h-4 text-slate-300 mb-3" />
                <h3 className="text-xs font-semibold text-slate-100 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
