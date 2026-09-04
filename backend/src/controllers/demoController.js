const { seedDemoScenario } = require('../utils/seedDemo');
const { clearSummaryCache } = require('./awaySummaryController');

// @desc    Seed demo scenario (rich_signals or nothing_happened)
// @route   POST /api/demo/seed?mode=
// @access  Private
const seedDemo = async (req, res, next) => {
  try {
    const mode = req.query.mode || req.body.mode || 'rich_signals';
    const result = await seedDemoScenario(req.user._id, mode);
    clearSummaryCache(req.user._id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  seedDemo
};
