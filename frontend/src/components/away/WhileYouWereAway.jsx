import React from 'react';
import AwayDurationBadge from './AwayDurationBadge';
import AttentionBudgetBar from './AttentionBudgetBar';
import DigestMode from './DigestMode';
import NothingHappenedCard from './NothingHappenedCard';
import AttentionSessionEstimate from './AttentionSessionEstimate';
import AttentionStreakBadge from './AttentionStreakBadge';
import { Sparkles } from 'lucide-react';

export default function WhileYouWereAway({
  awayDuration,
  mustSeeCount = 0,
  worthCheckingCount = 0,
  noActionCount = 0,
  estimatedSeconds = 10,
  streakCount = 0,
  digestMode = false,
  onToggleDigestMode,
  nothingHappened = false,
  totalStocks = 0,
  onAcknowledge,
  mustSee = [],
  worthChecking = []
}) {
  return (
    <div className="space-y-6">
      {/* Hero Away Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>While You Were Away</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-slate-100">
            You were away for{' '}
            <span className="font-semibold text-cyan-300">
              {awayDuration?.days > 0 && `${awayDuration.days} day${awayDuration.days > 1 ? 's' : ''}, `}
              {awayDuration?.hours || 0} hour{(awayDuration?.hours !== 1) ? 's' : ''}
              {awayDuration?.minutes > 0 ? ` ${awayDuration.minutes} min` : ''}
            </span>.
          </h2>
        </div>
        <AwayDurationBadge awayDuration={awayDuration} />
      </div>

      {/* Digest Mode TL;DR Bar */}
      <DigestMode
        enabled={digestMode}
        onToggle={onToggleDigestMode}
        mustSee={mustSee}
        worthChecking={worthChecking}
        nothingHappened={nothingHappened}
      />

      {/* Attention Budget Strip */}
      <AttentionBudgetBar
        mustSeeCount={mustSeeCount}
        worthCheckingCount={worthCheckingCount}
        noActionCount={noActionCount}
        estimatedSeconds={estimatedSeconds}
        streakCount={streakCount}
      />
    </div>
  );
}
