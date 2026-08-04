import React from 'react';
import { SensitivityLevel } from '../../services/storage';

interface SettingsPanelProps {
  nsfwEnabled: boolean;
  violenceEnabled: boolean;
  presentationModeEnabled: boolean;
  nsfwSensitivity: SensitivityLevel;
  violenceSensitivity: SensitivityLevel;
  onToggleNsfw: (enabled: boolean) => void;
  onToggleViolence: (enabled: boolean) => void;
  onTogglePresentationMode: (enabled: boolean) => void;
  onChangeNsfwSensitivity: (level: SensitivityLevel) => void;
  onChangeViolenceSensitivity: (level: SensitivityLevel) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  nsfwEnabled,
  violenceEnabled,
  presentationModeEnabled,
  nsfwSensitivity,
  violenceSensitivity,
  onToggleNsfw,
  onToggleViolence,
  onTogglePresentationMode,
  onChangeNsfwSensitivity,
  onChangeViolenceSensitivity,
}) => {
  const levels: SensitivityLevel[] = ['low', 'medium', 'high'];

  const renderSegmentedControl = (
    current: SensitivityLevel,
    onChange: (lvl: SensitivityLevel) => void,
    disabled: boolean
  ) => (
    <div className={`flex p-1 rounded bg-slate-950 border border-slate-850 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {levels.map((lvl) => {
        const active = current === lvl;
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange(lvl)}
            className={`flex-1 py-1 text-[10px] font-bold rounded capitalize tracking-wide transition-all ${
              active
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {lvl}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-4 mb-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Active Security Policies
      </div>

      {/* NSFW Policy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={nsfwEnabled}
              onChange={(e) => onToggleNsfw(e.target.checked)}
              className="rounded bg-slate-950 border-slate-850 text-indigo-600 focus:ring-slate-900 w-4 h-4"
            />
            <span>NSFW Filter Policy</span>
          </label>
          <span className="text-[10px] text-slate-500 font-mono">
            {nsfwSensitivity === 'low' ? 't=0.8' : nsfwSensitivity === 'medium' ? 't=0.6' : 't=0.4'}
          </span>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">Model Sensitivity</div>
          {renderSegmentedControl(nsfwSensitivity, onChangeNsfwSensitivity, !nsfwEnabled)}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Violence Policy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
            <input
              type="checkbox"
              checked={violenceEnabled}
              onChange={(e) => onToggleViolence(e.target.checked)}
              className="rounded bg-slate-950 border-slate-850 text-indigo-600 focus:ring-slate-900 w-4 h-4"
            />
            <span>Graphic Violence Policy</span>
          </label>
          <span className="text-[10px] text-slate-500 font-mono">
            {violenceSensitivity === 'low' ? 't=0.8' : violenceSensitivity === 'medium' ? 't=0.6' : 't=0.4'}
          </span>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">Model Sensitivity</div>
          {renderSegmentedControl(violenceSensitivity, onChangeViolenceSensitivity, !violenceEnabled)}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Presentation Mode */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-400">
            <input
              type="checkbox"
              checked={presentationModeEnabled}
              onChange={(e) => onTogglePresentationMode(e.target.checked)}
              className="rounded bg-slate-950 border-slate-850 text-indigo-600 focus:ring-slate-900 w-4 h-4"
            />
            <span>Visual Pipeline Debugger</span>
          </label>
          <p className="text-[10px] text-slate-400 mt-0.5 ml-6">
            Displays real-time step HUD for live evaluation (3s overlay)
          </p>
        </div>
      </div>
    </div>
  );
};
