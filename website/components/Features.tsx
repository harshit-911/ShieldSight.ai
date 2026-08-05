'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, MessageSquare, Scan } from 'lucide-react';

const features = [
  {
    icon: ShieldAlert,
    title: 'Adult Content Protection',
    description: 'Detects and obscures explicit images before they are viewed using lightweight local vision AI models.',
  },
  {
    icon: AlertTriangle,
    title: 'Graphic Content Protection',
    description: 'Identifies disturbing visual content and helps reduce exposure across web pages and media feeds.',
  },
  {
    icon: MessageSquare,
    title: 'Harmful Conversation Protection',
    description: 'Detects abusive, threatening, and inappropriate language in browser-based conversations.',
  },
  {
    icon: Scan,
    title: 'OCR Protection',
    description: 'Scans text embedded inside images and screenshots, applying the same moderation pipeline offline.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Features
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Comprehensive Defense Layers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 rounded-xl bg-[#0D1322] border border-slate-800/60 hover:border-slate-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
