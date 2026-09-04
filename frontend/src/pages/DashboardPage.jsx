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

  return (
    <div className="space-y-8">
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
