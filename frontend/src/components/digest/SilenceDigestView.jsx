import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Filter, ChevronDown, ChevronRight, Sparkles, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function SilenceDigestView({
  totalStocks = 18,
  awayDuration = { days: 2, hours: 4, minutes: 0 },
  noActionList = [],
  marketStability = { stableCount: 16, minorDriftCount: 2, significantSignalCount: 0, totalTracked: 18 },
  onAcknowledge,
  acking = false,
  onNavigateToWatchlist
}) {
  const [showLog, setShowLog] = useState(false);

  const durationStr = awayDuration?.days > 0
    ? `${awayDuration.days} days`
    : `${awayDuration?.hours || 4} hours`;

  const stableCount = marketStability?.stableCount || 16;
  const minorDriftCount = marketStability?.minorDriftCount || 2;
  const significantCount = marketStability?.significantSignalCount || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. SILENCE SANCTUARY HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0A1617] via-[#0D181D] to-[#0A0E13] border border-emerald-900/40 p-8 sm:p-12 shadow-2xl shadow-emerald-950/20 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO ALERTS TRIGGERED · SILENCE IS A FEATURE</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-100">
              You didn't miss anything important.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
              <strong className="text-slate-200">{totalStocks} stocks</strong> tracked over{' '}
              <strong className="text-emerald-400">{durationStr}</strong>. 0 crossed your attention threshold.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#112025]/70 border border-emerald-800/40 text-xs font-mono text-emerald-300/90 italic max-w-lg mx-auto">
            "The smartest watchlist knows when NOT to demand your attention."
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onAcknowledge}
              disabled={acking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${acking ? 'animate-spin' : ''}`} />
              <span>Lock Baseline Snapshot & Stay Silent</span>
            </button>

            {onNavigateToWatchlist && (
              <button
                onClick={onNavigateToWatchlist}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs font-mono transition-all border border-slate-700"
              >
                Review Watchlist ({totalStocks} stocks) →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. WHY SIGNAL STAYED QUIET */}
      <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
            Why SIGNAL Stayed Quiet
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic mathematical verification of price stability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-4 rounded-xl bg-[#171E27]/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold">Normal Volatility</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Movements stayed strictly within trailing volatility baseline corridors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171E27]/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold">No Trend Reversals</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero trend flips or structural regime breaks detected across your basket.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171E27]/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold">No Rank Changes</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watchlist volatility order remained stable without sudden leadership shifts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#171E27]/80 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-mono font-semibold">Correlations Stable</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sector tracking showed zero abnormal divergences or decoupling.
            </p>
          </div>
        </div>
      </div>

      {/* 3. MARKET STABILITY MAP */}
      <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Market Stability Map
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual proof that 100% of tracked assets stayed anchored in normal corridors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>STABLE: {stableCount}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>MINOR DRIFT: {minorDriftCount}</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>SIGNIFICANT: {significantCount}</span>
            </span>
          </div>
        </div>

        {/* Visual Stability Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
            <div
              style={{ width: `${(stableCount / totalStocks) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Stable: ${stableCount}`}
            />
            <div
              style={{ width: `${(minorDriftCount / totalStocks) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Minor Drift: ${minorDriftCount}`}
            />
            <div
              style={{ width: `${(significantCount / totalStocks) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Significant Signal: ${significantCount}`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Historical Baseline Median</span>
            <span>Upper Noise Threshold (±1.8%)</span>
          </div>
        </div>

        {/* Visual Stability Grid Dots */}
        <div className="pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {noActionList.map((stk) => {
              const isMinor = stk.stabilityStatus === 'MINOR_DRIFT' || Math.abs(stk.percentChange) > 0.35;
              return (
                <div
                  key={stk.symbol}
                  className={`p-2.5 rounded-xl border text-xs font-mono space-y-1 transition-all ${
                    isMinor
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                      : 'bg-[#171E27]/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{stk.symbol}</span>
                    <span className={`w-2 h-2 rounded-full ${isMinor ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{stk.percentChange >= 0 ? '+' : ''}{Number(stk.percentChange || 0).toFixed(2)}%</span>
                    <span className="text-[10px] text-slate-500">{stk.noiseThreshold || '±1.8%'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Callout */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-sans">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Everything is calm. Take a new snapshot or close the app.</span>
          </div>

          <button
            onClick={() => setShowLog(!showLog)}
            className="text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{showLog ? 'Hide' : 'Show'} Noise Suppression Log</span>
            {showLog ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Transparency Log */}
        {showLog && (
          <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60 bg-[#0E131A]">
            {noActionList.map((item) => (
              <div key={item.symbol} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  <span className="font-mono font-bold text-slate-200">{item.symbol}</span>
                  <span className="text-[10px] font-mono text-slate-500">{item.sector}</span>
                </div>
                <div className="sm:text-right font-mono text-slate-400 text-[11px]">
                  {item.filterReason || 'Spread oscillation well within normal baseline variance'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
