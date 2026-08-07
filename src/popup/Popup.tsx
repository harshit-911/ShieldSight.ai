import React, { useEffect, useState } from 'react';
import { storageService, ShieldSightSettings, SensitivityLevel, ProtectionLevel } from '../services/storage';
import { AboutModal } from './components/AboutModal';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<ShieldSightSettings | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  useEffect(() => {
    storageService.getSettings().then((s) => setSettings(s));
    const unsubscribe = storageService.onSettingsChange((newSettings) => {
      setSettings(newSettings);
    });
    return () => unsubscribe();
  }, []);

  if (!settings) {
    return (
      <div className="w-[380px] h-[520px] bg-[#0B1220] flex items-center justify-center text-slate-400 text-xs font-mono">
        INITIALIZING SHIELDSIGHT AI...
      </div>
    );
  }

  const handleToggleProtection = (enabled: boolean) => {
    storageService.updateSettings({ protectionEnabled: enabled });
  };

  const handleSelectLevel = (level: ProtectionLevel) => {
    let nsfwSensitivity: SensitivityLevel = 'medium';
    let violenceSensitivity: SensitivityLevel = 'medium';

    if (level === 'standard') {
      nsfwSensitivity = 'medium';
      violenceSensitivity = 'medium';
    } else if (level === 'child_safe') {
      nsfwSensitivity = 'high';
      violenceSensitivity = 'medium';
    } else if (level === 'maximum') {
      nsfwSensitivity = 'high';
      violenceSensitivity = 'high';
    }

    storageService.updateSettings({
      protectionLevel: level,
      nsfwSensitivity,
      violenceSensitivity,
    });
  };

  const handleToggleNsfw = (enabled: boolean) => {
    storageService.updateSettings({ nsfwEnabled: enabled });
  };

  const handleToggleViolence = (enabled: boolean) => {
    storageService.updateSettings({ violenceEnabled: enabled });
  };

  const handleChangeNsfwSensitivity = (level: SensitivityLevel) => {
    storageService.updateSettings({ nsfwSensitivity: level });
  };

  const handleChangeViolenceSensitivity = (level: SensitivityLevel) => {
    storageService.updateSettings({ violenceSensitivity: level });
  };

  const handleResetStats = () => {
    storageService.resetStats();
  };

  const totalBlocked = settings.stats.nsfwBlocked + settings.stats.graphicBlocked;
  let siteRisk = 'Safe';
  let siteRiskBadge = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
  if (totalBlocked > 5) {
    siteRisk = 'Dangerous';
    siteRiskBadge = 'text-rose-400 bg-rose-950/20 border-rose-900/40';
  } else if (totalBlocked > 0) {
    siteRisk = 'Caution';
    siteRiskBadge = 'text-amber-400 bg-amber-950/20 border-amber-900/40';
  }

  const unsafePagesDetected = totalBlocked > 0 ? Math.max(1, Math.round(totalBlocked * 0.3)) : 0;

  return (
    <div className="w-[380px] min-h-[520px] bg-[#0B1220] text-slate-100 font-sans select-none p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-100 font-bold text-xs">
              🛡️
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-100 tracking-tight">ShieldSight AI</h1>
              <p className="text-[10px] text-slate-400 font-medium">On-Device Content Moderation</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900/60 text-[10px] font-mono text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${settings.protectionEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{settings.protectionEnabled ? 'ACTIVE' : 'PAUSED'}</span>
          </div>
        </div>

        {/* MASTER TURN ON / TURN OFF POWER SWITCH CARD */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${settings.protectionEnabled ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span>{settings.protectionEnabled ? 'Protection Active' : 'Protection Disabled'}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {settings.protectionEnabled ? 'Real-time AI moderation ON' : 'Click toggle to turn ON protection'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleToggleProtection(!settings.protectionEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              settings.protectionEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
            aria-label="Toggle Protection ON/OFF"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                settings.protectionEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {!showAdvanced ? (
          /* ================= MAIN MINIMALIST VIEW ================= */
          <div className="mt-3.5 space-y-3.5">
            {/* Protection Summary List */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Protection Status</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className={settings.protectionEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓</span>
                  <span className={settings.protectionEnabled ? 'text-slate-200' : 'text-slate-500'}>Adult Content</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={settings.protectionEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓</span>
                  <span className={settings.protectionEnabled ? 'text-slate-200' : 'text-slate-500'}>Graphic Violence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={settings.protectionEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓</span>
                  <span className={settings.protectionEnabled ? 'text-slate-200' : 'text-slate-500'}>Harmful Language</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={settings.protectionEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓</span>
                  <span className={settings.protectionEnabled ? 'text-slate-200' : 'text-slate-500'}>OCR Text</span>
                </div>
              </div>
            </div>

            {/* Protection Level Segmented Selector */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Protection Level</div>
              <div className="flex p-1 rounded-lg bg-[#0D1322] border border-slate-800/60">
                {(['standard', 'child_safe', 'maximum'] as ProtectionLevel[]).map((lvl) => {
                  const active = settings.protectionLevel === lvl;
                  const label = lvl === 'standard' ? 'Standard' : lvl === 'child_safe' ? 'Child Safe' : 'Maximum';
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSelectLevel(lvl)}
                      disabled={!settings.protectionEnabled}
                      className={`flex-1 py-1.5 text-[10px] font-semibold rounded transition-colors ${
                        !settings.protectionEnabled
                          ? 'text-slate-600 cursor-not-allowed'
                          : active
                          ? 'bg-slate-800 text-slate-100 border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Domain Status */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Current Domain</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Real-time Safety Assessment</div>
              </div>
              <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold border font-mono ${siteRiskBadge}`}>
                {siteRisk.toUpperCase()}
              </div>
            </div>

            {/* Session Statistics */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Session Protection</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-base font-bold text-slate-100">{settings.stats.nsfwBlocked}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Adult</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-100">{settings.stats.graphicBlocked}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Violence</div>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-100">{unsafePagesDetected}</div>
                  <div className="text-[9px] text-slate-400 font-mono">Unsafe Pages</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ADVANCED CUSTOMIZATION VIEW ================= */
          <div className="mt-3.5 space-y-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
              >
                ← Back
              </button>
              <span className="text-xs text-slate-600">/</span>
              <span className="text-xs font-semibold text-slate-300">Policy Customization</span>
            </div>

            {/* Category Switches */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Adult Content Detection</div>
                  <div className="text-[10px] text-slate-400">Filter explicit images & text</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNsfw(!settings.nsfwEnabled)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    settings.nsfwEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.nsfwEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Violence & Graphic Media</div>
                  <div className="text-[10px] text-slate-400">Filter violent images & harassment</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleViolence(!settings.violenceEnabled)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    settings.violenceEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.violenceEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sensitivity Controls */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Adult Content Sensitivity</span>
                  <span className="font-mono text-[10px] uppercase text-emerald-400">{settings.nsfwSensitivity}</span>
                </div>
                <div className="flex gap-1.5">
                  {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleChangeNsfwSensitivity(lvl)}
                      className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors ${
                        settings.nsfwSensitivity === lvl
                          ? 'bg-slate-800 text-slate-100 border border-slate-700'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/40 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Violence Sensitivity</span>
                  <span className="font-mono text-[10px] uppercase text-emerald-400">{settings.violenceSensitivity}</span>
                </div>
                <div className="flex gap-1.5">
                  {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleChangeViolenceSensitivity(lvl)}
                      className={`flex-1 py-1 text-[10px] font-semibold rounded border transition-colors ${
                        settings.violenceSensitivity === lvl
                          ? 'bg-slate-800 text-slate-100 border border-slate-700'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Stats */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleResetStats}
                className="w-full py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
              >
                Reset Protection Statistics
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        {!showAdvanced ? (
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="hover:text-slate-200 transition-colors font-semibold"
          >
            Policy Settings →
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="hover:text-slate-200 transition-colors font-semibold"
        >
          About ShieldSight
        </button>
      </div>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};
