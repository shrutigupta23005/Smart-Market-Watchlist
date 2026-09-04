const express = require('express');
const router = express.Router();
const { getAwaySummary } = require('../controllers/awaySummaryController');
const { acknowledgeSession } = require('../controllers/snapshotController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAwaySummary);
router.post('/ack', acknowledgeSession);

module.exports = router;
