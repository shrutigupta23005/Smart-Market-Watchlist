// In-browser mock engine for static deployment (e.g. GitHub Pages)
// Allows visitors and judges to experience 100% of SIGNAL's features
// without spinning up a local MongoDB and Node.js instance.

const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2940.50, volatility: 'normal' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology', basePrice: 4120.00, volatility: 'low' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Information Technology', basePrice: 1780.20, volatility: 'normal' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Financial', basePrice: 1640.80, volatility: 'normal' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automotive', basePrice: 980.50, volatility: 'high' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking & Financial', basePrice: 1220.40, volatility: 'low' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecommunications', basePrice: 1540.00, volatility: 'normal' },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'Consumer Goods', basePrice: 495.20, volatility: 'low' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financial', basePrice: 810.30, volatility: 'normal' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', basePrice: 3640.00, volatility: 'normal' }
];

class MockSignalEngine {
  constructor() {
    this.mode = 'rich_signals'; // 'rich_signals' or 'nothing_happened'
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
    const awayMinutes = Math.max(1, Math.round((Date.now() - new Date(this.lastSessionTime).getTime()) / 60000));

    if (isQuiet) {
      return {
        session: {
          lastSessionTime: this.lastSessionTime,
          awayDurationMinutes: awayMinutes,
          totalSignals: 5,
          meaningfulSignals: 0
        },
        budget: {
          maxItems: this.currentUser.preferences.attentionBudget,
          itemsShown: 0,
          remaining: this.currentUser.preferences.attentionBudget
        },
        signals: [
          {
            symbol: 'RELIANCE',
            name: 'Reliance Industries',
            sector: 'Energy',
            currentPrice: 2940.50,
            previousPrice: 2938.00,
            priceChangePercent: 0.09,
            attentionScore: 4,
            bucket: 'NO_ACTION',
            fingerprint: 'QUIET_DRIFT',
            confidence: 'verified',
            freshness: 'LIVE',
            isMeaningful: false,
            rankShift: 0,
            reasons: ['Price moved within historical noise bounds (+0.09%)']
          },
          {
            symbol: 'TCS',
            name: 'Tata Consultancy Services',
            sector: 'Information Technology',
            currentPrice: 4120.00,
            previousPrice: 4122.50,
            priceChangePercent: -0.06,
            attentionScore: 2,
            bucket: 'NO_ACTION',
            fingerprint: 'QUIET_DRIFT',
            confidence: 'verified',
            freshness: 'LIVE',
            isMeaningful: false,
            rankShift: 0,
            reasons: ['No meaningful divergence or volume spike']
          }
        ],
        groupedSignals: [],
        quietStocks: this.watchlist.map(sym => {
          const item = STOCK_UNIVERSE.find(s => s.symbol === sym) || { name: sym, basePrice: 1000 };
          return {
            symbol: sym,
            name: item.name,
            currentPrice: item.basePrice,
            priceChangePercent: 0.04,
            attentionScore: 3
          };
        }),
        nothingHappened: true,
        estimatedReviewSeconds: 5
      };
    }

    // Rich signals scenario
    const signals = [
      {
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd',
        sector: 'Automotive',
        currentPrice: 1018.75,
        previousPrice: 980.50,
        priceChangePercent: 3.90,
        attentionScore: 88,
        bucket: 'MUST_SEE',
        fingerprint: 'DIVERGENT_MOVE',
        confidence: 'verified',
        freshness: 'LIVE',
        isMeaningful: true,
        rankShift: 3,
        reasons: [
          'Gained +3.90% since your last visit (was ₹980.50 → now ₹1,018.75)',
          'Diverged +3.6% against Auto sector index (+0.3%)',
          'Move is 3.8x higher than 20-period trailing volatility',
          'Shifted +3 positions in your watchlist ranking (from #4 to #1)'
        ]
      },
      {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        sector: 'Information Technology',
        currentPrice: 1822.90,
        previousPrice: 1780.20,
        priceChangePercent: 2.40,
        attentionScore: 64,
        bucket: 'WORTH_KNOWING',
        fingerprint: 'SECTOR_ECHO',
        confidence: 'verified',
        freshness: 'LIVE',
        isMeaningful: true,
        rankShift: 1,
        reasons: [
          'Climbed +2.40% along with IT sector co-movement (+2.1%)',
          'Trend continued upward from previous session',
          'Shifted +1 position in volatility ranking'
        ]
      },
      {
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd',
        sector: 'Banking & Financial',
        currentPrice: 1622.75,
        previousPrice: 1640.80,
        priceChangePercent: -1.10,
        attentionScore: 42,
        bucket: 'WORTH_KNOWING',
        fingerprint: 'TREND_REVERSAL',
        confidence: 'verified',
        freshness: 'LIVE',
        isMeaningful: true,
        rankShift: -1,
        reasons: [
          'Reversed direction compared to your last session (was rising, now declining)',
          'Down -1.10% against Bank Nifty benchmark (+0.2%)'
        ]
      }
    ];

    const groupedSignals = [
      {
        sector: 'Information Technology',
        signalType: 'SECTOR_ECHO',
        averageScore: 64,
        summary: 'IT sector showing broad-based positive co-movement (+2.1%) across peers.',
        stocks: [
          { symbol: 'INFY', priceChangePercent: 2.40, attentionScore: 64 },
          { symbol: 'TCS', priceChangePercent: 1.80, attentionScore: 52 }
        ]
      }
    ];

    const quietStocks = [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        currentPrice: 2940.50,
        priceChangePercent: 0.15,
        attentionScore: 8
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        currentPrice: 4120.00,
        priceChangePercent: -0.12,
        attentionScore: 6
      }
    ];

    return {
      session: {
        lastSessionTime: this.lastSessionTime,
        awayDurationMinutes: awayMinutes,
        totalSignals: 5,
        meaningfulSignals: 3
      },
      budget: {
        maxItems: this.currentUser.preferences.attentionBudget,
        itemsShown: 3,
        remaining: Math.max(0, this.currentUser.preferences.attentionBudget - 3)
      },
      signals,
      groupedSignals,
      quietStocks,
      nothingHappened: false,
      estimatedReviewSeconds: 45
    };
  }

  getWatchlistItems() {
    return this.watchlist.map(sym => {
      const stock = STOCK_UNIVERSE.find(s => s.symbol === sym) || {
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
        currentPrice: stock.basePrice,
        priceChangePercent: '1.45',
        freshness: 'LIVE',
        confidence: 'verified',
        updatedAt: new Date().toISOString()
      };
    });
  }

  getReplayEvents() {
    const now = Date.now();
    return [
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
    ];
  }
}

export const mockEngine = new MockSignalEngine();
