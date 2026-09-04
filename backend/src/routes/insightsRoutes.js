const express = require('express');
const router = express.Router();
const { getWatchlistHealth, getAttentionStreak } = require('../controllers/insightsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/health', getWatchlistHealth);
router.get('/streak', getAttentionStreak);

module.exports = router;
