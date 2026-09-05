const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const marketRoutes = require('./routes/marketRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');
const awaySummaryRoutes = require('./routes/awaySummaryRoutes');
const replayRoutes = require('./routes/replayRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const demoRoutes = require('./routes/demoRoutes');
const { updatePreferences } = require('./controllers/authController');
const { protect } = require('./middleware/authMiddleware');

const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', rateLimiter({ windowMs: 60 * 1000, max: 150 }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', product: 'SIGNAL', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/away-summary', awaySummaryRoutes);
app.use('/api/replay', replayRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/demo', demoRoutes);
app.patch('/api/preferences', protect, updatePreferences);

// Serve static frontend in full-stack production if dist exists
const path = require('path');
const fs = require('fs');
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

module.exports = app;

