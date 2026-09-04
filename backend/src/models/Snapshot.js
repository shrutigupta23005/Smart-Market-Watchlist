const mongoose = require('mongoose');

const snapshotEntrySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  percentChange: {
    type: Number,
    default: 0
  },
  attentionRank: {
    type: Number,
    default: 1
  },
  volatilityLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  trendDirection: {
    type: String,
    enum: ['up', 'down', 'flat'],
    default: 'flat'
  }
}, { _id: false });

const snapshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  takenAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isLatest: {
    type: Boolean,
    default: true,
    index: true
  },
  entries: [snapshotEntrySchema]
});

// Compound index for instant lookup of user's latest snapshot
snapshotSchema.index({ userId: 1, isLatest: 1 });

const Snapshot = mongoose.model('Snapshot', snapshotSchema);

module.exports = Snapshot;
