'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1322] border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">
            Got Questions?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-base text-slate-400">
            Everything you need to know about ShieldSight AI protection, privacy, and compatibility.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-100 text-base sm:text-lg hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-500' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                        {faq.answer}
                      </div>
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
