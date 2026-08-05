'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does ShieldSight AI work?',
    answer: 'ShieldSight AI runs as a browser extension using Chrome Manifest V3 architecture. As you browse, a non-intrusive viewport scanner detects visible images and text elements. Lightweight ONNX vision models (OpenNSFW2 & Violence classifier) and an offline Tesseract WASM OCR engine analyze content locally and apply real-time CSS blur and safety badges over explicit or harmful material.',
  },
  {
    question: 'Does it send my data to servers?',
    answer: 'No. ShieldSight AI is built on a 100% On-Device AI architecture. All image classification, text moderation, and OCR extraction execute inside your local browser runtime. Zero images, text snippets, browsing history, or personal data are ever uploaded to cloud servers.',
  },
  {
    question: 'Does it work offline?',
    answer: 'Yes. All AI vision models, tokenizers, language definitions, and OCR WASM binaries are bundled directly inside the extension package. Once installed, ShieldSight AI provides full protection even when your internet connection is disconnected.',
  },
  {
    question: 'Can I reveal blocked content?',
    answer: 'Yes. Every obscured image or toxic text block includes a discrete "Reveal" button. Clicking "Reveal" temporarily unblurs the specific item for your active browsing session without affecting overall safety settings.',
  },
  {
    question: 'Which browsers are supported?',
    answer: 'ShieldSight AI supports Google Chrome, Microsoft Edge, Brave, Opera, Arc, and all Chromium-based desktop browsers supporting Manifest V3 extension APIs.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] border-t border-slate-800/40">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Questions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-slate-800/40 divide-y divide-slate-800/40">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className="py-5">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-slate-100 text-sm font-semibold hover:text-slate-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="pt-3 text-xs text-slate-400 leading-relaxed max-w-3xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
