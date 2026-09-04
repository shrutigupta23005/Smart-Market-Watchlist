const Snapshot = require('../models/Snapshot');
const WatchlistItem = require('../models/WatchlistItem');
const marketDataProvider = require('./marketDataProvider');

/**
 * Snapshot Service
 * Powers SIGNAL's "Market Memory"
 * Takes server-side event-driven snapshots on session end / heartbeat / ack.
 */
class SnapshotService {
  /**
   * Take a fresh snapshot for a user
   */
  async takeSnapshot(userId, customEntries = null) {
    let entries = [];

    if (customEntries) {
      entries = customEntries;
    } else {
      // Find all active watchlist symbols for the user
      const watchlistItems = await WatchlistItem.find({ userId, isActive: true });
      if (watchlistItems.length === 0) {
        return null;
      }

      const symbols = watchlistItems.map(item => item.symbol);
      const ticks = await marketDataProvider.getLatestTicks(symbols);

      entries = ticks.map((tick, index) => ({
        symbol: tick.symbol,
        price: tick.price,
        percentChange: 0,
        attentionRank: index + 1,
        volatilityLevel: 'medium',
        trendDirection: 'flat'
      }));
    }

    // Mark previous snapshots as not latest
    await Snapshot.updateMany(
      { userId, isLatest: true },
      { $set: { isLatest: false } }
    );

    // Save new latest snapshot
    const newSnapshot = await Snapshot.create({
      userId,
      takenAt: new Date(),
      isLatest: true,
      entries
    });

    return newSnapshot;
  }

  /**
   * Retrieve the user's latest snapshot ("what they last saw")
   */
  async getLatestSnapshot(userId) {
    return Snapshot.findOne({ userId, isLatest: true });
  }

  /**
   * Seed / modify a snapshot in the past (used for demos and testing away durations)
   */
  async seedPastSnapshot(userId, hoursAgo, customEntries) {
    await Snapshot.updateMany(
      { userId, isLatest: true },
      { $set: { isLatest: false } }
    );

    const pastDate = new Date(Date.now() - hoursAgo * 3600 * 1000);

    const snapshot = await Snapshot.create({
      userId,
      takenAt: pastDate,
      isLatest: true,
      entries: customEntries
    });

    return snapshot;
  }
}

const snapshotService = new SnapshotService();

module.exports = snapshotService;
