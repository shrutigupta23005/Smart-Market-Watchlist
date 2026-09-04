const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  preferences: {
    attentionThreshold: {
      type: Number,
      default: 70, // 0-100 threshold: >=70 MUST SEE, 40-69 WORTH CHECKING, <40 NO ACTION
      min: 0,
      max: 100
    },
    mutedSignals: {
      type: [String],
      default: [] // e.g. ["volatility_spike", "slow_drift"]
    },
    quietHours: {
      start: { type: String, default: '22:00' },
      end: { type: String, default: '08:00' },
      enabled: { type: Boolean, default: false }
    },
    digestModeDefault: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
