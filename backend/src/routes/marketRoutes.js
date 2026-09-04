const express = require('express');
const router = express.Router();
const { searchStocks, getLivePrices } = require('../controllers/marketController');

router.get('/search', searchStocks);
router.get('/prices', getLivePrices);

module.exports = router;
