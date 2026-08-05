'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, MessageSquareWarning, FileText } from 'lucide-react';

const features = [
  {
    icon: ShieldAlert,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    title: 'Adult Content Protection',
    description: 'Detects and obscures explicit images before they are viewed using lightweight local vision AI models.',
  },
  {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    title: 'Graphic Content Protection',
    description: 'Identifies disturbing visual content and helps reduce exposure across web pages and media feeds.',
  },
  {
    icon: MessageSquareWarning,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    title: 'Harmful Conversation Protection',
    description: 'Detects abusive, threatening, and inappropriate language in browser-based conversations and chats.',
  },
  {
    icon: FileText,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    title: 'OCR Protection',
    description: 'Scans text embedded inside images and screenshots, applying the same moderation pipeline offline.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">
            Comprehensive Defense Matrix
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Built for Modern Families & Individuals
          </p>
          <p className="mt-4 text-base text-slate-400">
            Four specialized protection layers running concurrently in your browser without sacrificing speed or privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
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
