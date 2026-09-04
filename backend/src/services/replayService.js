const ChangeEvent = require('../models/ChangeEvent');

class ReplayService {
  /**
   * Record a meaningful change event to the append-only log
   */
  async recordEvent({ symbol, eventType, magnitude, description, timestamp = new Date() }) {
    return ChangeEvent.create({
      symbol: symbol.toUpperCase(),
      eventType,
      magnitude: Number(magnitude),
      description,
      timestamp
    });
  }

  /**
   * Get timeline for a specific symbol within a range (e.g. 24h, 48h)
   */
  async getSymbolReplay(symbol, rangeHours = 24) {
    const since = new Date(Date.now() - rangeHours * 3600 * 1000);
    return ChangeEvent.find({
      symbol: symbol.toUpperCase(),
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 }); // Chronological order for replay
  }

  /**
   * Get merged timeline across multiple symbols
   */
  async getWatchlistReplay(symbols = [], rangeHours = 24) {
    if (!symbols.length) return [];
    const since = new Date(Date.now() - rangeHours * 3600 * 1000);
    return ChangeEvent.find({
      symbol: { $in: symbols.map(s => s.toUpperCase()) },
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 });
  }

  /**
   * Seed realistic sample events for demo symbols
   */
  async seedDemoEvents(symbol) {
    const count = await ChangeEvent.countDocuments({ symbol });
    if (count > 0) return;

    const now = Date.now();
    const demoEvents = [
      {
        symbol,
        eventType: 'drop',
        magnitude: -4.2,
        timestamp: new Date(now - 14 * 3600 * 1000),
        description: 'Sharp drop following heavy morning institutional selling'
      },
      {
        symbol,
        eventType: 'spike',
        magnitude: 1.8,
        timestamp: new Date(now - 10 * 3600 * 1000),
        description: 'Intraday volatility spike with rapid two-way bid/ask shifts'
      },
      {
        symbol,
        eventType: 'recovery',
        magnitude: 2.4,
        timestamp: new Date(now - 6 * 3600 * 1000),
        description: 'Rebounded past 50% of the session drawdown on strong dip buying'
      },
      {
        symbol,
        eventType: 'reversal',
        magnitude: -1.5,
        timestamp: new Date(now - 2 * 3600 * 1000),
        description: 'Trend flipped into late-afternoon consolidation'
      }
    ];

    await ChangeEvent.insertMany(demoEvents);
  }
}

const replayService = new ReplayService();

module.exports = replayService;
