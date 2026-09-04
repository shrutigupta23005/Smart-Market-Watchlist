import React from 'react';
import { ShieldCheck, Filter, Clock, Sparkles } from 'lucide-react';

export default function AttentionBudgetSection({
  totalTracked = 18,
  filteredNoise = 14,
  worthAttention = 4,
  mustSeeCount = 2,
  worthCheckingCount = 2,
  estimatedSeconds = 45
}) {
  const noisePercent = totalTracked > 0 ? Math.round((filteredNoise / totalTracked) * 100) : 78;
  const estimatedMinutesSaved = Math.max(5, Math.round((totalTracked * 45) / 60));

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Section 2 · Attention Budget & Noise Reduction
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            SIGNAL quantifies the exact value of noise filtering: Only what matters reaches your eyes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
            {noisePercent}% noise filtered out
          </span>
        </div>
      </div>

      {/* 3 Metric Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#171E27]/70 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">You Tracked</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{totalTracked} stocks</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Full active watchlist size</div>
        </div>

        <div className="bg-[#171E27]/70 border border-emerald-900/40 p-4 rounded-xl">
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Filtered as Noise</div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">{filteredNoise} stocks</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Suppressed routine fluctuations</div>
        </div>

        <div className="bg-[#171E27]/70 border border-rose-900/40 p-4 rounded-xl">
          <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">Worth Your Attention</div>
          <div className="text-2xl font-bold font-mono text-rose-300 mt-1">{worthAttention} stocks</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{mustSeeCount} Must See · {worthCheckingCount} Worth Checking</div>
        </div>
      </div>

      {/* Visual Noise Filtering Progress Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Attention Filter Distribution:</span>
          <span className="text-slate-300">
            <strong className="text-rose-300">{mustSeeCount}</strong> Must See ·{' '}
            <strong className="text-amber-300">{worthCheckingCount}</strong> Worth Checking ·{' '}
            <strong className="text-emerald-400">{filteredNoise}</strong> Quiet
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div
            style={{ width: `${(mustSeeCount / totalTracked) * 100}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Must See: ${mustSeeCount}`}
          />
          <div
            style={{ width: `${(worthCheckingCount / totalTracked) * 100}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Worth Checking: ${worthCheckingCount}`}
          />
          <div
            style={{ width: `${(filteredNoise / totalTracked) * 100}%` }}
            className="bg-emerald-600/80 transition-all duration-500"
            title={`Filtered Noise: ${filteredNoise}`}
          />
        </div>
      </div>

      {/* Key Takeaway Message Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-cyan-200">
            Instead of reviewing {totalTracked} stocks, start with these {worthAttention}.
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>~{estimatedSeconds}s review · ~{estimatedMinutesSaved} min saved</span>
        </div>
      </div>
    </div>
  );
}
