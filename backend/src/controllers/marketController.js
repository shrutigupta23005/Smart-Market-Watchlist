const { STOCK_UNIVERSE } = require('../utils/stockUniverse');
const marketDataProvider = require('../services/marketDataProvider');

// @desc    Search / autocomplete stocks
// @route   GET /api/market/search?q=
// @access  Public or Protected
const searchStocks = async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();

    if (!q) {
      return res.json({
        success: true,
        count: 10,
        data: STOCK_UNIVERSE.slice(0, 10)
      });
    }

    const matches = STOCK_UNIVERSE.filter(stock => 
      stock.symbol.toLowerCase().includes(q) || 
      stock.name.toLowerCase().includes(q) ||
      stock.sector.toLowerCase().includes(q)
    );

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get latest prices for multiple symbols
// @route   GET /api/market/prices?symbols=RELIANCE,TCS
// @access  Public
const getLivePrices = async (req, res) => {
  try {
    const symbolsQuery = req.query.symbols || '';
    const symbols = symbolsQuery
      ? symbolsQuery.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : STOCK_UNIVERSE.map(s => s.symbol);

    const ticks = await marketDataProvider.getLatestTicks(symbols);

    res.json({
      success: true,
      count: ticks.length,
      data: ticks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  searchStocks,
  getLivePrices
};
