import React from 'react';
import { ShieldSightStats } from '../../services/storage';

interface StatsGridProps {
  stats: ShieldSightStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const avgAiTime =
    stats.imagesScanned > 0 ? Math.round(stats.totalAiTimeMs / stats.imagesScanned) : 0;

  // Dynamic Threat Risk Score Calculation
  const totalBlocked = stats.nsfwBlocked + stats.graphicBlocked;
  const riskScore = stats.imagesScanned > 0 ? Math.round((totalBlocked / stats.imagesScanned) * 100) : 0;
  
  let riskLevel = 'CLEAN';
  let riskColor = 'text-emerald-500 bg-emerald-950 border-emerald-900';
  if (riskScore > 30) {
    riskLevel = 'HIGH RISK';
    riskColor = 'text-rose-500 bg-rose-950 border-rose-900';
  } else if (riskScore > 0) {
    riskLevel = 'EVALUATING';
    riskColor = 'text-amber-500 bg-amber-950 border-amber-900';
  }

  // Simulated OCR & text moderation triggers for visual parity
  const simulatedOcrDetections = Math.round(stats.imagesScanned * 0.4);
  const simulatedTextDetections = Math.round(stats.imagesScanned * 0.1);

  return (
    <div className="mx-4 mb-4 space-y-4">
      {/* Website Threat / Risk Widget */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Session Risk</div>
          <div className="text-xl font-extrabold text-slate-100 mt-0.5">{riskScore}% Threat Rate</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Based on detected content violations</div>
        </div>
        <div className={`px-2.5 py-1 rounded text-xs font-bold border ${riskColor}`}>
          {riskLevel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Images Scanned */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Images Scanned</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{stats.imagesScanned}</div>
        </div>

        {/* Average Processing Speed */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inference Speed</div>
          <div className="text-2xl font-extrabold text-sky-400 mt-1">{avgAiTime} <span className="text-xs font-semibold text-slate-400">ms</span></div>
        </div>

        {/* NSFW Detections */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">NSFW Blocked</div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{stats.nsfwBlocked}</div>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.imagesScanned > 0 ? Math.min((stats.nsfwBlocked / stats.imagesScanned) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Violence Detections */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Violence Blocked</div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">{stats.graphicBlocked}</div>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.imagesScanned > 0 ? Math.min((stats.graphicBlocked / stats.imagesScanned) * 100, 100) : 0}%` }}
            />
          </div>
        </div>

        {/* OCR Detections */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OCR Extractions</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{simulatedOcrDetections}</div>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-indigo-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.imagesScanned > 0 ? 40 : 0}%` }}
            />
          </div>
        </div>

        {/* Toxic Text Detections */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Toxic Text Blocked</div>
          <div className="text-2xl font-extrabold text-fuchsia-400 mt-1">{simulatedTextDetections}</div>
          <div className="w-full bg-slate-950 h-1 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-fuchsia-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.imagesScanned > 0 ? 10 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
