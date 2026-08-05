'use client';

import { Sparkles, Bug, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { GitHubReleaseInfo } from '../services/githubRelease';

interface ReleaseNotesProps {
  releaseInfo: GitHubReleaseInfo;
}

export function ReleaseNotes({ releaseInfo }: ReleaseNotesProps) {
  const newFeatures = [
    'On-Device Multimodal AI Moderation Engine (OpenNSFW2 & Violence Vision models)',
    'Indian Language Normalization Engine (Hinglish & Romanized Hindi profanity detection)',
    'Tesseract WASM Offline OCR image text scanning',
    'Real-time WhatsApp Web conversation queue and obscuring overlay',
    'Manifest V3 offscreen document WebAssembly runtime',
  ];

  const bugFixes = [
    'Fixed Chrome CSS filter blur rendering limitation on inline span elements',
    'Fixed offscreen document initialization race condition with 6-attempt retry handshake',
    'Expanded WhatsApp Web bubble and container query selectors',
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#0D1322] border border-slate-800/80 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">Release Notes</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
                {releaseInfo.version}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-500" />
                {releaseInfo.tagName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {releaseInfo.releaseDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Features List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          New Features
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300 pl-5 list-disc leading-relaxed">
          {newFeatures.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Bug Fixes List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Bug className="w-3.5 h-3.5 text-emerald-400" />
          Bug Fixes & Improvements
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400 pl-5 list-disc leading-relaxed">
          {bugFixes.map((fix, i) => (
            <li key={i}>{fix}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
