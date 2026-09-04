const PriceTick = require('../models/PriceTick');
const { calculateMean, calculateStdDev } = require('../utils/math');
const { STOCK_UNIVERSE } = require('../utils/stockUniverse');

/**
 * Rolling Stats Job
 * Periodically recomputes trailing volatility baselines (mean, stddev) per stock.
 * Caches stats in memory so request evaluations never execute costly aggregations on the read path.
 */

class RollingStatsService {
  constructor() {
    this.statsCache = new Map(); // symbol -> { mean: number, stddev: number, volatilityLevel: 'low'|'medium'|'high' }
    this.intervalId = null;

    // Default baseline initializations
    STOCK_UNIVERSE.forEach((item) => {
      this.statsCache.set(item.symbol, {
        mean: 0.45,
        stddev: 0.75,
        volatilityLevel: 'medium',
        updatedAt: new Date()
      });
    });
  }

  async recomputeStatsForSymbol(symbol) {
    // Fetch last 50 ticks for the symbol
    const ticks = await PriceTick.find({ symbol })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('price timestamp');

    if (ticks.length < 2) {
      return this.statsCache.get(symbol);
    }

    // Chronological order
    ticks.reverse();
    const percentChanges = [];
    for (let i = 1; i < ticks.length; i++) {
      const prev = ticks[i - 1].price;
      const curr = ticks[i].price;
      if (prev > 0) {
        percentChanges.push(Math.abs(((curr - prev) / prev) * 100));
      }
    }

    const mean = calculateMean(percentChanges);
    const stddev = calculateStdDev(percentChanges, mean);

    let volatilityLevel = 'medium';
    if (stddev < 0.4) volatilityLevel = 'low';
    else if (stddev > 1.2) volatilityLevel = 'high';

    const stat = {
      mean: Number(mean.toFixed(3)),
      stddev: Number(stddev.toFixed(3)),
      volatilityLevel,
      updatedAt: new Date()
    };

    this.statsCache.set(symbol, stat);
    return stat;
  }

  async runRollingStatsCycle() {
    try {
      const symbols = STOCK_UNIVERSE.map((s) => s.symbol);
      for (const sym of symbols) {
        await this.recomputeStatsForSymbol(sym);
      }
    } catch (err) {
      console.error('[RollingStatsJob] Error computing volatility stats:', err.message);
    }
  }

  getStats(symbol) {
    return (
      this.statsCache.get(symbol) || {
        mean: 0.5,
        stddev: 0.8,
        volatilityLevel: 'medium',
        updatedAt: new Date()
      }
    );
  }

  start(intervalMs = 60000) {
    if (this.intervalId) return;
    console.log(`[RollingStatsJob] Started rolling stats baseline worker (${intervalMs}ms interval)`);
    this.runRollingStatsCycle();
    this.intervalId = setInterval(() => this.runRollingStatsCycle(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

const rollingStatsService = new RollingStatsService();

module.exports = rollingStatsService;
