const express = require('express');
const router = express.Router();
const { submitAlertFeedback, getFeedbackSummary } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', submitAlertFeedback);
router.get('/summary', getFeedbackSummary);

module.exports = router;
