const express = require('express');
const router = express.Router();
const { acknowledgeSession, getLatestSnapshot } = require('../controllers/snapshotController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/ack', acknowledgeSession);
router.get('/latest', getLatestSnapshot);

module.exports = router;
