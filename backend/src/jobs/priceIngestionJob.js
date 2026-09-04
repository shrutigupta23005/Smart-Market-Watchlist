const PriceTick = require('../models/PriceTick');
const WatchlistItem = require('../models/WatchlistItem');
const { STOCK_UNIVERSE } = require('../utils/stockUniverse');
const marketDataProvider = require('../services/marketDataProvider');

let ingestionInterval = null;

const runIngestionCycle = async () => {
  try {
    // Collect active symbols from watchlist + stock universe subset
    const activeItems = await WatchlistItem.find({ isActive: true }).select('symbol');
    const activeSymbols = new Set(activeItems.map((item) => item.symbol));

    // Ensure at least top 10 stocks from universe are always ticking
    STOCK_UNIVERSE.slice(0, 10).forEach((s) => activeSymbols.add(s.symbol));

    const symbols = Array.from(activeSymbols);
    const tickDocs = [];

    for (const sym of symbols) {
      const tick = marketDataProvider.generateTick(sym);
      tickDocs.push({
        symbol: tick.symbol,
        price: tick.price,
        timestamp: tick.timestamp,
        source: tick.source,
        isDelayed: false
      });
    }

    if (tickDocs.length > 0) {
      await PriceTick.insertMany(tickDocs);
    }
  } catch (error) {
    console.error('[PriceIngestionJob] Error during ingestion cycle:', error.message);
  }
};

const startPriceIngestion = (intervalMs = 10000) => {
  if (ingestionInterval) return;

  console.log(`[PriceIngestionJob] Starting price ingestion job (interval: ${intervalMs}ms)`);
  // Run once immediately
  runIngestionCycle();
  ingestionInterval = setInterval(runIngestionCycle, intervalMs);
};

const stopPriceIngestion = () => {
  if (ingestionInterval) {
    clearInterval(ingestionInterval);
    ingestionInterval = null;
    console.log('[PriceIngestionJob] Stopped price ingestion job');
  }
};

module.exports = {
  startPriceIngestion,
  stopPriceIngestion,
  runIngestionCycle
};
