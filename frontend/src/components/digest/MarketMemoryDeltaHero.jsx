import React from 'react';
import { RefreshCw, History, ArrowRight, Clock, Flame } from 'lucide-react';
import { formatSessionTime } from '../../utils/formatters';

export default function MarketMemoryDeltaHero({
  lastCheckedAt,
  currentTimestamp,
  awayDuration = { days: 2, hours: 4, minutes: 0 },
  meaningfulCount = 4,
  onAcknowledge,
  acking = false,
  onOpenReplay
}) {
  const lastCheckedFormatted = formatSessionTime(lastCheckedAt || new Date(Date.now() - (2 * 24 + 4) * 3600 * 1000));
  const currentFormatted = formatSessionTime(currentTimestamp || new Date());

  const durationString = awayDuration?.days > 0
    ? `${awayDuration.days} day${awayDuration.days > 1 ? 's' : ''}, ${awayDuration.hours || 0} hour${awayDuration.hours !== 1 ? 's' : ''}`
    : `${awayDuration?.hours || 0} hour${awayDuration?.hours !== 1 ? 's' : ''} ${awayDuration?.minutes || 0} min`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C1318] via-[#161219] to-[#0E131A] border border-rose-900/40 p-6 sm:p-10 shadow-2xl shadow-rose-950/20">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          {/* Market Memory Delta Comparison Bar */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>When you last checked:</span>
              <strong className="text-slate-200 font-semibold">{lastCheckedFormatted}</strong>
            </span>
            <span className="text-cyan-400 font-bold px-1">→</span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>Now:</span>
              <strong className="text-emerald-300 font-semibold">{currentFormatted}</strong>
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-800/60 ml-1">
              {durationString} away
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-100">
              Your watchlist changed in{' '}
              <span className="font-semibold text-rose-300 underline decoration-rose-500/40">
                {meaningfulCount} meaningful way{meaningfulCount !== 1 ? 's' : ''}
              </span>.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              SIGNAL compared your last seen snapshot against current market ticks. Routine fluctuations were filtered out; only actionable regime changes remain.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={onAcknowledge}
            disabled={acking}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 disabled:opacity-50"
            title="Saves current prices as your baseline snapshot and quiets alerts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${acking ? 'animate-spin' : ''}`} />
            <span>Mark Seen / Take New Snapshot</span>
          </button>

          <button
            onClick={() => onOpenReplay && onOpenReplay('ALL')}
            className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs font-mono transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Market Replay Timeline</span>
          </button>
        </div>
      </div>
    </div>
  );
}
