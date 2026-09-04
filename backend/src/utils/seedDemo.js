const User = require('../models/User');
const WatchlistItem = require('../models/WatchlistItem');
const Snapshot = require('../models/Snapshot');
const PriceTick = require('../models/PriceTick');
const ChangeEvent = require('../models/ChangeEvent');
const AlertFeedback = require('../models/AlertFeedback');
const marketDataProvider = require('../services/marketDataProvider');
const attentionDecayManager = require('../jobs/attentionDecayJob');
const bcrypt = require('bcryptjs');

/**
 * Demo Seeder
 * Creates an optimal demonstration environment showcasing:
 * 1. Genuine MUST SEE (RELIANCE reversal & drop)
 * 2. Genuine Sector Echo (TCS, INFY, WIPRO moving together)
 * 3. Genuine Decayed Alert (HCLTECH quieted after 3 ignored appearances)
 * 4. Genuine Away Duration ("2 days, 4 hours")
 * 5. Ability to switch instantly to "Nothing Happened" mode
 */
const seedDemoScenario = async (userId, mode = 'rich_signals') => {
  // 1. Ensure user has demo stocks in active watchlist
  const demoSymbols = ['RELIANCE', 'TCS', 'INFY', 'WIPRO', 'HDFCBANK', 'ICICIBANK', 'HCLTECH'];

  for (const sym of demoSymbols) {
    await WatchlistItem.findOneAndUpdate(
      { userId, symbol: sym },
      { userId, symbol: sym, isActive: true, addedAt: new Date(Date.now() - 7 * 86400000) },
      { upsert: true, new: true }
    );
  }

  const now = Date.now();
  const twoDaysFourHoursAgo = new Date(now - (2 * 24 + 4) * 3600 * 1000);

  if (mode === 'nothing_happened') {
    // Synchronize current prices with snapshot exactly
    const currentTicks = await marketDataProvider.getLatestTicks(demoSymbols);
    const snapshotEntries = currentTicks.map((t, idx) => ({
      symbol: t.symbol,
      price: t.price,
      percentChange: 0,
      attentionRank: idx + 1,
      volatilityLevel: 'low',
      trendDirection: 'flat'
    }));

    await Snapshot.updateMany({ userId, isLatest: true }, { $set: { isLatest: false } });
    await Snapshot.create({
      userId,
      takenAt: twoDaysFourHoursAgo,
      isLatest: true,
      entries: snapshotEntries
    });

    return { message: 'Seeded "Nothing Happened" state. All watchlist assets are calm.' };
  }

  // mode === 'rich_signals'
  // Define prior prices (what user saw 2 days, 4 hours ago) vs current prices

  // RELIANCE: Prior ₹3,020.00 -> Current ₹2,875.00 (-4.80% drop, trend reversal, high z-score)
  marketDataProvider.setPrice('RELIANCE', 2875.00);

  // IT SECTOR ECHO (TCS, INFY, WIPRO all down ~2.2% to 2.5%)
  marketDataProvider.setPrice('TCS', 4110.00);   // from 4,210 (-2.38%)
  marketDataProvider.setPrice('INFY', 1798.00);  // from 1,845 (-2.55%)
  marketDataProvider.setPrice('WIPRO', 518.50);  // from 530 (-2.17%)

  // HCLTECH: Repeated ignored alert to demonstrate Attention Decay
  marketDataProvider.setPrice('HCLTECH', 1640.00); // from 1,720 (-4.65%)
  // Pre-seed attention decay streak for HCLTECH so it gets quietened
  const decayKey = `${userId}_HCLTECH`;
  attentionDecayManager.alertStreak.set(decayKey, { count: 3, lastScore: 78 });

  // BANKING: Calm / No Action
  marketDataProvider.setPrice('HDFCBANK', 1642.00); // from 1,640 (+0.12%)
  marketDataProvider.setPrice('ICICIBANK', 1216.50); // from 1,215 (+0.12%)

  // Write the historical snapshot (2 days, 4 hours ago)
  const snapshotEntries = [
    { symbol: 'RELIANCE', price: 3020.00, percentChange: 1.2, attentionRank: 4, volatilityLevel: 'low', trendDirection: 'up' },
    { symbol: 'TCS', price: 4210.00, percentChange: 0.4, attentionRank: 2, volatilityLevel: 'medium', trendDirection: 'flat' },
    { symbol: 'INFY', price: 1845.20, percentChange: 0.2, attentionRank: 3, volatilityLevel: 'medium', trendDirection: 'flat' },
    { symbol: 'WIPRO', price: 530.40, percentChange: -0.1, attentionRank: 5, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'HCLTECH', price: 1720.80, percentChange: 0.5, attentionRank: 6, volatilityLevel: 'low', trendDirection: 'up' },
    { symbol: 'HDFCBANK', price: 1640.10, percentChange: 0.0, attentionRank: 1, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'ICICIBANK', price: 1215.30, percentChange: 0.1, attentionRank: 7, volatilityLevel: 'low', trendDirection: 'flat' }
  ];

  await Snapshot.updateMany({ userId, isLatest: true }, { $set: { isLatest: false } });
  await Snapshot.create({
    userId,
    takenAt: twoDaysFourHoursAgo,
    isLatest: true,
    entries: snapshotEntries
  });

  // Write PriceTicks for the current state
  const tickDocs = [
    { symbol: 'RELIANCE', price: 2875.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'TCS', price: 4110.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'INFY', price: 1798.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'WIPRO', price: 518.50, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'HCLTECH', price: 1640.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'HDFCBANK', price: 1642.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'ICICIBANK', price: 1216.50, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false }
  ];
  await PriceTick.insertMany(tickDocs);

  // Write sparse ChangeEvents for Market Replay
  const replayEvents = [
    {
      symbol: 'RELIANCE',
      eventType: 'drop',
      magnitude: -3.8,
      timestamp: new Date(now - 36 * 3600 * 1000),
      description: 'Heavy institutional volume broke through primary support levels'
    },
    {
      symbol: 'RELIANCE',
      eventType: 'divergence',
      magnitude: -4.8,
      timestamp: new Date(now - 18 * 3600 * 1000),
      description: 'Decoupled sharply from Nifty 50 and Energy index'
    },
    {
      symbol: 'RELIANCE',
      eventType: 'reversal',
      magnitude: -1.0,
      timestamp: new Date(now - 4 * 3600 * 1000),
      description: 'Trend flipped into consolidation near intraday lows'
    },
    {
      symbol: 'TCS',
      eventType: 'drop',
      magnitude: -2.4,
      timestamp: new Date(now - 20 * 3600 * 1000),
      description: 'Sector-wide guidance revision triggered synchronized IT sell-off'
    },
    {
      symbol: 'INFY',
      eventType: 'drop',
      magnitude: -2.5,
      timestamp: new Date(now - 20 * 3600 * 1000),
      description: 'Co-moved with tier-1 IT peers on broad sector sentiment'
    }
  ];
  await ChangeEvent.insertMany(replayEvents);

  return {
    message: 'Demo dataset seeded successfully! RELIANCE MUST SEE, IT Sector Echo, and Decayed Alert are active.'
  };
};

module.exports = {
  seedDemoScenario
};
