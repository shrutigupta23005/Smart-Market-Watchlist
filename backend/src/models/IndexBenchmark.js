const mongoose = require('mongoose');

const indexBenchmarkSchema = new mongoose.Schema({
  indexSymbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  sector: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  percentChange: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

indexBenchmarkSchema.index({ indexSymbol: 1, timestamp: -1 });

const IndexBenchmark = mongoose.model('IndexBenchmark', indexBenchmarkSchema);

module.exports = IndexBenchmark;
