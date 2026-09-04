import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAwaySummary } from '../hooks/useAwaySummary';
import WhileYouWereAway from '../components/away/WhileYouWereAway';
import AwayDurationBadge from '../components/away/AwayDurationBadge';
import AttentionBudgetBar from '../components/away/AttentionBudgetBar';
import DigestMode from '../components/away/DigestMode';
import NothingHappenedCard from '../components/away/NothingHappenedCard';
import SignalCard from '../components/signals/SignalCard';
import GroupedSignalCard from '../components/signals/GroupedSignalCard';
import WatchlistTable from '../components/watchlist/WatchlistTable';
import WatchlistHealthCard from '../components/insights/WatchlistHealthCard';
import MarketReplayTimeline from '../components/replay/MarketReplayTimeline';
import { Sparkles, ChevronRight, ChevronDown, RefreshCw, Moon, Loader2, History } from 'lucide-react';

export default function DashboardPage({ onNavigateToWatchlist }) {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { summary, loading, refreshSummary, ackSession, submitFeedback } = useAwaySummary();

  const [digestMode, setDigestMode] = useState(user?.preferences?.digestModeDefault ?? false);
  const [showNoAction, setShowNoAction] = useState(false);
  const [acking, setAcking] = useState(false);
  const [replayTarget, setReplayTarget] = useState(null); // symbol string or 'ALL' or null

  const handleAck = async () => {
    setAcking(true);
    await ackSession();
    setAcking(false);
  };

  if (loading && !summary) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500 font-mono text-sm gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Evaluating market changes since your last session...</span>
      </div>
    );
  }

  const {
    awayDuration,
    mustSee = [],
    worthChecking = [],
    noAction = [],
    groupedSignals = [],
    nothingHappened = false,
    estimatedReviewTimeSeconds = 10,
    quietHoursActive = false
  } = summary || {};

  return (
    <div className="space-y-8">
      {/* 1. Greeting Bar + Context */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800/80 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Market Memory</span>
            {quietHoursActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                <Moon className="w-3 h-3" /> Quiet Hours Active
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Welcome back, {user?.name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReplayTarget('ALL')}
            className="px-3 py-1.5 rounded-lg bg-[#171E27] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
            title="View chronological timeline of events across your watchlist"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Market Replay</span>
          </button>

          <button
            onClick={handleAck}
            disabled={acking}
            className="px-3 py-1.5 rounded-lg bg-[#171E27] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Saves current market state as your new baseline"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${acking ? 'animate-spin' : ''}`} />
            <span>Mark Seen / New Snapshot</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Component */}
      <WhileYouWereAway
        awayDuration={awayDuration}
        mustSeeCount={mustSee.length}
        worthCheckingCount={worthChecking.length}
        noActionCount={noAction.length}
        estimatedSeconds={estimatedReviewTimeSeconds}
        streakCount={nothingHappened ? 4 : 0}
        digestMode={digestMode}
        onToggleDigestMode={() => setDigestMode(!digestMode)}
        nothingHappened={nothingHappened}
        totalStocks={watchlist.length}
        onAcknowledge={handleAck}
        mustSee={mustSee}
        worthChecking={worthChecking}
      />

      {/* 5. Main Hero Body */}
      {nothingHappened ? (
        /* Calm Silence State */
        <NothingHappenedCard
          totalStocks={watchlist.length}
          awayDuration={awayDuration}
          streakCount={4}
          onAcknowledge={handleAck}
        />
      ) : digestMode ? (
        /* Collapsed TL;DR state */
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-slate-300">
            Digest mode is active. Detail cards are hidden to protect your attention.
          </p>
          <button
            onClick={() => setDigestMode(false)}
            className="px-4 py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 text-xs font-mono text-cyan-300 transition-colors"
          >
            Expand {mustSee.length + worthChecking.length} Changes
          </button>
        </div>
      ) : (
        /* Signal Cards Sections */
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
                  Score ≥ {user?.preferences?.attentionThreshold || 70}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mustSee.map((signal) => (
                  <SignalCard
                    key={signal.symbol}
                    signal={signal}
                    onFeedback={submitFeedback}
                    onOpenReplay={(sym) => setReplayTarget(sym)}
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
                    onOpenReplay={(sym) => setReplayTarget(sym)}
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
                  😌 {noAction.length} stock{noAction.length > 1 ? 's' : ''} had no meaningful changes
                </span>
                {showNoAction ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {showNoAction && (
                <div className="p-4 border-t border-slate-800 divide-y divide-slate-800/60">
                  {noAction.map((stock) => (
                    <div key={stock.symbol} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-300">{stock.symbol}</span>
                        <span className="text-slate-500">· {stock.name}</span>
                      </div>
                      <span className="font-mono text-slate-500">No meaningful change</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Watchlist Health Meta Insight */}
      <WatchlistHealthCard />

      {/* Full Watchlist Table at the bottom */}
      <div className="pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-200">Complete Watchlist</h2>
            <p className="text-xs text-slate-400">
              Always available reference with live data freshness indicators.
            </p>
          </div>
          <button
            onClick={onNavigateToWatchlist}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
          >
            + Add or remove stocks
          </button>
        </div>

        <WatchlistTable
          items={watchlist}
          onRemoveStock={removeFromWatchlist}
        />
      </div>

      {/* Market Replay Modal */}
      {replayTarget && (
        <MarketReplayTimeline
          symbol={replayTarget === 'ALL' ? null : replayTarget}
          onClose={() => setReplayTarget(null)}
          isOpen={Boolean(replayTarget)}
        />
      )}
    </div>
  );
}
