const { STOCK_UNIVERSE, BENCHMARKS } = require('../utils/stockUniverse');
const PriceTick = require('../models/PriceTick');

/**
 * Market Data Provider
 * Provides an abstraction layer over live or simulated market feeds.
 * Uses realistic geometric Brownian motion / micro-fluctuations for hackathon simulation.
 */
class MarketDataProvider {
  constructor() {
    this.prices = new Map();
    this.lastUpdated = new Map();
    this.source = 'SIMULATED_FEED';

    // Initialize in-memory cache with baseline prices
    STOCK_UNIVERSE.forEach((item) => {
      this.prices.set(item.symbol, item.baselinePrice);
      this.lastUpdated.set(item.symbol, new Date());
    });

    BENCHMARKS.forEach((item) => {
      this.prices.set(item.indexSymbol, item.baselinePrice);
      this.lastUpdated.set(item.indexSymbol, new Date());
    });
  }

  /**
   * Classify age into LIVE, DELAYED, STALE
   * age < 60s -> LIVE
   * 60s <= age < 15min -> DELAYED
   * age >= 15min -> STALE
   */
  classifyFreshness(timestamp) {
    if (!timestamp) return { status: 'STALE', ageSeconds: Infinity };
    const ageSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));

    if (ageSeconds < 60) {
      return { status: 'LIVE', ageSeconds };
    } else if (ageSeconds < 15 * 60) {
      return { status: 'DELAYED', ageSeconds };
    } else {
      return { status: 'STALE', ageSeconds };
    }
  }

  /**
   * Generates a realistic tick update for a symbol
   */
  generateTick(symbol) {
    const currentPrice = this.prices.get(symbol) || 1000;
    // Small random move between -0.4% and +0.4% per normal tick
    const deltaPercent = (Math.random() - 0.495) * 0.008;
    const newPrice = Math.max(1, Number((currentPrice * (1 + deltaPercent)).toFixed(2)));

    this.prices.set(symbol, newPrice);
    const now = new Date();
    this.lastUpdated.set(symbol, now);

    return {
      symbol,
      price: newPrice,
      timestamp: now,
      source: this.source,
      isDelayed: false
    };
  }

  /**
   * Force set a specific price (useful for testing reversals or spikes)
   */
  setPrice(symbol, price, timestamp = new Date()) {
    this.prices.set(symbol, Number(price));
    this.lastUpdated.set(symbol, timestamp);
  }

  /**
   * Get latest known price for a symbol from Mongo or fallback to provider cache
   */
  async getLatestTick(symbol) {
    // Try to get latest persisted tick
    let tick = await PriceTick.findOne({ symbol }).sort({ timestamp: -1 });

    if (!tick) {
      // Create first tick from in-memory cache
      const memPrice = this.prices.get(symbol) || 1000;
      tick = await PriceTick.create({
        symbol,
        price: memPrice,
        timestamp: new Date(),
        source: this.source,
        isDelayed: false
      });
    }

    const freshness = this.classifyFreshness(tick.timestamp);
    return {
      symbol: tick.symbol,
      price: tick.price,
      timestamp: tick.timestamp,
      source: tick.source,
      freshness: freshness.status,
      ageSeconds: freshness.ageSeconds
    };
  }

  /**
   * Batch query latest ticks for multiple symbols
   */
  async getLatestTicks(symbols = []) {
    const uppercaseSymbols = symbols.map(s => s.toUpperCase());

    const ticks = await PriceTick.aggregate([
      { $match: { symbol: { $in: uppercaseSymbols } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$symbol',
          price: { $first: '$price' },
          timestamp: { $first: '$timestamp' },
          source: { $first: '$source' },
          isDelayed: { $first: '$isDelayed' }
        }
      }
    ]);

    const tickMap = new Map();
    ticks.forEach(t => {
      const freshness = this.classifyFreshness(t.timestamp);
      tickMap.set(t._id, {
        symbol: t._id,
        price: t.price,
        timestamp: t.timestamp,
        source: t.source,
        freshness: freshness.status,
        ageSeconds: freshness.ageSeconds
      });
    });

    // For any symbol not found in PriceTick, create baseline
    const results = [];
    for (const sym of uppercaseSymbols) {
      if (tickMap.has(sym)) {
        results.push(tickMap.get(sym));
      } else {
        const fallback = await this.getLatestTick(sym);
        results.push(fallback);
      }
    }

    return results;
  }
}

// Singleton instance
const marketDataProvider = new MarketDataProvider();

module.exports = marketDataProvider;
