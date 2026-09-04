import React, { useState } from 'react';
import { Flame, Sparkles, RefreshCw, History, Eye, ArrowRight, ChevronDown, ChevronRight, SlidersHorizontal, Check } from 'lucide-react';
import SignalCard from '../signals/SignalCard';
import GroupedSignalCard from '../signals/GroupedSignalCard';
import AttentionBudgetBar from './AttentionBudgetBar';
import DigestMode from './DigestMode';
import { formatPrice } from '../../utils/formatters';

export default function ChangesScenarioView({
  awayDuration = { days: 2, hours: 4, minutes: 0 },
  mustSee = [],
  worthChecking = [],
  noAction = [],
  groupedSignals = [],
  digestMode = false,
  onToggleDigestMode,
  onAcknowledge,
  acking = false,
  submitFeedback,
  onOpenReplay,
  onSwitchToSilence,
  user
}) {
  const [showNoAction, setShowNoAction] = useState(false);
  const totalMeaningful = mustSee.length + worthChecking.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HERO ACTIVE STATE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E1217] via-[#1A1218] to-[#12171E] border border-rose-900/40 p-8 sm:p-10 shadow-2xl shadow-rose-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-700/60 text-rose-300 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>MARKET VOLATILITY DETECTED · {totalMeaningful} MEANINGFUL SHIFTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-100">
              While you were away,{' '}
              <span className="font-semibold text-rose-300 underline decoration-rose-500/40">
                {totalMeaningful} things changed meaningfully
              </span>.
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Your watchlist had {mustSee.length + worthChecking.length + noAction.length} stocks across{' '}
              <strong className="text-slate-200">
                {awayDuration?.days > 0 ? `${awayDuration.days}d ` : ''}
                {awayDuration?.hours || 2}h {awayDuration?.minutes || 4}m
              </strong>. 
              Routine movements were filtered out as noise. Only assets that broke historical baseline thresholds demand your review.
            </p>
          </div>

          {/* Quick Action Button Box */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onAcknowledge}
              disabled={acking}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 disabled:opacity-50"
              title="Saves current prices as your new baseline and resets to Silence"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${acking ? 'animate-spin' : ''}`} />
              <span>Mark Seen / Take New Snapshot</span>
            </button>

            <button
              onClick={() => onOpenReplay && onOpenReplay('ALL')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs font-mono transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timeline Scrub Replay</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ATTENTION BUDGET STRIP */}
      <AttentionBudgetBar
        mustSeeCount={mustSee.length}
        worthCheckingCount={worthChecking.length}
        noActionCount={noAction.length}
        estimatedSeconds={45}
        streakCount={0}
      />

      {/* 3. DIGEST MODE CONTROLLER */}
      <DigestMode
        enabled={digestMode}
        onToggle={onToggleDigestMode}
        mustSee={mustSee}
        worthChecking={worthChecking}
        nothingHappened={false}
      />

      {/* 4. CHRONOLOGICAL EVENT STREAM PREVIEW */}
      <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Market Replay Timeline (What occurred while you were gone)
            </h3>
          </div>
          <button
            onClick={() => onOpenReplay && onOpenReplay('ALL')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Interactive Scrubber</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#171E27]/80 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-rose-400 font-bold">10:15 AM · Breakout</span>
              <span className="text-slate-500">TATAMOTORS</span>
            </div>
            <p className="text-xs text-slate-300">
              Broke above 20-period baseline with 2.8x volume expansion.
            </p>
          </div>

          <div className="bg-[#171E27]/80 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-400 font-bold">11:30 AM · Sector Echo</span>
              <span className="text-slate-500">IT SECTOR</span>
            </div>
            <p className="text-xs text-slate-300">
              Infosys joined broad IT sector rally (+2.1% peer co-movement).
            </p>
          </div>

          <div className="bg-[#171E27]/80 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-400 font-bold">01:45 PM · Reversal</span>
              <span className="text-slate-500">HDFCBANK</span>
            </div>
            <p className="text-xs text-slate-300">
              Reversed downward against positive bank index (+0.2%).
            </p>
          </div>
        </div>
      </div>

      {/* 5. PRIMARY SIGNAL SECTIONS */}
      {digestMode ? (
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-slate-300">
            Digest mode is active. Detailed cards are collapsed to protect your attention.
          </p>
          <button
            onClick={() => onToggleDigestMode && onToggleDigestMode(false)}
            className="px-4 py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 text-xs font-mono text-cyan-300 transition-colors"
          >
            Expand All {totalMeaningful} Cards
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTOR ECHO / GROUPED SIGNALS SECTION */}
          {groupedSignals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-indigo-900/40 pb-2">
                <span className="text-sm">⚡</span>
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-indigo-300">
                  Sector Echo · Correlated Moves ({groupedSignals.length})
                </h3>
                <span className="text-xs text-slate-500 ml-auto font-mono">
                  Collapsed multi-stock co-movement
                </span>
              </div>

              <div className="space-y-4">
                {groupedSignals.map((grp) => (
                  <GroupedSignalCard
                    key={grp.groupId}
                    group={grp}
                    onFeedback={submitFeedback}
                  />
                ))}
              </div>
            </div>
          )}

          {/* MUST SEE SECTION */}
          {mustSee.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-rose-900/40 pb-2">
                <span className="text-sm">🔥</span>
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-rose-300">
                  Must See ({mustSee.length})
                </h3>
                <span className="text-xs text-slate-500 ml-auto font-mono">
                  Attention Score ≥ {user?.preferences?.attentionThreshold || 70}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mustSee.map((signal) => (
                  <SignalCard
                    key={signal.symbol}
                    signal={signal}
                    onFeedback={submitFeedback}
                    onOpenReplay={(sym) => onOpenReplay && onOpenReplay(sym)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* WORTH CHECKING SECTION */}
          {worthChecking.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-900/40 pb-2">
                <span className="text-sm">👀</span>
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-amber-300">
                  Worth Checking ({worthChecking.length})
                </h3>
                <span className="text-xs text-slate-500 ml-auto font-mono">
                  Moderate deviations (Score 40–69)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {worthChecking.map((signal) => (
                  <SignalCard
                    key={signal.symbol}
                    signal={signal}
                    onFeedback={submitFeedback}
                    onOpenReplay={(sym) => onOpenReplay && onOpenReplay(sym)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* NO ACTION SECTION (Collapsed by default) */}
          {noAction.length > 0 && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#12171E]/40">
              <button
                onClick={() => setShowNoAction(!showNoAction)}
                className="w-full px-5 py-3 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span>
                  😌 {noAction.length} stock{noAction.length > 1 ? 's' : ''} had no meaningful changes (noise suppressed)
                </span>
                {showNoAction ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {showNoAction && (
                <div className="p-4 border-t border-slate-800 divide-y divide-slate-800/60">
                  {noAction.map((stock) => (
                    <div key={stock.symbol} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-300">{stock.symbol}</span>
                        <span className="text-slate-500">· {stock.name}</span>
                      </div>
                      <div className="text-right font-mono text-slate-400">
                        <span>{stock.filterReason || 'No meaningful change'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
