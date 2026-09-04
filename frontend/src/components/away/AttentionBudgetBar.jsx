import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

export default function AttentionBudgetBar({
  mustSeeCount = 0,
  worthCheckingCount = 0,
  noActionCount = 0,
  estimatedSeconds = 10,
  streakCount = 0
}) {
  const formatEstimate = (sec) => {
    if (sec < 60) return `~${sec} sec`;
    const min = Math.ceil(sec / 60);
    return `~${min} min`;
  };

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Three Quiet Counters */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171E27] border border-slate-800">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-mono font-bold text-rose-400">{mustSeeCount}</span>
          <span className="text-[11px] font-mono uppercase text-slate-400">Must See</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171E27] border border-slate-800">
          <span className="text-sm">👀</span>
          <span className="text-xs font-mono font-bold text-amber-400">{worthCheckingCount}</span>
          <span className="text-[11px] font-mono uppercase text-slate-400">Worth Checking</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171E27] border border-slate-800">
          <span className="text-sm">😌</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{noActionCount}</span>
          <span className="text-[11px] font-mono uppercase text-slate-400">No Action</span>
        </div>
      </div>

      {/* Reading Time & Streak Badge */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatEstimate(estimatedSeconds)} to review</span>
        </div>

        {streakCount > 0 && (
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/60" title="Check-ins in a row with zero false alarms">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{streakCount} clean check-in{streakCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
