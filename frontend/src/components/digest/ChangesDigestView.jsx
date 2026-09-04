import React from 'react';
import MarketMemoryDeltaHero from './MarketMemoryDeltaHero';
import AttentionBudgetSection from './AttentionBudgetSection';
import TopChangedStories from './TopChangedStories';
import NoiseFilteredProof from './NoiseFilteredProof';
import MarketStoryReplay from './MarketStoryReplay';
import SectorEchoCard from './SectorEchoCard';
import SignalConfidenceCard from './SignalConfidenceCard';

export default function ChangesDigestView({
  lastCheckedAt,
  currentTimestamp,
  awayDuration = { days: 2, hours: 4, minutes: 0 },
  totalStocks = 18,
  mustSee = [],
  worthChecking = [],
  noAction = [],
  groupedSignals = [],
  dataConfidence = { level: 'HIGH' },
  onAcknowledge,
  acking = false,
  onOpenReplay,
  submitFeedback
}) {
  const meaningfulCount = mustSee.length + worthChecking.length;
  const filteredCount = noAction.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SECTION 1: HERO: MARKET MEMORY DELTA */}
      <MarketMemoryDeltaHero
        lastCheckedAt={lastCheckedAt}
        currentTimestamp={currentTimestamp}
        awayDuration={awayDuration}
        meaningfulCount={meaningfulCount}
        onAcknowledge={onAcknowledge}
        acking={acking}
        onOpenReplay={onOpenReplay}
      />

      {/* SECTION 2: ATTENTION BUDGET / NOISE REDUCTION */}
      <AttentionBudgetSection
        totalTracked={totalStocks}
        filteredNoise={filteredCount}
        worthAttention={meaningfulCount}
        mustSeeCount={mustSee.length}
        worthCheckingCount={worthChecking.length}
        estimatedSeconds={45}
      />

      {/* SECTION 3: WHAT CHANGED MOST (THE CORE VALUE) */}
      <TopChangedStories
        mustSee={mustSee}
        worthChecking={worthChecking}
        onFeedback={submitFeedback}
        onOpenReplay={onOpenReplay}
      />

      {/* SECTION 4: WHAT YOU DIDN'T NEED TO SEE (NOISE FILTERING PROOF) */}
      <NoiseFilteredProof
        filteredCount={filteredCount}
        filteredList={noAction}
      />

      {/* SECTION 5: MARKET STORY / REPLAY */}
      <MarketStoryReplay
        onOpenFullReplay={() => onOpenReplay && onOpenReplay('ALL')}
      />

      {/* SECTION 6: SECTOR ECHO (IF APPLICABLE) */}
      {groupedSignals.length > 0 && (
        <div className="space-y-4">
          {groupedSignals.map((grp) => (
            <SectorEchoCard key={grp.groupId || grp.sector} group={grp} />
          ))}
        </div>
      )}

      {/* SECTION 7: SIGNAL CONFIDENCE / DATA QUALITY */}
      <SignalConfidenceCard
        totalStocks={totalStocks}
        confidence={dataConfidence}
      />
    </div>
  );
}
