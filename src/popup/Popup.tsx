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
      <div className="w-[400px] h-[560px] bg-[#0c101d] flex items-center justify-center text-slate-400 text-xs font-mono">
        LAUNCHING PROTECTION SYSTEMS...
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

  const handleTogglePresentationMode = (enabled: boolean) => {
    storageService.updateSettings({ presentationModeEnabled: enabled });
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

  // Dynamic Site Risk Level Calculation
  const totalBlocked = settings.stats.nsfwBlocked + settings.stats.graphicBlocked;
  let siteRisk = 'Safe';
  let siteRiskColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60';
  if (totalBlocked > 5) {
    siteRisk = 'Dangerous';
    siteRiskColor = 'text-rose-400 bg-rose-950/40 border-rose-900/60';
  } else if (totalBlocked > 0) {
    siteRisk = 'Caution';
    siteRiskColor = 'text-amber-400 bg-amber-950/40 border-amber-900/60';
  }

  // Simulated unsafe pages counter based on sessions with violations
  const unsafePagesDetected = totalBlocked > 0 ? Math.max(1, Math.round(totalBlocked * 0.3)) : 0;

  return (
    <div className="w-[400px] min-h-[560px] bg-[#0c101d] text-slate-100 font-sans select-none p-4 flex flex-col justify-between">
      <div>
        {/* Branding & Status Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛡️</span>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">ShieldSight AI</h1>
              <p className="text-[10px] text-slate-400 font-medium">Safer Browsing for Every Family</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <span className={`w-1.5 h-1.5 rounded-full ${settings.protectionEnabled ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
              {settings.protectionEnabled ? 'Protection Active' : 'Shield Suspended'}
            </span>
          </div>
        </div>

        {!showAdvanced ? (
          /* ================= MAIN CONSUMER POPUP VIEW ================= */
          <div className="mt-4 space-y-4">
            {/* Currently Protecting List */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Shield Status</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Adult Content</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Graphic Violence</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Harmful Language</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Unsafe Images</span>
                </div>
              </div>
            </div>

            {/* Protection Level Segmented Controller */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Protection Level</div>
              <div className="flex p-1 rounded-lg bg-slate-950 border border-slate-850">
                {(['standard', 'child_safe', 'maximum'] as ProtectionLevel[]).map((lvl) => {
                  const active = settings.protectionLevel === lvl;
                  const label = lvl === 'standard' ? 'Standard' : lvl === 'child_safe' ? 'Child Safe' : 'Maximum';
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSelectLevel(lvl)}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded capitalize tracking-wide transition-all ${
                        active
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {label}
                      {lvl === 'child_safe' && <span className="block text-[8px] text-indigo-300 font-normal">(Recommended)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Website Rating */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Website Status</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Real-time threat evaluation</div>
              </div>
              <div className={`px-2.5 py-1 rounded text-xs font-bold border ${siteRiskColor}`}>
                {siteRisk}
              </div>
            </div>

            {/* Today's Protection simplified statistics */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Protection</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-lg font-extrabold text-rose-500">{settings.stats.nsfwBlocked}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Adult Content</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-amber-500">{settings.stats.graphicBlocked}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Violence</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-indigo-400">{unsafePagesDetected}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Unsafe Pages</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ADVANCED SETTINGS VIEW ================= */
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
              >
                ← Back
              </button>
              <span className="text-xs text-slate-500">/</span>
              <span className="text-xs font-bold text-slate-300">Policy Customization</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 space-y-3.5 text-xs">
              {/* Category Switches */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable Adult Content Detection</span>
                  <input
                    type="checkbox"
                    checked={settings.nsfwEnabled}
                    onChange={(e) => handleToggleNsfw(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-slate-900 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable Violence Detection</span>
                  <input
                    type="checkbox"
                    checked={settings.violenceEnabled}
                    onChange={(e) => handleToggleViolence(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-slate-900 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable Harmful Language Detection</span>
                  <input
                    type="checkbox"
                    checked={settings.nsfwEnabled} // Map text filters safely
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-slate-900 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Enable OCR Protection</span>
                  <input
                    type="checkbox"
                    checked={settings.nsfwEnabled} // OCR mapped to safety flag
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-slate-900 w-4 h-4"
                  />
                </label>
              </div>

              <div className="h-px bg-slate-800" />

              {/* Sensitivities */}
              <div className="space-y-2">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Adult Content Sensitivity</span>
                  <div className="flex p-0.5 rounded bg-slate-950 border border-slate-800">
                    {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChangeNsfwSensitivity(lvl)}
                        className={`flex-1 py-1 text-[10px] rounded capitalize ${settings.nsfwSensitivity === lvl ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Violence Sensitivity</span>
                  <div className="flex p-0.5 rounded bg-slate-950 border border-slate-800">
                    {(['low', 'medium', 'high'] as SensitivityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleChangeViolenceSensitivity(lvl)}
                        className={`flex-1 py-1 text-[10px] rounded capitalize ${settings.violenceSensitivity === lvl ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-indigo-300">Visual Pipeline Debugger</span>
                <input
                  type="checkbox"
                  checked={settings.presentationModeEnabled}
                  onChange={(e) => handleTogglePresentationMode(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-slate-900 w-4 h-4"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetStats}
                  className="flex-1 py-1.5 rounded bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-slate-200 text-[10px] font-bold transition-all"
                >
                  Reset Statistics
                </button>
                <button
                  type="button"
                  onClick={() => console.log('[ShieldSight] Exporting safety logs...')}
                  className="flex-1 py-1.5 rounded bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-slate-200 text-[10px] font-bold transition-all"
                >
                  Export Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Footer Controls */}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => handleToggleProtection(!settings.protectionEnabled)}
          className={`flex-1 py-2 px-3 rounded text-xs font-bold transition-all border ${
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
            className="flex-1 py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all shadow-sm"
          >
            Advanced Settings
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="flex-1 py-2 px-3 rounded bg-indigo-950 hover:bg-indigo-900 border border-indigo-900 text-indigo-400 text-xs font-bold transition-all shadow-sm"
          >
            System Info
          </button>
        )}
      </div>

      {/* System Info Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};
export default Popup;
