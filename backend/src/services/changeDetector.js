/**
 * Change Detector
 * Evaluates whether price & market behavior constitutes a meaningful change,
 * and classifies changes into explainable, rule-based fingerprints.
 */

const VOLATILITY_BUCKETS = {
  low: 1,
  medium: 2,
  high: 3
};

/**
 * Meaningful change detection (OR logic — any single strong signal is enough)
 */
const checkMeaningfulChange = ({
  percentChange,
  zScore = 0,
  rankChange = 0,
  volatilityChanged = false,
  trendReversed = false,
  divergenceAbs = 0,
  thresholds = {
    meaningfulChangePercent: 2.0,
    meaningfulZScore: 2.0,
    meaningfulRankChange: 3,
    meaningfulDivergence: 2.0
  }
}) => {
  const absChange = Math.abs(percentChange);

  if (absChange >= thresholds.meaningfulChangePercent) {
    return { isMeaningful: true, reason: `Moved ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%, crossing meaningful threshold (≥${thresholds.meaningfulChangePercent}%)` };
  }
  if (zScore >= thresholds.meaningfulZScore) {
    return { isMeaningful: true, reason: `Unusualness z-score of ${zScore.toFixed(1)} indicates statistical deviation from stock's baseline` };
  }
  if (rankChange >= thresholds.meaningfulRankChange) {
    return { isMeaningful: true, reason: `Shifted ${rankChange} places inside your personal watchlist ranking` };
  }
  if (volatilityChanged) {
    return { isMeaningful: true, reason: `Volatility profile transitioned to a new activity tier` };
  }
  if (trendReversed) {
    return { isMeaningful: true, reason: `Direction flipped relative to prior trend window` };
  }
  if (divergenceAbs >= thresholds.meaningfulDivergence) {
    return { isMeaningful: true, reason: `Diverged ${divergenceAbs.toFixed(1)}% against sector/index benchmark` };
  }

  return { isMeaningful: false, reason: 'No meaningful change detected' };
};

/**
 * Rule-based Change Fingerprint Classifier (top-down evaluation; first match wins)
 */
const classifyFingerprint = ({
  percentChange,
  divergenceAbs = 0,
  volatilitySpiked = false,
  trendReversed = false,
  isDrawdownRecovered = false,
  isPeriodHigh = false,
  isPeriodLow = false,
  trailingStdDev = 1.0,
  sectorDivergenceThreshold = 2.5
}) => {
  const absMove = Math.abs(percentChange);

  // 1. DIVERGENT_MOVE: deviates from benchmark by > threshold
  if (divergenceAbs >= sectorDivergenceThreshold) {
    return {
      type: 'DIVERGENT_MOVE',
      label: 'Divergent Move',
      description: `Decoupled from sector index by ${divergenceAbs.toFixed(1)}%`
    };
  }

  // 2. VOLATILITY_SPIKE: high volatility spike but net move is small
  if (volatilitySpiked && absMove < 1.0) {
    return {
      type: 'VOLATILITY_SPIKE',
      label: 'Volatility Spike',
      description: 'Erratic intraday swings without a decisive directional move'
    };
  }

  // 3. SUDDEN_REVERSAL: trend flipped direction
  if (trendReversed) {
    return {
      type: 'SUDDEN_REVERSAL',
      label: 'Sudden Reversal',
      description: `Flipped trend direction to ${percentChange > 0 ? 'upward' : 'downward'} move`
    };
  }

  // 4. RECOVERY: recovered >50% of prior drawdown
  if (isDrawdownRecovered) {
    return {
      type: 'RECOVERY',
      label: 'Recovery',
      description: 'Rebounded past 50% of recent pullback drawdown'
    };
  }

  // 5. NEW_HIGH / NEW_LOW
  if (isPeriodHigh) {
    return {
      type: 'NEW_HIGH',
      label: 'Period High',
      description: 'Reached a new peak within the tracked observation window'
    };
  }
  if (isPeriodLow) {
    return {
      type: 'NEW_LOW',
      label: 'Period Low',
      description: 'Fell to a new low within the tracked observation window'
    };
  }

  // 6. STRONG_MOMENTUM / SLOW_DRIFT
  if (absMove >= 1.5) {
    return {
      type: 'STRONG_MOMENTUM',
      label: 'Strong Momentum',
      description: `Consistent directional push of ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`
    };
  }
  if (absMove >= 0.5) {
    return {
      type: 'SLOW_DRIFT',
      label: 'Slow Drift',
      description: `Gradual drift of ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}% on normal volatility`
    };
  }

  // 7. STABLE: default
  return {
    type: 'STABLE',
    label: 'Stable',
    description: 'Price fluctuation within normal noise boundaries'
  };
};

module.exports = {
  checkMeaningfulChange,
  classifyFingerprint,
  VOLATILITY_BUCKETS
};
