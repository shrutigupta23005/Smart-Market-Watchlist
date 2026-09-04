import React from 'react';
import { Sparkles, Shield, Flame, Leaf, Loader2 } from 'lucide-react';

export default function ScenarioSwitcherBar({ currentScenario, onSwitch, loading }) {
  const isChanges = currentScenario === 'rich_signals' || currentScenario === 'changes';

  return (
    <div className="bg-[#10151C] border border-slate-800/90 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                SIGNAL Product State Demo
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                1-Click Toggle
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isChanges
                ? 'Active State: Volatility breakout, trend reversal & sector divergence triggered.'
                : 'Silence State: Market moved within historical noise bounds; zero alerts triggered.'}
            </p>
          </div>
        </div>

        {/* Segmented control */}
        <div className="flex items-center bg-[#171E27] p-1 rounded-xl border border-slate-800 gap-1 self-start sm:self-auto">
          <button
            type="button"
            disabled={loading}
            onClick={() => onSwitch('rich_signals')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isChanges
                ? 'bg-rose-950 text-rose-300 border border-rose-800/80 shadow-md shadow-rose-950/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {loading && isChanges ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
            ) : (
              <Flame className={`w-3.5 h-3.5 ${isChanges ? 'text-rose-400' : 'text-slate-500'}`} />
            )}
            <span>Changes (Active)</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onSwitch('nothing_happened')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              !isChanges
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-md shadow-emerald-950/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {loading && !isChanges ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Leaf className={`w-3.5 h-3.5 ${!isChanges ? 'text-emerald-400' : 'text-slate-500'}`} />
            )}
            <span>Silence (Calm)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
