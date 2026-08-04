import React from 'react';

interface StatusBadgeProps {
  isEnabled: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isEnabled }) => {
  return (
    <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 my-3 text-center shadow-inner">
      <span className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
        Status:
      </span>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700">
        <span className="text-base leading-none">
          {isEnabled ? '🟢' : '🔴'}
        </span>
        <span className={`text-sm font-semibold ${isEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isEnabled ? 'Protection Enabled' : 'Protection Disabled'}
        </span>
      </div>
    </div>
  );
};
