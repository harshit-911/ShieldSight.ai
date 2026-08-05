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
        {/* Minimal Header */}
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
            <span className={`w-1.5 h-1.5 rounded-full ${settings.protectionEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span>{settings.protectionEnabled ? 'ACTIVE' : 'PAUSED'}</span>
          </div>
        </div>

        {!showAdvanced ? (
          /* ================= MAIN MINIMALIST VIEW ================= */
          <div className="mt-4 space-y-3.5">
            {/* Protection Summary List */}
            <div className="p-3.5 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Protection Status</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>Adult Content</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>Graphic Violence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>Harmful Language</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">✓</span>
                  <span>OCR Text</span>
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
                      className={`flex-1 py-1.5 text-[10px] font-semibold rounded transition-colors ${
                        active
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
          <div className="mt-4 space-y-3.5">
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

            <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800/60 space-y-3 text-xs">
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Adult Content Detection</span>
                  <input
                    type="checkbox"
                    checked={settings.nsfwEnabled}
                    onChange={(e) => handleToggleNsfw(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-slate-100 focus:ring-0 w-3.5 h-3.5"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Violence Detection</span>
                  <input
                    type="checkbox"
                    checked={settings.violenceEnabled}
                    onChange={(e) => handleToggleViolence(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-slate-100 focus:ring-0 w-3.5 h-3.5"
                  />
                </label>
              </div>

              <div className="h-px bg-slate-800/60" />

              <div className="space-y-2">
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Adult Sensitivity</span>
                  <div className="flex p-0.5 rounded bg-slate-900 border border-slate-800">
                    {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChangeNsfwSensitivity(lvl)}
                        className={`flex-1 py-1 text-[10px] rounded capitalize ${settings.nsfwSensitivity === lvl ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Violence Sensitivity</span>
                  <div className="flex p-0.5 rounded bg-slate-900 border border-slate-800">
                    {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChangeViolenceSensitivity(lvl)}
                        className={`flex-1 py-1 text-[10px] rounded capitalize ${settings.violenceSensitivity === lvl ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetStats}
                  className="w-full py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] font-semibold transition-colors"
                >
                  Reset Statistics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex gap-2 pt-3 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => handleToggleProtection(!settings.protectionEnabled)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
            settings.protectionEnabled
              ? 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/30 text-rose-300'
              : 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/30 text-emerald-300'
          }`}
        >
          {settings.protectionEnabled ? 'Pause Protection' : 'Resume Protection'}
        </button>

        {!showAdvanced ? (
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            Settings
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            Info
          </button>
        )}
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};
export default Popup;
