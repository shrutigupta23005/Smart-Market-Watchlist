const express = require('express');
const router = express.Router();
const { getWatchlist, addWatchlistItem, removeWatchlistItem } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All watchlist routes require authentication

router.route('/')
  .get(getWatchlist)
  .post(addWatchlistItem);

router.route('/:symbol')
  .delete(removeWatchlistItem);

module.exports = router;
