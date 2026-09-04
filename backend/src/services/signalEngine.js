const { clamp, calculateZScore } = require('../utils/math');
const { checkMeaningfulChange, classifyFingerprint } = require('./changeDetector');

/**
 * Signal Engine
 * Computes explainable, weighted Attention Scores capped at 100.
 * Every score includes human-readable reasons and a data freshness confidence qualifier.
 */

const WEIGHTS = {
  changeSinceLastVisit: 0.30,
  unusualness: 0.20,
  rankChange: 0.15,
  volatilityChange: 0.10,
  trendReversal: 0.10,
  divergence: 0.15
};

class SignalEngine {
  /**
   * Evaluate a stock for a user
   */
  evaluateStock({
    symbol,
    currentPrice,
    snapshotPrice = null,
    snapshotRank = 1,
    currentRank = 1,
    snapshotVolatility = 'medium',
    currentVolatility = 'medium',
    snapshotTrend = 'flat',
    currentTrend = 'flat',
    trailingMean = 0.5,
    trailingStdDev = 0.8,
    benchmarkMove = 0,
    freshness = 'LIVE',
    personalizationMultiplier = 1.0,
    attentionThreshold = 70,
    isMuted = false
  }) {
    // 1. Calculate price change since snapshot
    const prevPrice = snapshotPrice || currentPrice;
    const percentChange = prevPrice > 0
      ? Number((((currentPrice - prevPrice) / prevPrice) * 100).toFixed(2))
      : 0;
    const absPercent = Math.abs(percentChange);

    // Component 1: changeSinceLastVisit (0-100)
    // 5%+ move reaches maximum 100
    const changeComponent = clamp(Math.round((absPercent / 5.0) * 100));

    // Component 2: unusualness z-score (0-100)
    const zScore = Math.max(0, calculateZScore(absPercent, trailingMean, trailingStdDev));
    // z-score of 3+ reaches 100
    const unusualnessComponent = clamp(Math.round((zScore / 3.0) * 100));

    // Component 3: rankChange (0-100)
    const rankDiff = Math.abs(snapshotRank - currentRank);
    const rankComponent = clamp(Math.round((rankDiff / 4.0) * 100));

    // Component 4: volatilityChange (0-100)
    const volLevels = { low: 1, medium: 2, high: 3 };
    const volDiff = Math.abs((volLevels[currentVolatility] || 2) - (volLevels[snapshotVolatility] || 2));
    const volatilityComponent = volDiff === 2 ? 100 : volDiff === 1 ? 50 : 0;

    // Component 5: trendReversal (0-100)
    const isReversed = (snapshotTrend === 'up' && percentChange < -0.8) ||
                       (snapshotTrend === 'down' && percentChange > 0.8) ||
                       (snapshotTrend === 'up' && currentTrend === 'down') ||
                       (snapshotTrend === 'down' && currentTrend === 'up');
    const trendComponent = isReversed ? 100 : 0;

    // Component 6: divergence from benchmark (0-100)
    const divergence = Number((percentChange - benchmarkMove).toFixed(2));
    const divergenceAbs = Math.abs(divergence);
    const divergenceComponent = clamp(Math.round((divergenceAbs / 3.0) * 100));

    // Weighted raw score
    const rawScore = Math.round(
      WEIGHTS.changeSinceLastVisit * changeComponent +
      WEIGHTS.unusualness * unusualnessComponent +
      WEIGHTS.rankChange * rankComponent +
      WEIGHTS.volatilityChange * volatilityComponent +
      WEIGHTS.trendReversal * trendComponent +
      WEIGHTS.divergence * divergenceComponent
    );

    // Apply personalization multiplier (can only quieten, never exceed 1.0)
    const safeMultiplier = Math.min(personalizationMultiplier, 1.0);
    const finalAttentionScore = isMuted ? 0 : clamp(Math.round(rawScore * safeMultiplier));

    // Bucketing
    let bucket = 'NO_ACTION';
    if (finalAttentionScore >= attentionThreshold) {
      bucket = 'MUST_SEE';
    } else if (finalAttentionScore >= 40) {
      bucket = 'WORTH_CHECKING';
    }

    // Confidence qualifier tied to underlying data freshness
    const confidence = freshness === 'LIVE' ? 'verified' : 'estimated';

    // Fingerprint classification
    const fingerprint = classifyFingerprint({
      percentChange,
      divergenceAbs,
      volatilitySpiked: volDiff > 0 && currentVolatility === 'high',
      trendReversed: isReversed,
      isDrawdownRecovered: percentChange > 1.5 && snapshotTrend === 'down',
      isPeriodHigh: percentChange > 3.5,
      isPeriodLow: percentChange < -3.5,
      trailingStdDev
    });

    // Check if change is meaningful
    const meaningfulCheck = checkMeaningfulChange({
      percentChange,
      zScore,
      rankChange: rankDiff,
      volatilityChanged: volDiff > 0,
      trendReversed: isReversed,
      divergenceAbs
    });

    // Generate explainable plain-English reasons array
    const reasons = [];
    if (absPercent >= 0.5) {
      reasons.push(
        `${percentChange > 0 ? 'Rose' : 'Dropped'} ${absPercent.toFixed(1)}% since your last visit (was ₹${prevPrice.toFixed(2)} → now ₹${currentPrice.toFixed(2)})`
      );
    }
    if (zScore >= 1.5) {
      reasons.push(
        `Move is ${zScore.toFixed(1)}x greater than this stock's trailing volatility baseline`
      );
    }
    if (divergenceAbs >= 1.5) {
      reasons.push(
        `Diverged ${divergenceAbs.toFixed(1)}% against sector index (${benchmarkMove > 0 ? '+' : ''}${benchmarkMove.toFixed(1)}%)`
      );
    }
    if (isReversed) {
      reasons.push(`Trend reversed direction compared to your last session`);
    }
    if (rankDiff >= 2) {
      reasons.push(`Shifted ${rankDiff} positions in your watchlist ranking (from #${snapshotRank} to #${currentRank})`);
    }
    if (volDiff > 0) {
      reasons.push(`Volatility shifted from ${snapshotVolatility} to ${currentVolatility}`);
    }

    if (reasons.length === 0) {
      reasons.push('No meaningful change since last visit');
    }

    const stdDevPercent = Math.max(0.8, trailingStdDev || 1.5);
    const noiseMultiple = `${(absPercent / stdDevPercent).toFixed(2)}x`;
    const noiseThreshold = `±${(stdDevPercent * 1.5).toFixed(1)}%`;
    const filterReason = absPercent < 0.3
      ? `Price drift (${absPercent.toFixed(2)}%) stayed within 20-period volatility noise baseline (${noiseThreshold})`
      : `Move (${absPercent.toFixed(2)}%) did not exhibit divergence or trend reversal; filtered out as noise`;

    return {
      symbol,
      currentPrice,
      snapshotPrice: prevPrice,
      percentChange,
      attentionScore: finalAttentionScore,
      rawScore,
      bucket,
      confidence,
      freshness,
      reasons,
      fingerprint: fingerprint.type,
      fingerprintLabel: fingerprint.label,
      fingerprintDesc: fingerprint.description,
      isMeaningful: meaningfulCheck.isMeaningful,
      noiseThreshold,
      noiseMultiple,
      filterReason,
      breakdown: {
        changeComponent,
        unusualnessComponent,
        rankComponent,
        volatilityComponent,
        trendComponent,
        divergenceComponent,
        zScore: Number(zScore.toFixed(2)),
        divergence: Number(divergence.toFixed(2)),
        personalizationMultiplier: safeMultiplier
      }
    };
  }
}

const signalEngine = new SignalEngine();

module.exports = signalEngine;
