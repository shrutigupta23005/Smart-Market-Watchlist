import React from 'react';
import { VolumeX } from 'lucide-react';

const SIGNAL_TYPES = [
  { id: 'volatility_spike', label: 'Volatility Spikes without Direction', desc: 'Mute erratic intraday whipsaws that have small net change' },
  { id: 'slow_drift', label: 'Slow Drift Signals', desc: 'Mute gradual routine drift on low volume' },
  { id: 'momentum', label: 'Standard Momentum Continuations', desc: 'Mute ordinary follow-through on established trends' }
];

export default function MutedSignalsSettings({ mutedSignals = [], onToggleMute }) {
  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <VolumeX className="w-4 h-4 text-amber-400" />
        <span>Muted Signal Types</span>
      </div>
      <p className="text-xs text-slate-400">
        Suppress specific categories of changes across your entire watchlist.
      </p>

      <div className="space-y-2.5 pt-1">
        {SIGNAL_TYPES.map((type) => {
          const isMuted = mutedSignals.includes(type.id);
          return (
            <div
              key={type.id}
              onClick={() => onToggleMute(type.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                isMuted
                  ? 'bg-rose-950/20 border-rose-800/60 text-slate-200'
                  : 'bg-[#171E27]/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={isMuted}
                readOnly
                className="mt-0.5 accent-rose-500 rounded"
              />
              <div>
                <div className={`text-xs font-semibold ${isMuted ? 'text-rose-300' : 'text-slate-300'}`}>
                  {type.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{type.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
