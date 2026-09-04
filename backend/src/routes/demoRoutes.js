const express = require('express');
const router = express.Router();
const { seedDemo } = require('../controllers/demoController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/seed', seedDemo);

module.exports = router;
