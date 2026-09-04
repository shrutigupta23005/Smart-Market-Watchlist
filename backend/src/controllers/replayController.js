const replayService = require('../services/replayService');
const WatchlistItem = require('../models/WatchlistItem');

// @desc    Get Market Replay timeline for a single symbol
// @route   GET /api/replay?symbol=RELIANCE&range=24h
// @access  Public or Protected
const getReplay = async (req, res, next) => {
  try {
    const symbol = (req.query.symbol || '').trim().toUpperCase();
    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Symbol is required' });
    }

    const rangeStr = req.query.range || '24h';
    let rangeHours = 24;
    if (rangeStr.endsWith('h')) {
      rangeHours = parseInt(rangeStr, 10) || 24;
    } else if (rangeStr.endsWith('d')) {
      rangeHours = (parseInt(rangeStr, 10) || 1) * 24;
    }

    // Seed realistic events for demonstration if empty
    await replayService.seedDemoEvents(symbol);

    const events = await replayService.getSymbolReplay(symbol, rangeHours);

    res.json({
      success: true,
      symbol,
      rangeHours,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get merged replay timeline across user's watchlist
// @route   GET /api/replay/watchlist?range=24h
// @access  Private
const getWatchlistReplay = async (req, res, next) => {
  try {
    const watchlistItems = await WatchlistItem.find({ userId: req.user._id, isActive: true });
    const symbols = watchlistItems.map(item => item.symbol);

    if (!symbols.length) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const rangeStr = req.query.range || '24h';
    const rangeHours = rangeStr.endsWith('d')
      ? (parseInt(rangeStr, 10) || 1) * 24
      : parseInt(rangeStr, 10) || 24;

    // Seed events for the symbols if empty
    for (const sym of symbols) {
      await replayService.seedDemoEvents(sym);
    }

    const events = await replayService.getWatchlistReplay(symbols, rangeHours);

    res.json({
      success: true,
      symbols,
      rangeHours,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReplay,
  getWatchlistReplay
};
