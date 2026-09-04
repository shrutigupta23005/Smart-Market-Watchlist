const personalizationService = require('../services/personalizationService');
const attentionDecayManager = require('../jobs/attentionDecayJob');
const { clearSummaryCache } = require('./awaySummaryController');

// @desc    Submit feedback on an alert (useful / not_useful / dismissed)
// @route   POST /api/feedback
// @access  Private
const submitAlertFeedback = async (req, res, next) => {
  try {
    const { symbol, alertId, action, attentionScoreAtTime } = req.body;

    if (!symbol || !action) {
      return res.status(400).json({ success: false, error: 'Symbol and action are required' });
    }

    const doc = await personalizationService.recordFeedback({
      userId: req.user._id,
      symbol,
      alertId: alertId || `${symbol}-${Date.now()}`,
      action,
      attentionScoreAtTime
    });

    // If user interacted with the alert, reset attention decay streak
    if (['useful', 'not_useful', 'expanded'].includes(action)) {
      attentionDecayManager.resetStreak(req.user._id, symbol);
    }

    clearSummaryCache(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Feedback recorded · Personalization multiplier updated',
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personalization summary
// @route   GET /api/feedback/summary
// @access  Private
const getFeedbackSummary = async (req, res, next) => {
  try {
    const summary = await personalizationService.getUserTuningSummary(req.user._id);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAlertFeedback,
  getFeedbackSummary
};
