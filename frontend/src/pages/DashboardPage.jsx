import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAwaySummary } from '../hooks/useAwaySummary';
import axiosClient from '../api/axiosClient';
import ScenarioSwitcherBar from '../components/away/ScenarioSwitcherBar';
import SilenceScenarioView from '../components/away/SilenceScenarioView';
import ChangesScenarioView from '../components/away/ChangesScenarioView';
import WatchlistTable from '../components/watchlist/WatchlistTable';
import WatchlistHealthCard from '../components/insights/WatchlistHealthCard';
import MarketReplayTimeline from '../components/replay/MarketReplayTimeline';
import { Sparkles, Moon, Loader2 } from 'lucide-react';

export default function DashboardPage({ onNavigateToWatchlist }) {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { summary, loading, refreshSummary, ackSession, submitFeedback } = useAwaySummary();

  const [digestMode, setDigestMode] = useState(user?.preferences?.digestModeDefault ?? false);
  const [acking, setAcking] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [replayTarget, setReplayTarget] = useState(null); // symbol string or 'ALL' or null

  const handleAck = async () => {
    setAcking(true);
    await ackSession();
    setAcking(false);
  };

  const handleSwitchScenario = async (mode) => {
    setSeeding(true);
    try {
      await axiosClient.post(`/demo/seed?mode=${mode}`);
      await refreshSummary(true);
    } catch (err) {
      console.error('Failed to switch scenario:', err);
    } finally {
      setSeeding(false);
    }
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

  const currentScenario = nothingHappened ? 'nothing_happened' : 'rich_signals';

  return (
    <div className="space-y-8">
      {/* 1. SCENARIO TOGGLE STRIP */}
      <ScenarioSwitcherBar
        currentScenario={currentScenario}
        onSwitch={handleSwitchScenario}
        loading={seeding}
      />

      {/* 2. DYNAMIC SCENARIO VIEW: SILENCE vs CHANGES */}
      {nothingHappened ? (
        <SilenceScenarioView
          totalStocks={watchlist.length || 5}
          awayDuration={awayDuration}
          noActionList={noAction}
          onAcknowledge={handleAck}
          acking={acking}
          onSwitchToChanges={() => handleSwitchScenario('rich_signals')}
        />
      ) : (
        <ChangesScenarioView
          awayDuration={awayDuration}
          mustSee={mustSee}
          worthChecking={worthChecking}
          noAction={noAction}
          groupedSignals={groupedSignals}
          digestMode={digestMode}
          onToggleDigestMode={() => setDigestMode(!digestMode)}
          onAcknowledge={handleAck}
          acking={acking}
          submitFeedback={submitFeedback}
          onOpenReplay={(sym) => setReplayTarget(sym)}
          onSwitchToSilence={() => handleSwitchScenario('nothing_happened')}
          user={user}
        />
      )}

      {/* 3. WATCHLIST HEALTH META INSIGHT */}
      <div className="pt-4 border-t border-slate-800/80">
        <WatchlistHealthCard />
      </div>

      {/* 4. COMPLETE WATCHLIST REFERENCE TABLE */}
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

      {/* 5. MARKET REPLAY TIMELINE MODAL */}
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
