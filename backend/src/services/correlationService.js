const { BENCHMARKS } = require('../utils/stockUniverse');

/**
 * Correlation Service
 * Powers "Sector Echo" (Correlated-move grouping) and Divergence Detection
 * When 3+ stocks in the same sector move together, clusters them into one alert.
 */

const SECTOR_TO_BENCHMARK = {
  'Information Technology': 'NIFTYIT',
  'Banking & Financials': 'NIFTYBANK',
  'Automobile': 'NIFTYAUTO',
  'FMCG': 'NIFTYFMCG'
};

class CorrelationService {
  /**
   * Get benchmark move for a sector
   */
  getBenchmarkMove(sector) {
    // In our simulated feed, return realistic sector baseline drift
    const bSymbol = SECTOR_TO_BENCHMARK[sector] || 'NIFTY50';
    return {
      indexSymbol: bSymbol,
      sector,
      percentChange: sector === 'Information Technology' ? -1.8 : 0.4
    };
  }

  /**
   * Cluster signals that moved in the same direction within the same sector.
   * If 3+ symbols cluster, collapse them into a single group.
   */
  clusterCorrelatedMoves(evaluatedSignals = []) {
    // We only group signals that have non-trivial moves (e.g. abs(move) >= 0.8%)
    const candidates = evaluatedSignals.filter(
      (s) => Math.abs(s.percentChange) >= 0.8
    );

    // Map by: `${sector}_${direction}`
    const clusters = new Map();

    candidates.forEach((signal) => {
      const sector = signal.sector || 'General';
      const direction = signal.percentChange < 0 ? 'down' : 'up';
      const key = `${sector}__${direction}`;

      if (!clusters.has(key)) {
        clusters.set(key, {
          sector,
          direction,
          signals: []
        });
      }
      clusters.get(key).signals.push(signal);
    });

    const groupedSignals = [];
    const groupedSymbolSet = new Set();

    clusters.forEach((cluster, key) => {
      if (cluster.signals.length >= 3) {
        const symbols = cluster.signals.map((s) => s.symbol);
        const sumChange = cluster.signals.reduce((acc, s) => acc + s.percentChange, 0);
        const avgChange = Number((sumChange / cluster.signals.length).toFixed(2));
        const maxScore = Math.max(...cluster.signals.map((s) => s.attentionScore));

        const groupId = `cluster-${cluster.sector.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cluster.direction}`;

        const groupObj = {
          groupId,
          label: `${cluster.sector} moved together`,
          sector: cluster.sector,
          direction: cluster.direction,
          symbols,
          count: symbols.length,
          avgChange,
          maxAttentionScore: maxScore,
          confidence: cluster.signals.every((s) => s.confidence === 'verified') ? 'verified' : 'estimated',
          description: `${symbols.length} stocks (${symbols.join(', ')}) moved in unison by an average of ${avgChange > 0 ? '+' : ''}${avgChange}%. This reflects broader ${cluster.sector} sector sentiment rather than isolated idiosyncratic news.`,
          items: cluster.signals
        };

        groupedSignals.push(groupObj);
        symbols.forEach((sym) => groupedSymbolSet.add(sym));
      }
    });

    return {
      groupedSignals,
      groupedSymbolSet
    };
  }
}

const correlationService = new CorrelationService();

module.exports = correlationService;
