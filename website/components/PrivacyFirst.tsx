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
    description: 'Zero network calls to external servers for content analysis. Zero remote logging, telemetry, or remote storage of your browsing habits.',
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
    <section id="privacy" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            Zero Data Leakage Guarantee
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Privacy First. Always.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Unlike traditional safety software that sends your screenshot data to remote servers, ShieldSight AI processes everything locally on your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Privacy Callout Box */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-100">
              Open & Verifiable Architecture
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect our open codebase on GitHub. Verify that no network sockets or external telemetry calls exist in our background service workers.
            </p>
          </div>
          <a
            href="https://github.com/harshit-911/ShieldSight.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-sm font-semibold whitespace-nowrap transition-all"
          >
            Audit Source Code
          </a>
        </div>
      </div>
    </section>
  );
}
