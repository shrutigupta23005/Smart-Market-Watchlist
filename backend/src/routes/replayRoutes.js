const express = require('express');
const router = express.Router();
const { getReplay, getWatchlistReplay } = require('../controllers/replayController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getReplay);
router.get('/watchlist', protect, getWatchlistReplay);

module.exports = router;
