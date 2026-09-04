const mongoose = require('mongoose');

const changeEventSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['spike', 'drop', 'recovery', 'reversal', 'divergence', 'momentum'],
    index: true
  },
  magnitude: {
    type: Number,
    required: true // e.g. -4.2 or +3.1
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  }
});

// Compound index for querying events in time window
changeEventSchema.index({ symbol: 1, timestamp: -1 });

// TTL index to automatically purge replay events older than 14 days
changeEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 });

const ChangeEvent = mongoose.model('ChangeEvent', changeEventSchema);

module.exports = ChangeEvent;
