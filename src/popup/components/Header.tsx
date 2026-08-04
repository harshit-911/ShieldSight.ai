import React from 'react';

interface HeaderProps {
  protectionEnabled: boolean;
  onToggleProtection: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ protectionEnabled, onToggleProtection }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base shadow-sm">
          🛡️
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
            ShieldSight AI <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">v1.0</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                protectionEnabled ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-400">
              {protectionEnabled ? 'SHIELD ACTIVE' : 'PROTECTION PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Master Protection Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={protectionEnabled}
        onClick={() => onToggleProtection(!protectionEnabled)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          protectionEnabled ? 'bg-emerald-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
            protectionEnabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </header>
  );
};
