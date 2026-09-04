const mongoose = require('mongoose');

const priceTickSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'SIMULATED_FEED'
  },
  isDelayed: {
    type: Boolean,
    default: false
  }
});

// Compound index for querying latest price by symbol quickly
priceTickSchema.index({ symbol: 1, timestamp: -1 });

// TTL index to automatically prune ticks older than 7 days (protect storage)
priceTickSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const PriceTick = mongoose.model('PriceTick', priceTickSchema);

module.exports = PriceTick;
