'use client';

import { motion } from 'framer-motion';
import { HardDrive, CloudOff, Lock, Zap } from 'lucide-react';

const privacyCards = [
  {
    icon: HardDrive,
    title: '100% Local Processing',
    description: 'All AI models run natively inside your web browser environment. Your images, text, and chat messages never leave your computer.',
  },
  {
    icon: CloudOff,
    title: 'No Cloud Uploads',
    description: 'Zero network calls to external servers for content analysis. Zero remote logging, telemetry, or remote storage.',
  },
  {
    icon: Lock,
    title: 'Private by Design',
    description: 'Manifest V3 compliant with isolated extension contexts. Your passwords, banking credentials, and private sessions remain untouched.',
  },
  {
    icon: Zap,
    title: 'Fast On-Device AI',
    description: 'Optimized WebAssembly ONNX runtimes leverage hardware acceleration to perform multimodal inference in under 25 milliseconds.',
  },
];

export function PrivacyFirst() {
  return (
    <section id="privacy" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Privacy Architecture
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Privacy First. Always.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="p-6 rounded-xl bg-[#0D1322] border border-slate-800/60"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
