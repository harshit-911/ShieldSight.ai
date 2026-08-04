import React from 'react';

export const ModelStatus: React.FC = () => {
  return (
    <div className="mx-4 my-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Security Engines
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <span className="font-semibold">NSFW Classifier</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <span className="font-semibold">Violence Model</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <span className="font-semibold">Toxicity Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
          <span className="font-semibold">Tesseract OCR</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
};
