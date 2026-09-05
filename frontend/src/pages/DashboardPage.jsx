import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAwaySummary } from '../hooks/useAwaySummary';
import ChangesDigestView from '../components/digest/ChangesDigestView';
import SilenceDigestView from '../components/digest/SilenceDigestView';
import MarketReplayTimeline from '../components/replay/MarketReplayTimeline';
import { Loader2 } from 'lucide-react';

export default function DashboardPage({
  onNavigateToWatchlist,
  summary: summaryProp,
  loading: loadingProp,
  refreshSummary: refreshProp,
  ackSession: ackProp,
  submitFeedback: feedbackProp
}) {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();

  // Fallback to hook if not passed from parent
  const hookData = useAwaySummary();
  const summary = summaryProp !== undefined ? summaryProp : hookData.summary;
  const loading = loadingProp !== undefined ? loadingProp : hookData.loading;
  const refreshSummary = refreshProp || hookData.refreshSummary;
  const ackSession = ackProp || hookData.ackSession;
  const submitFeedback = feedbackProp || hookData.submitFeedback;

  const [acking, setAcking] = useState(false);
  const [replayTarget, setReplayTarget] = useState(null);

  const handleAck = async () => {
    setAcking(true);
    await ackSession();
    await refreshSummary(true);
    setAcking(false);
  };

  if (loading && !summary) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500 font-mono text-sm gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        <span>Evaluating market changes since your last session...</span>
      </div>
    );
  }

  const {
    lastCheckedAt,
    currentTimestamp,
    awayDuration,
    mustSee = [],
    worthChecking = [],
    noAction = [],
    groupedSignals = [],
    nothingHappened = false,
    dataConfidence = { level: 'HIGH' },
    marketStability,
    totalStocks
  } = summary || {};

  const effectiveTotal = totalStocks || (mustSee.length + worthChecking.length + noAction.length) || watchlist.length || 18;
  const userName = user?.name?.trim() || 'Investor';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-mono">
            Welcome back, <span className="text-cyan-400">{userName}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            What actually changed across your watchlist since you last looked.
          </p>
        </div>
        {user?.email && (
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#12171E] border border-slate-800 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{user.email}</span>
          </div>
        )}
      </div>

      {nothingHappened ? (
        <SilenceDigestView
          totalStocks={effectiveTotal}
          awayDuration={awayDuration}
          noActionList={noAction}
          marketStability={marketStability}
          onAcknowledge={handleAck}
          acking={acking}
          onNavigateToWatchlist={onNavigateToWatchlist}
        />
      ) : (
        <ChangesDigestView
          lastCheckedAt={lastCheckedAt}
          currentTimestamp={currentTimestamp}
          awayDuration={awayDuration}
          totalStocks={effectiveTotal}
          mustSee={mustSee}
          worthChecking={worthChecking}
          noAction={noAction}
          groupedSignals={groupedSignals}
          dataConfidence={dataConfidence}
          onAcknowledge={handleAck}
          acking={acking}
          onOpenReplay={(sym) => setReplayTarget(sym)}
          submitFeedback={submitFeedback}
        />
      )}

      {/* Interactive Timeline Replay Scrubber Modal */}
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
