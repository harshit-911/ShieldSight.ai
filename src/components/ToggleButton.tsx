import React from 'react';

interface ToggleButtonProps {
  isEnabled: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isEnabled,
  onToggle,
  isLoading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      className={`
        w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg
        flex items-center justify-center gap-2 cursor-pointer border
        active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        ${
          isEnabled
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50 shadow-emerald-950/40'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 shadow-slate-950/40'
        }
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      <span>Toggle Protection</span>
    </button>
  );
};
