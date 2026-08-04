import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
      <div className="w-full max-w-xs p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide">ShieldSight System Info</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed font-medium">
          <p>
            <strong>ShieldSight AI</strong> is an enterprise-grade content safety extension. It analyzes and moderates web pages in real-time, blocking visual and textual safety violations.
          </p>
          <p>
            Using <strong>in-browser local ONNX WebAssembly engines</strong>, all analysis is performed locally on your device, ensuring maximum privacy and data safety.
          </p>
        </div>

        <div className="pt-3.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>BUILD: v1.0.0</span>
          <span>MV3 SECURE</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-slate-100 font-bold text-xs rounded transition-all border border-slate-700 shadow-sm"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
