const mongoose = require('mongoose');

const alertFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  alertId: {
    type: String,
    required: true
  },
  attentionScoreAtTime: {
    type: Number
  },
  action: {
    type: String,
    enum: ['expanded', 'dismissed', 'marked_not_useful', 'useful', 'not_useful', 'ignored'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

alertFeedbackSchema.index({ userId: 1, symbol: 1, timestamp: -1 });
alertFeedbackSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const AlertFeedback = mongoose.model('AlertFeedback', alertFeedbackSchema);

module.exports = AlertFeedback;
