const snapshotService = require('../services/snapshotService');

// @desc    Acknowledge current view / take a fresh snapshot on session end / heartbeat
// @route   POST /api/away-summary/ack
// @access  Private
const acknowledgeSession = async (req, res, next) => {
  try {
    const snapshot = await snapshotService.takeSnapshot(req.user._id);

    res.json({
      success: true,
      message: 'Snapshot captured successfully',
      data: snapshot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's latest snapshot
// @route   GET /api/snapshots/latest
// @access  Private
const getLatestSnapshot = async (req, res, next) => {
  try {
    const snapshot = await snapshotService.getLatestSnapshot(req.user._id);

    if (!snapshot) {
      return res.json({
        success: true,
        message: 'No previous snapshot found for this user',
        data: null
      });
    }

    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  acknowledgeSession,
  getLatestSnapshot
};
