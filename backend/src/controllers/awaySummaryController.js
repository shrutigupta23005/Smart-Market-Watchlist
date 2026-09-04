const snapshotService = require('../services/snapshotService');
const marketDataProvider = require('../services/marketDataProvider');
const signalEngine = require('../services/signalEngine');
const correlationService = require('../services/correlationService');
const personalizationService = require('../services/personalizationService');
const attentionDecayManager = require('../jobs/attentionDecayJob');
const rollingStatsService = require('../jobs/rollingStatsJob');
const WatchlistItem = require('../models/WatchlistItem');
const { STOCK_UNIVERSE } = require('../utils/stockUniverse');

// In-memory score & summary cache (Step 11 scalability strategy: cached 20s)
const summaryCache = new Map(); // userId -> { data: Object, cachedAt: number }

// @desc    Generate the "While You Were Away" summary with correlated move grouping
// @route   GET /api/away-summary
// @access  Private
const getAwaySummary = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    // Check cache (TTL 20 seconds)
    const cached = summaryCache.get(userId);
    if (cached && (Date.now() - cached.cachedAt < 20000)) {
      return res.json({
        success: true,
        cached: true,
        data: cached.data
      });
    }
    const userPrefs = req.user.preferences || {};
    const attentionThreshold = userPrefs.attentionThreshold || 70;
    const mutedSignals = userPrefs.mutedSignals || [];

    // 1. Fetch user's active watchlist items
    const watchlistItems = await WatchlistItem.find({ userId, isActive: true });
    if (watchlistItems.length === 0) {
      return res.json({
        success: true,
        data: {
          awayDuration: { days: 0, hours: 0, minutes: 0 },
          totalStocks: 0,
          estimatedReviewTimeSeconds: 0,
          mustSee: [],
          worthChecking: [],
          noAction: [],
          groupedSignals: [],
          nothingHappened: true,
          quietHoursActive: false,
          userPreferences: userPrefs
        }
      });
    }

    const symbols = watchlistItems.map((item) => item.symbol);

    // 2. Fetch user's latest snapshot (Market Memory)
    let snapshot = await snapshotService.getLatestSnapshot(userId);
    let awayDuration = { days: 0, hours: 0, minutes: 0 };

    if (!snapshot) {
      snapshot = await snapshotService.takeSnapshot(userId);
    } else {
      const diffMs = Math.max(0, Date.now() - new Date(snapshot.takenAt).getTime());
      const totalMinutes = Math.floor(diffMs / (60 * 1000));
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = totalMinutes % 60;
      awayDuration = { days, hours, minutes };
    }

    const snapshotMap = new Map();
    if (snapshot && snapshot.entries) {
      snapshot.entries.forEach((entry) => {
        snapshotMap.set(entry.symbol, entry);
      });
    }

    // 3. Fetch latest ticks for all symbols
    const ticks = await marketDataProvider.getLatestTicks(symbols);
    const tickMap = new Map(ticks.map((t) => [t.symbol, t]));

    // 4. Check Quiet Hours status
    let quietHoursActive = false;
    if (userPrefs.quietHours?.enabled) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [sH, sM] = (userPrefs.quietHours.start || '22:00').split(':').map(Number);
      const [eH, eM] = (userPrefs.quietHours.end || '08:00').split(':').map(Number);
      const startMinutes = sH * 60 + sM;
      const endMinutes = eH * 60 + eM;

      if (startMinutes > endMinutes) {
        quietHoursActive = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      } else {
        quietHoursActive = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      }
    }

    // 5. Evaluate all stocks through the Signal Engine with Personalization & Attention Decay
    const evaluatedList = await Promise.all(
      symbols.map(async (symbol) => {
        const meta = STOCK_UNIVERSE.find((s) => s.symbol === symbol) || {
          name: symbol,
          sector: 'General',
          baselinePrice: 1000
        };
        const tick = tickMap.get(symbol) || {
          price: meta.baselinePrice,
          timestamp: new Date(),
          source: 'SIMULATED_FEED',
          freshness: 'LIVE',
          ageSeconds: 0
        };
        const snapEntry = snapshotMap.get(symbol);

        const benchmarkInfo = correlationService.getBenchmarkMove(meta.sector);
        const isMuted = mutedSignals.includes(symbol);

        // Fetch user's personalized multiplier from past feedback
        const personalMultiplier = await personalizationService.getMultiplier(userId, symbol);
        const rollingStat = rollingStatsService.getStats(symbol);

        const evaluation = signalEngine.evaluateStock({
          symbol,
          currentPrice: tick.price,
          snapshotPrice: snapEntry ? snapEntry.price : tick.price,
          snapshotRank: snapEntry ? snapEntry.attentionRank : 1,
          snapshotVolatility: snapEntry ? snapEntry.volatilityLevel : 'medium',
          snapshotTrend: snapEntry ? snapEntry.trendDirection : 'flat',
          trailingMean: rollingStat.mean,
          trailingStdDev: rollingStat.stddev,
          benchmarkMove: benchmarkInfo.percentChange,
          freshness: tick.freshness,
          personalizationMultiplier: personalMultiplier,
          attentionThreshold,
          isMuted
        });

        // Evaluate Attention Decay for repeated ignored alerts
        const decayResult = attentionDecayManager.evaluateDecay(
          userId,
          symbol,
          evaluation.attentionScore,
          evaluation.fingerprint
        );

        if (decayResult.isDecayed) {
          evaluation.attentionScore = decayResult.decayedScore;
          if (evaluation.attentionScore < attentionThreshold) {
            evaluation.bucket = 'WORTH_CHECKING';
          }
          evaluation.reasons.unshift(decayResult.decayNotice);
          evaluation.isDecayed = true;
        }

        return {
          ...evaluation,
          name: meta.name,
          sector: meta.sector,
          timestamp: tick.timestamp,
          source: tick.source,
          ageSeconds: tick.ageSeconds,
          groupId: null
        };
      })
    );

    // Sort by attention score descending
    evaluatedList.sort((a, b) => b.attentionScore - a.attentionScore);

    // Re-index ranks
    evaluatedList.forEach((item, idx) => {
      item.currentRank = idx + 1;
    });

    // 6. Run Sector Echo (Correlated-move grouping)
    const { groupedSignals, groupedSymbolSet } = correlationService.clusterCorrelatedMoves(evaluatedList);

    // Tag clustered symbols with their groupId
    groupedSignals.forEach((grp) => {
      grp.symbols.forEach((sym) => {
        const match = evaluatedList.find((e) => e.symbol === sym);
        if (match) match.groupId = grp.groupId;
      });
    });

    // Partition into buckets (excluding clustered symbols from individual mustSee/worthChecking cards to prevent redundancy)
    const mustSee = [];
    const worthChecking = [];
    const noAction = [];

    evaluatedList.forEach((item) => {
      const isClustered = groupedSymbolSet.has(item.symbol);

      if (item.bucket === 'MUST_SEE') {
        if (!isClustered) mustSee.push(item);
      } else if (item.bucket === 'WORTH_CHECKING') {
        if (!isClustered) worthChecking.push(item);
      } else {
        noAction.push(item);
      }
    });

    const nothingHappened = mustSee.length === 0 && worthChecking.length === 0 && groupedSignals.length === 0;

    // Estimate review time: each card takes ~20-30s, grouped card ~40s
    let estimatedReviewTimeSeconds = 10;
    if (nothingHappened) {
      estimatedReviewTimeSeconds = 5;
    } else {
      estimatedReviewTimeSeconds = Math.max(
        15,
        mustSee.length * 30 + worthChecking.length * 15 + groupedSignals.length * 35
      );
    }

    const responsePayload = {
      awayDuration,
      totalStocks: symbols.length,
      estimatedReviewTimeSeconds,
      mustSee,
      worthChecking,
      noAction,
      groupedSignals,
      nothingHappened,
      quietHoursActive,
      userPreferences: userPrefs
    };

    // Save to in-memory cache
    summaryCache.set(userId, { data: responsePayload, cachedAt: Date.now() });

    res.json({
      success: true,
      data: responsePayload
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAwaySummary
};
