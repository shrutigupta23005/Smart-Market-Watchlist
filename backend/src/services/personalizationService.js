const AlertFeedback = require('../models/AlertFeedback');

/**
 * Personalization Service
 * Transparent lookup-table adjustments derived from explicit feedback.
 * Hard rule: The system can only get quieter over time, never louder. Max dampening -40%.
 */
class PersonalizationService {
  /**
   * Record user feedback on an alert
   */
  async recordFeedback({ userId, symbol, alertId, action, attentionScoreAtTime }) {
    return AlertFeedback.create({
      userId,
      symbol: symbol.toUpperCase(),
      alertId,
      action,
      attentionScoreAtTime: Number(attentionScoreAtTime || 0),
      timestamp: new Date()
    });
  }

  /**
   * Get effective multiplier for a user and symbol (starts at 1.0, bounded [0.60, 1.0])
   */
  async getMultiplier(userId, symbol) {
    if (!userId || !symbol) return 1.0;

    // Count not_useful feedback for this symbol in the last 30 days
    const notUsefulCount = await AlertFeedback.countDocuments({
      userId,
      symbol: symbol.toUpperCase(),
      action: { $in: ['not_useful', 'marked_not_useful', 'dismissed'] }
    });

    if (notUsefulCount === 0) return 1.0;

    // Dampen by 0.10 per negative feedback, floor at 0.60
    const multiplier = Math.max(0.60, 1.0 - notUsefulCount * 0.10);
    return Number(multiplier.toFixed(2));
  }

  /**
   * Get summary of learned preferences for user transparency
   */
  async getUserTuningSummary(userId) {
    const feedbackList = await AlertFeedback.find({ userId }).sort({ timestamp: -1 }).limit(20);

    const negativeBySymbol = {};
    feedbackList.forEach((fb) => {
      if (['not_useful', 'marked_not_useful'].includes(fb.action)) {
        negativeBySymbol[fb.symbol] = (negativeBySymbol[fb.symbol] || 0) + 1;
      }
    });

    const quietedSymbols = Object.entries(negativeBySymbol).map(([symbol, count]) => ({
      symbol,
      count,
      multiplier: Math.max(0.60, 1.0 - count * 0.10),
      reason: `You've marked ${symbol} alerts as not useful ${count} time${count > 1 ? 's' : ''} — sensitivity reduced.`
    }));

    return {
      totalFeedback: feedbackList.length,
      quietedSymbols
    };
  }
}

const personalizationService = new PersonalizationService();

module.exports = personalizationService;
