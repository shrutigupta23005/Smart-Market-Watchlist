const WatchlistItem = require('../models/WatchlistItem');
const { STOCK_UNIVERSE } = require('../utils/stockUniverse');
const marketDataProvider = require('../services/marketDataProvider');
const { clearSummaryCache } = require('./awaySummaryController');

// @desc    Get user's active watchlist with live prices and freshness
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res, next) => {
  try {
    const items = await WatchlistItem.find({
      userId: req.user._id,
      isActive: true
    }).sort({ addedAt: -1 });

    if (items.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const symbols = items.map(item => item.symbol);
    const ticks = await marketDataProvider.getLatestTicks(symbols);
    const tickMap = new Map(ticks.map(t => [t.symbol, t]));

    const enriched = items.map(item => {
      const meta = STOCK_UNIVERSE.find(s => s.symbol === item.symbol) || {
        name: item.symbol,
        sector: 'General',
        baselinePrice: 1000
      };
      const tick = tickMap.get(item.symbol) || {
        price: meta.baselinePrice,
        timestamp: new Date(),
        source: 'FALLBACK',
        freshness: 'LIVE',
        ageSeconds: 0
      };

      return {
        _id: item._id,
        symbol: item.symbol,
        name: meta.name,
        sector: meta.sector,
        addedAt: item.addedAt,
        isActive: item.isActive,
        price: tick.price,
        timestamp: tick.timestamp,
        source: tick.source,
        freshness: tick.freshness,
        ageSeconds: tick.ageSeconds
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addWatchlistItem = async (req, res, next) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Stock symbol is required' });
    }

    const cleanSymbol = symbol.trim().toUpperCase();

    // Verify symbol exists in universe
    const meta = STOCK_UNIVERSE.find(s => s.symbol === cleanSymbol);
    if (!meta) {
      return res.status(400).json({
        success: false,
        error: `Symbol '${cleanSymbol}' is not supported in the market universe`
      });
    }

    // Check if already in watchlist
    let item = await WatchlistItem.findOne({
      userId: req.user._id,
      symbol: cleanSymbol
    });

    if (item) {
      if (item.isActive) {
        return res.status(400).json({
          success: false,
          error: `${cleanSymbol} is already in your watchlist`
        });
      }
      // Reactivate previously removed item
      item.isActive = true;
      item.addedAt = new Date();
      await item.save();
    } else {
      item = await WatchlistItem.create({
        userId: req.user._id,
        symbol: cleanSymbol,
        isActive: true
      });
    }

    const tick = await marketDataProvider.getLatestTick(cleanSymbol);
    clearSummaryCache(req.user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: item._id,
        symbol: item.symbol,
        name: meta.name,
        sector: meta.sector,
        addedAt: item.addedAt,
        isActive: item.isActive,
        price: tick.price,
        timestamp: tick.timestamp,
        source: tick.source,
        freshness: tick.freshness,
        ageSeconds: tick.ageSeconds
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a stock from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeWatchlistItem = async (req, res, next) => {
  try {
    const symbol = req.params.symbol.trim().toUpperCase();

    const item = await WatchlistItem.findOne({
      userId: req.user._id,
      symbol
    });

    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, error: `${symbol} is not in your active watchlist` });
    }

    item.isActive = false;
    await item.save();
    clearSummaryCache(req.user._id);

    res.json({
      success: true,
      message: `${symbol} removed from watchlist`,
      data: { symbol }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addWatchlistItem,
  removeWatchlistItem
};
