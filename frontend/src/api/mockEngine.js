// In-browser mock engine for static deployment & interactive scenario testing.
// Provides two distinctly different states: "Changes" and "Silence".

const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2875.00, volatility: 'normal' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile', basePrice: 1040.20, volatility: 'high' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking & Financial', basePrice: 1622.75, volatility: 'normal' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecommunications', basePrice: 1583.90, volatility: 'normal' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology', basePrice: 4110.00, volatility: 'low' },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Information Technology', basePrice: 1798.00, volatility: 'normal' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'Information Technology', basePrice: 518.50, volatility: 'normal' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'Information Technology', basePrice: 1640.00, volatility: 'normal' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking & Financial', basePrice: 1216.50, volatility: 'low' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking & Financial', basePrice: 1785.00, volatility: 'normal' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking & Financial', basePrice: 1190.00, volatility: 'normal' },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods', basePrice: 495.20, volatility: 'low' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financial', basePrice: 810.30, volatility: 'normal' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', basePrice: 3640.00, volatility: 'normal' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Automobile', basePrice: 12450.00, volatility: 'normal' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Healthcare', basePrice: 1680.00, volatility: 'low' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer Goods', basePrice: 3450.00, volatility: 'normal' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Financial Services', basePrice: 7120.00, volatility: 'high' }
];

class MockSignalEngine {
  constructor() {
    this.mode = 'rich_signals'; // 'rich_signals' | 'nothing_happened'
    this.currentUser = {
      _id: 'mock_demo_user',
      id: 'mock_demo_user',
      name: 'Demo Guest',
      email: 'guest@signal.market',
      preferences: {
        attentionBudget: 5,
        attentionThreshold: 70,
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
        digestMode: false,
        mutedSignals: []
      }
    };
    this.lastSessionTime = new Date(Date.now() - (2 * 24 + 4) * 3600 * 1000);
    this.watchlist = STOCK_UNIVERSE.map(s => s.symbol);
    this.feedbackHistory = [];
  }

  setScenario(mode) {
    this.mode = mode;
    if (mode === 'nothing_happened') {
      this.lastSessionTime = new Date(Date.now() - (4 * 3600 + 25 * 60) * 1000);
    } else {
      this.lastSessionTime = new Date(Date.now() - (2 * 24 + 4) * 3600 * 1000);
    }
  }

  getAwaySummary() {
    const isQuiet = this.mode === 'nothing_happened';

    if (isQuiet) {
      // SILENCE SCENARIO: The core philosophy in action
      const allCalmStocks = STOCK_UNIVERSE.map((stock, idx) => {
        const drift = idx === 12 ? 0.42 : idx === 14 ? -0.38 : ((idx % 3 === 0 ? 0.04 : -0.03) * (1 + (idx % 2) * 0.5));
        const isMinorDrift = idx === 12 || idx === 14;
        return {
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          currentPrice: stock.basePrice,
          snapshotPrice: stock.basePrice * (1 - drift / 100),
          percentChange: Number(drift.toFixed(2)),
          attentionScore: isMinorDrift ? 14 : 4,
          bucket: 'NO_ACTION',
          stabilityStatus: isMinorDrift ? 'MINOR_DRIFT' : 'STABLE',
          fingerprint: 'QUIET_DRIFT',
          fingerprintLabel: isMinorDrift ? 'Minor Drift' : 'Quiet Drift',
          noiseThreshold: '±1.8%',
          noiseMultiple: `${(Math.abs(drift) / 1.8).toFixed(2)}x`,
          filterReason: isMinorDrift
            ? `Drift of ${drift > 0 ? '+' : ''}${drift.toFixed(2)}% remained safely inside noise band (±1.8%); zero volume confirmation`
            : `Move of ${drift > 0 ? '+' : ''}${drift.toFixed(2)}% is routine bid-ask oscillation within baseline corridor (±1.8%)`,
          confidence: 'verified',
          freshness: 'LIVE',
          ageSeconds: 15 + idx * 2
        };
      });

      return {
        scenarioMode: 'silence',
        nothingHappened: true,
        lastCheckedAt: new Date(Date.now() - (2 * 24 + 4) * 3600 * 1000).toISOString(),
        currentTimestamp: new Date().toISOString(),
        dataConfidence: {
          level: 'HIGH',
          freshCount: allCalmStocks.length,
          delayedCount: 0,
          totalCount: allCalmStocks.length,
          conflicts: 0,
          label: 'Data Confidence: HIGH · Real-time Verified'
        },
        awayDuration: { days: 2, hours: 4, minutes: 0 },
        totalStocks: allCalmStocks.length,
        estimatedReviewTimeSeconds: 5,
        mustSee: [],
        worthChecking: [],
        noAction: allCalmStocks,
        groupedSignals: [],
        quietHoursActive: false,
        userPreferences: this.currentUser.preferences,
        marketStability: {
          stableCount: 16,
          minorDriftCount: 2,
          significantSignalCount: 0,
          totalTracked: 18
        }
      };
    }

    // CHANGES SCENARIO: High-attention, meaningful market movements
    const mustSee = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        sector: 'Energy',
        currentPrice: 2875.00,
        snapshotPrice: 3020.00,
        percentChange: -4.80,
        attentionScore: 92,
        bucket: 'MUST_SEE',
        fingerprint: 'TREND_REVERSAL',
        fingerprintLabel: 'Price Breakout · Trend Reversal',
        fingerprints: ['PRICE_BREAKOUT', 'VOLUME_SURGE', 'TREND_REVERSAL', 'SECTOR_DECOUPLED'],
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 4,
        reasons: [
          'Reliance broke its 20-day range on 2.4x average volume',
          'Moved opposite to the broader energy sector (-0.4%)',
          'First time leading your watchlist by volatility this month'
        ]
      },
      {
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd.',
        sector: 'Automobile',
        currentPrice: 1040.20,
        snapshotPrice: 980.50,
        percentChange: 6.09,
        attentionScore: 88,
        bucket: 'MUST_SEE',
        fingerprint: 'PRICE_BREAKOUT',
        fingerprintLabel: 'Price Breakout · Volume Surge',
        fingerprints: ['PRICE_BREAKOUT', 'VOLUME_SURGE', 'RANK_CHANGE'],
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 8,
        reasons: [
          'Broke above 20-period baseline with 3.8x volume expansion',
          'Diverged +5.4% against Automobile sector index (+0.7%)',
          'Shifted 3 positions in your watchlist ranking (from #4 to #1)'
        ]
      }
    ];

    const worthChecking = [
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        sector: 'Banking & Financial',
        currentPrice: 1622.75,
        snapshotPrice: 1640.80,
        percentChange: -1.10,
        attentionScore: 54,
        bucket: 'WORTH_CHECKING',
        fingerprint: 'TREND_REVERSAL',
        fingerprintLabel: 'Trend Reversal · Rank Change',
        fingerprints: ['TREND_REVERSAL', 'RANK_CHANGE'],
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 12,
        reasons: [
          'Reversed direction compared to your last session (was rising, now declining)',
          'Down -1.10% against Bank Nifty benchmark (+0.2%)'
        ]
      },
      {
        symbol: 'BHARTIARTL',
        name: 'Bharti Airtel Ltd.',
        sector: 'Telecommunications',
        currentPrice: 1583.90,
        snapshotPrice: 1540.00,
        percentChange: 2.85,
        attentionScore: 48,
        bucket: 'WORTH_CHECKING',
        fingerprint: 'PRICE_BREAKOUT',
        fingerprintLabel: 'Price Breakout',
        fingerprints: ['PRICE_BREAKOUT'],
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 16,
        reasons: [
          'Extended continuous upward drift for 3 consecutive days',
          'Volatility baseline increased +1.4x above 30-day median'
        ]
      }
    ];

    const groupedSignals = [
      {
        groupId: 'grp_it_echo',
        sector: 'Information Technology',
        signalType: 'SECTOR_ECHO',
        averageScore: 62,
        title: 'IT Sector Echo',
        summary: 'IT Sector Echo: TCS, INFY, WIPRO, HCLTECH all declined ~2.1% together',
        explanation: 'This was a sector-wide move, not individual company news.',
        correlationScore: 0.89,
        symbols: ['TCS', 'INFY', 'WIPRO', 'HCLTECH'],
        stocks: [
          { symbol: 'TCS', percentChange: -2.38, attentionScore: 56 },
          { symbol: 'INFY', percentChange: -2.55, attentionScore: 58 },
          { symbol: 'WIPRO', percentChange: -2.17, attentionScore: 50 },
          { symbol: 'HCLTECH', percentChange: -2.10, attentionScore: 49 }
        ]
      }
    ];

    // 14 noise-filtered stocks (18 total - 4 meaningful)
    const filteredSymbols = [
      'ICICIBANK', 'KOTAKBANK', 'AXISBANK', 'MARUTI', 'ITC', 'SBIN', 'LT',
      'SUNPHARMA', 'TITAN', 'BAJFINANCE', 'TCS', 'INFY', 'WIPRO', 'HCLTECH'
    ];

    const noAction = filteredSymbols.map((sym, idx) => {
      const stock = STOCK_UNIVERSE.find(s => s.symbol === sym) || { name: sym, sector: 'General', basePrice: 1000 };
      const isIT = ['TCS', 'INFY', 'WIPRO', 'HCLTECH'].includes(sym);
      const move = isIT ? (sym === 'INFY' ? -2.55 : sym === 'TCS' ? -2.38 : sym === 'WIPRO' ? -2.17 : -2.10) : (idx % 2 === 0 ? 0.35 : -0.28);
      const reason = isIT
        ? 'Individual alert suppressed: Absorbed into IT Sector Echo consolidated event'
        : Math.abs(move) < 0.5
        ? 'Minor price movement (< 0.8%) well within trailing volatility baseline'
        : 'Routine drift within normal corridor; no rank change or unusual volume';

      return {
        symbol: sym,
        name: stock.name,
        sector: stock.sector,
        currentPrice: stock.basePrice,
        snapshotPrice: stock.basePrice * (1 - move / 100),
        percentChange: move,
        attentionScore: isIT ? 18 : 6,
        bucket: 'NO_ACTION',
        fingerprint: 'QUIET_DRIFT',
        fingerprintLabel: 'Quiet Drift',
        noiseThreshold: '±1.8%',
        noiseMultiple: `${(Math.abs(move) / 1.8).toFixed(2)}x`,
        filterReason: reason,
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 20 + idx * 3,
        reasons: [reason]
      };
    });

    return {
      scenarioMode: 'changes',
      nothingHappened: false,
      lastCheckedAt: new Date(Date.now() - (2 * 24 + 4) * 3600 * 1000).toISOString(),
      currentTimestamp: new Date().toISOString(),
      dataConfidence: {
        level: 'HIGH',
        freshCount: 18,
        delayedCount: 0,
        totalCount: 18,
        conflicts: 0,
        label: 'DATA CONFIDENCE: HIGH · Real-Time Verified'
      },
      awayDuration: { days: 2, hours: 4, minutes: 0 },
      totalStocks: 18,
      estimatedReviewTimeSeconds: 45,
      mustSee,
      worthChecking,
      noAction,
      groupedSignals,
      quietHoursActive: false,
      userPreferences: this.currentUser.preferences
    };
  }

  getWatchlistItems() {
    return this.watchlist.map((sym) => {
      const stock = STOCK_UNIVERSE.find((s) => s.symbol === sym) || {
        symbol: sym,
        name: sym,
        sector: 'General',
        basePrice: 1500,
        volatility: 'normal'
      };
      return {
        _id: 'wl_' + sym,
        symbol: sym,
        name: stock.name,
        sector: stock.sector,
        price: stock.basePrice,
        priceChangePercent: 1.45,
        freshness: 'LIVE',
        ageSeconds: 1,
        source: 'SIMULATED_FEED',
        isActive: true,
        addedAt: new Date().toISOString()
      };
    });
  }

  getReplayEvents() {
    const now = Date.now();
    return {
      range: '24h',
      totalEvents: 4,
      events: [
        {
          _id: 'evt_1',
          symbol: 'TATAMOTORS',
          timestamp: new Date(now - 140 * 60000).toISOString(),
          eventType: 'VOLATILITY_BREAKOUT',
          attentionScore: 88,
          price: 998.40,
          priceChangePercent: 1.82,
          description: 'Tata Motors broke above 20-period volatility baseline with 2.8x volume'
        },
        {
          _id: 'evt_2',
          symbol: 'TATAMOTORS',
          timestamp: new Date(now - 90 * 60000).toISOString(),
          eventType: 'DIVERGENT_MOVE',
          attentionScore: 92,
          price: 1012.00,
          priceChangePercent: 3.21,
          description: 'Tata Motors decoupled from Auto index (+3.2% vs index +0.2%)'
        },
        {
          _id: 'evt_3',
          symbol: 'INFY',
          timestamp: new Date(now - 55 * 60000).toISOString(),
          eventType: 'SECTOR_ECHO',
          attentionScore: 64,
          price: 1815.50,
          priceChangePercent: 1.98,
          description: 'Infosys joined IT sector rally driven by global tech gains'
        },
        {
          _id: 'evt_4',
          symbol: 'HDFCBANK',
          timestamp: new Date(now - 20 * 60000).toISOString(),
          eventType: 'TREND_REVERSAL',
          attentionScore: 58,
          price: 1624.00,
          priceChangePercent: -1.02,
          description: 'HDFC Bank reversed downward, testing intraday support'
        }
      ]
    };
  }
}

export const mockEngine = new MockSignalEngine();
