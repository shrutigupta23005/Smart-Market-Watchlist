import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosClient from '../api/axiosClient';
import QuietHoursSettings from '../components/settings/QuietHoursSettings';
import MutedSignalsSettings from '../components/settings/MutedSignalsSettings';
import { Sliders, BellOff, Moon, Check, Loader2, ShieldCheck, VolumeX, Info } from 'lucide-react';

export default function SettingsPage() {
  const { user, updatePreferences } = useAuth();
  const [threshold, setThreshold] = useState(user?.preferences?.attentionThreshold ?? 70);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(user?.preferences?.quietHours?.enabled ?? false);
  const [quietStart, setQuietStart] = useState(user?.preferences?.quietHours?.start || '22:00');
  const [quietEnd, setQuietEnd] = useState(user?.preferences?.quietHours?.end || '08:00');
  const [digestModeDefault, setDigestModeDefault] = useState(user?.preferences?.digestModeDefault ?? false);
  const [mutedSignals, setMutedSignals] = useState(user?.preferences?.mutedSignals || []);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [feedbackSummary, setFeedbackSummary] = useState(null);

  useEffect(() => {
    const fetchTuning = async () => {
      try {
        const res = await axiosClient.get('/feedback/summary');
        if (res.success) {
          setFeedbackSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load feedback summary:', err);
      }
    };
    fetchTuning();
  }, []);

  const toggleMute = (id) => {
    if (mutedSignals.includes(id)) {
      setMutedSignals(mutedSignals.filter((s) => s !== id));
    } else {
      setMutedSignals([...mutedSignals, id]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updatePreferences({
        attentionThreshold: Number(threshold),
        mutedSignals,
        quietHours: {
          start: quietStart,
          end: quietEnd,
          enabled: quietHoursEnabled
        },
        digestModeDefault
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-100 font-mono">Settings & Sensitivity</h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune how SIGNAL preserves your attention. The system only gets quieter over time, never louder.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Attention Threshold Slider */}
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Attention Threshold ({threshold}/100)</span>
          </div>
          <p className="text-xs text-slate-400">
            Scores ≥ <span className="text-rose-400 font-semibold">{threshold}</span> trigger{' '}
            <span className="text-rose-400 font-semibold">MUST SEE</span> alerts. Moderate moves stay in{' '}
            <span className="text-amber-400 font-semibold">WORTH CHECKING</span> (40–{threshold - 1}).
          </p>

          <div className="pt-2">
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>50 (Sensitive)</span>
              <span className="text-cyan-400 font-semibold">{threshold} (Selected)</span>
              <span>90 (Maximum Silence)</span>
            </div>
          </div>
        </div>

        {/* 2. Quiet Hours */}
        <QuietHoursSettings
          enabled={quietHoursEnabled}
          onToggle={setQuietHoursEnabled}
          start={quietStart}
          onStartChange={setQuietStart}
          end={quietEnd}
          onEndChange={setQuietEnd}
        />

        {/* 3. Muted Signal Types */}
        <MutedSignalsSettings
          mutedSignals={mutedSignals}
          onToggleMute={toggleMute}
        />

        {/* 4. Default Digest Mode */}
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <BellOff className="w-4 h-4 text-cyan-400" />
              <span>Default to Digest Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={digestModeDefault}
                onChange={(e) => setDigestModeDefault(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400">
            Always open the dashboard in collapsed single-sentence TL;DR mode.
          </p>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <Check className="w-4 h-4" /> Preferences saved
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Preferences
          </button>
        </div>
      </form>

      {/* 5. Personalization Learning Transparency (Inspectable Multipliers) */}
      {feedbackSummary && feedbackSummary.quietedSymbols?.length > 0 && (
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Learned Personal Sensitivity Adjustments</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transparent lookups derived from your explicit "not useful" alert feedback. SIGNAL automatically turned down sensitivity on these assets:
          </p>

          <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-lg overflow-hidden bg-[#171E27]/40">
            {feedbackSummary.quietedSymbols.map((item) => (
              <div key={item.symbol} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-200">{item.symbol}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.reason}</div>
                </div>
                <div className="font-mono text-right">
                  <div className="text-cyan-400 font-semibold">{item.multiplier}x multiplier</div>
                  <div className="text-[10px] text-slate-500">{item.count} dismissed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
