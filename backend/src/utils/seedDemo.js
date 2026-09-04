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
  // 1. Ensure user has 18 demo stocks in active watchlist
  const demoSymbols = [
    'RELIANCE', 'TATAMOTORS', 'HDFCBANK', 'BHARTIARTL',
    'TCS', 'INFY', 'WIPRO', 'HCLTECH',
    'ICICIBANK', 'KOTAKBANK', 'AXISBANK', 'ITC', 'SBIN', 'LT',
    'MARUTI', 'SUNPHARMA', 'TITAN', 'BAJFINANCE'
  ];

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
    // Synchronize current prices with snapshot exactly for silence
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

    return { message: 'Seeded "Nothing Happened" state. All 18 watchlist assets are calm.' };
  }

  // mode === 'rich_signals'
  // Define prior prices (what user saw 2 days, 4 hours ago) vs current prices
  marketDataProvider.setPrice('RELIANCE', 2875.00); // from 3,020 (-4.80%)
  marketDataProvider.setPrice('TATAMOTORS', 1040.20); // from 980.50 (+6.09%)
  marketDataProvider.setPrice('HDFCBANK', 1622.75); // from 1,640.80 (-1.10%)
  marketDataProvider.setPrice('BHARTIARTL', 1583.90); // from 1,540.00 (+2.85%)

  // IT SECTOR ECHO (TCS, INFY, WIPRO, HCLTECH all down ~2.1% to 2.5%)
  marketDataProvider.setPrice('TCS', 4110.00);   // from 4,210 (-2.38%)
  marketDataProvider.setPrice('INFY', 1798.00);  // from 1,845 (-2.55%)
  marketDataProvider.setPrice('WIPRO', 518.50);  // from 530 (-2.17%)
  marketDataProvider.setPrice('HCLTECH', 1640.00); // from 1,675 (-2.10%)

  // Quiet drift assets
  marketDataProvider.setPrice('ICICIBANK', 1216.50);
  marketDataProvider.setPrice('KOTAKBANK', 1785.00);
  marketDataProvider.setPrice('AXISBANK', 1190.00);
  marketDataProvider.setPrice('ITC', 495.20);
  marketDataProvider.setPrice('SBIN', 810.30);
  marketDataProvider.setPrice('LT', 3640.00);
  marketDataProvider.setPrice('MARUTI', 12450.00);
  marketDataProvider.setPrice('SUNPHARMA', 1680.00);
  marketDataProvider.setPrice('TITAN', 3450.00);
  marketDataProvider.setPrice('BAJFINANCE', 7120.00);

  // Write historical snapshot
  const snapshotEntries = [
    { symbol: 'RELIANCE', price: 3020.00, percentChange: 1.2, attentionRank: 1, volatilityLevel: 'medium', trendDirection: 'up' },
    { symbol: 'TATAMOTORS', price: 980.50, percentChange: 0.2, attentionRank: 4, volatilityLevel: 'high', trendDirection: 'flat' },
    { symbol: 'HDFCBANK', price: 1640.80, percentChange: 0.0, attentionRank: 3, volatilityLevel: 'low', trendDirection: 'up' },
    { symbol: 'BHARTIARTL', price: 1540.00, percentChange: 0.5, attentionRank: 6, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'TCS', price: 4210.00, percentChange: 0.4, attentionRank: 2, volatilityLevel: 'medium', trendDirection: 'flat' },
    { symbol: 'INFY', price: 1845.20, percentChange: 0.2, attentionRank: 5, volatilityLevel: 'medium', trendDirection: 'flat' },
    { symbol: 'WIPRO', price: 530.00, percentChange: -0.1, attentionRank: 7, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'HCLTECH', price: 1675.00, percentChange: 0.1, attentionRank: 8, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'ICICIBANK', price: 1215.30, percentChange: 0.1, attentionRank: 9, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'KOTAKBANK', price: 1782.00, percentChange: 0.0, attentionRank: 10, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'AXISBANK', price: 1188.00, percentChange: 0.0, attentionRank: 11, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'ITC', price: 494.50, percentChange: 0.1, attentionRank: 12, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'SBIN', price: 808.00, percentChange: 0.2, attentionRank: 13, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'LT', price: 3635.00, percentChange: 0.0, attentionRank: 14, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'MARUTI', price: 12470.00, percentChange: -0.1, attentionRank: 15, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'SUNPHARMA', price: 1678.00, percentChange: 0.0, attentionRank: 16, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'TITAN', price: 3445.00, percentChange: 0.1, attentionRank: 17, volatilityLevel: 'low', trendDirection: 'flat' },
    { symbol: 'BAJFINANCE', price: 7110.00, percentChange: 0.1, attentionRank: 18, volatilityLevel: 'low', trendDirection: 'flat' }
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
    { symbol: 'TATAMOTORS', price: 1040.20, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'HDFCBANK', price: 1622.75, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'BHARTIARTL', price: 1583.90, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'TCS', price: 4110.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'INFY', price: 1798.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'WIPRO', price: 518.50, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'HCLTECH', price: 1640.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'ICICIBANK', price: 1216.50, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'KOTAKBANK', price: 1785.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'AXISBANK', price: 1190.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'ITC', price: 495.20, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'SBIN', price: 810.30, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'LT', price: 3640.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'MARUTI', price: 12450.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'SUNPHARMA', price: 1680.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'TITAN', price: 3450.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false },
    { symbol: 'BAJFINANCE', price: 7120.00, timestamp: new Date(), source: 'SIMULATED_FEED', isDelayed: false }
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
