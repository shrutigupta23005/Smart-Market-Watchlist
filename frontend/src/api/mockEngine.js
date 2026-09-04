// In-browser mock engine for static deployment (e.g. GitHub Pages)
// Allows visitors and judges to experience 100% of SIGNAL's features
// matching the exact backend response structure.

const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2940.50, volatility: 'normal' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology', basePrice: 4120.00, volatility: 'low' },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Information Technology', basePrice: 1780.20, volatility: 'normal' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking & Financial', basePrice: 1640.80, volatility: 'normal' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile', basePrice: 980.50, volatility: 'high' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking & Financial', basePrice: 1220.40, volatility: 'low' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecommunications', basePrice: 1540.00, volatility: 'normal' },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods', basePrice: 495.20, volatility: 'low' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financial', basePrice: 810.30, volatility: 'normal' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', basePrice: 3640.00, volatility: 'normal' }
];

class MockSignalEngine {
  constructor() {
    this.mode = 'rich_signals'; // 'rich_signals' | 'nothing_happened'
    this.currentUser = {
      _id: 'mock_demo_user',
      id: 'mock_demo_user',
      name: 'Shruti Gupta',
      email: 'shruti@signal.market',
      preferences: {
        attentionBudget: 5,
        attentionThreshold: 70,
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
        digestMode: false,
        mutedSignals: []
      }
    };
    this.lastSessionTime = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
    this.watchlist = ['TATAMOTORS', 'INFY', 'RELIANCE', 'HDFCBANK', 'TCS'];
    this.feedbackHistory = [];
  }

  setScenario(mode) {
    this.mode = mode;
    if (mode === 'nothing_happened') {
      this.lastSessionTime = new Date();
    } else {
      this.lastSessionTime = new Date(Date.now() - 4 * 60 * 60 * 1000);
    }
  }

  getAwaySummary() {
    const isQuiet = this.mode === 'nothing_happened';
    const awayDuration = isQuiet
      ? { days: 0, hours: 0, minutes: 1 }
      : { days: 0, hours: 4, minutes: 25 };

    if (isQuiet) {
      const quietList = this.watchlist.map((sym) => {
        const item = STOCK_UNIVERSE.find((s) => s.symbol === sym) || { name: sym, basePrice: 1000, sector: 'General' };
        return {
          symbol: sym,
          name: item.name,
          sector: item.sector,
          currentPrice: item.basePrice,
          snapshotPrice: item.basePrice,
          percentChange: 0.04,
          attentionScore: 4,
          bucket: 'NO_ACTION',
          fingerprint: 'QUIET_DRIFT',
          fingerprintDesc: 'Price moved within normal noise range',
          confidence: 'verified',
          freshness: 'LIVE',
          ageSeconds: 2,
          reasons: ['Price moved within historical noise bounds (+0.04%)']
        };
      });

      return {
        awayDuration,
        totalStocks: this.watchlist.length,
        estimatedReviewTimeSeconds: 5,
        mustSee: [],
        worthChecking: [],
        noAction: quietList,
        groupedSignals: [],
        nothingHappened: true,
        quietHoursActive: false,
        userPreferences: this.currentUser.preferences
      };
    }

    // Rich signals scenario
    const mustSee = [
      {
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd.',
        sector: 'Automobile',
        currentPrice: 1040.20,
        snapshotPrice: 980.50,
        percentChange: 6.09,
        attentionScore: 88,
        bucket: 'MUST_SEE',
        fingerprint: 'DIVERGENT_MOVE',
        fingerprintDesc: 'Decoupled from sector index move',
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 1,
        reasons: [
          'Rose 6.1% since your last visit (was ₹980.50 → now ₹1,040.20)',
          'Move is 3.8x greater than this stock\'s trailing volatility baseline',
          'Diverged 5.4% against Automobile sector index (+0.7%)',
          'Shifted 3 positions in your watchlist ranking (from #4 to #1)'
        ]
      }
    ];

    const worthChecking = [
      {
        symbol: 'INFY',
        name: 'Infosys Ltd.',
        sector: 'Information Technology',
        currentPrice: 1822.90,
        snapshotPrice: 1780.20,
        percentChange: 2.40,
        attentionScore: 64,
        bucket: 'WORTH_CHECKING',
        fingerprint: 'SECTOR_ECHO',
        fingerprintDesc: 'Moving with broader sector trend',
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 3,
        reasons: [
          'Climbed 2.4% along with IT sector co-movement (+2.1%)',
          'Trend continued upward from previous session',
          'Shifted 1 position in volatility ranking'
        ]
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        sector: 'Banking & Financial',
        currentPrice: 1622.75,
        snapshotPrice: 1640.80,
        percentChange: -1.10,
        attentionScore: 46,
        bucket: 'WORTH_CHECKING',
        fingerprint: 'TREND_REVERSAL',
        fingerprintDesc: 'Price reversed from prior direction',
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 5,
        reasons: [
          'Reversed direction compared to your last session (was rising, now declining)',
          'Down 1.1% against Bank Nifty benchmark (+0.2%)'
        ]
      }
    ];

    const noAction = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        sector: 'Energy',
        currentPrice: 2940.50,
        snapshotPrice: 2938.00,
        percentChange: 0.09,
        attentionScore: 6,
        bucket: 'NO_ACTION',
        fingerprint: 'QUIET_DRIFT',
        fingerprintDesc: 'Price moved within normal noise range',
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 2,
        reasons: ['No meaningful change since last visit']
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        sector: 'Information Technology',
        currentPrice: 4120.00,
        snapshotPrice: 4122.50,
        percentChange: -0.06,
        attentionScore: 3,
        bucket: 'NO_ACTION',
        fingerprint: 'QUIET_DRIFT',
        fingerprintDesc: 'Price moved within normal noise range',
        confidence: 'verified',
        freshness: 'LIVE',
        ageSeconds: 4,
        reasons: ['Price moved within normal noise bounds (-0.06%)']
      }
    ];

    const groupedSignals = [
      {
        groupId: 'grp_it_echo',
        sector: 'Information Technology',
        signalType: 'SECTOR_ECHO',
        averageScore: 62,
        summary: 'IT sector co-movement detected (+2.1% average move)',
        symbols: ['INFY', 'TCS'],
        stocks: [
          { symbol: 'INFY', percentChange: 2.40, attentionScore: 64 },
          { symbol: 'TCS', percentChange: 1.80, attentionScore: 52 }
        ]
      }
    ];

    return {
      awayDuration,
      totalStocks: this.watchlist.length,
      estimatedReviewTimeSeconds: 45,
      mustSee,
      worthChecking,
      noAction,
      groupedSignals,
      nothingHappened: false,
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
