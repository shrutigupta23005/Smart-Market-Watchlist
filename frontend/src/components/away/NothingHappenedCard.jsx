import React from 'react';
import { ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';

export default function NothingHappenedCard({ totalStocks = 0, awayDuration, streakCount = 1, onAcknowledge }) {
  return (
    <div className="bg-[#12171E] border border-slate-800/90 rounded-2xl p-8 sm:p-12 text-center space-y-6">
      {/* Calm emblem */}
      <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto">
        <CheckCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <span className="text-[11px] uppercase tracking-widest font-mono text-emerald-400 font-semibold">
          Silence is a feature
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-slate-100 tracking-tight">
          You didn't miss anything important.
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          None of the {totalStocks} stocks on your watchlist crossed any meaningful volatility, reversal, or divergence thresholds while you were away. Routine price ticks stayed within expected boundaries.
        </p>
      </div>

      {/* Trust Meter / Attention Streak */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171E27] border border-slate-800 text-xs font-mono text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>
          Attention Streak: <strong className="text-emerald-400">{streakCount} check-in{streakCount > 1 ? 's' : ''} in a row</strong> with zero noise.
        </span>
      </div>

      {/* Session update action */}
      {onAcknowledge && (
        <div className="pt-2">
          <button
            onClick={onAcknowledge}
            className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-mono text-slate-300 border border-slate-700/60 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mark session seen · Take fresh snapshot</span>
          </button>
        </div>
      )}
    </div>
  );
}
