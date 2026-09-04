const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy', baselinePrice: 2980.50 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', sector: 'Information Technology', baselinePrice: 4210.00 },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Information Technology', baselinePrice: 1845.20 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'Information Technology', baselinePrice: 530.40 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'Information Technology', baselinePrice: 1720.80 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking & Financials', baselinePrice: 1640.10 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking & Financials', baselinePrice: 1215.30 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financials', baselinePrice: 815.00 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', sector: 'Banking & Financials', baselinePrice: 1790.00 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking & Financials', baselinePrice: 1180.50 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile', baselinePrice: 1040.20 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', sector: 'Automobile', baselinePrice: 2750.00 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', sector: 'Automobile', baselinePrice: 12450.00 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Banking & Financials', baselinePrice: 7120.00 },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'FMCG', baselinePrice: 495.60 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'FMCG', baselinePrice: 2710.00 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecommunications', baselinePrice: 1540.30 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', baselinePrice: 3620.00 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', sector: 'Healthcare', baselinePrice: 1810.00 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer Discretionary', baselinePrice: 3625.50 }
];

const BENCHMARKS = [
  { indexSymbol: 'NIFTY50', name: 'Nifty 50 Index', sector: 'Broad Market', baselinePrice: 25150.00 },
  { indexSymbol: 'NIFTYIT', name: 'Nifty IT Index', sector: 'Information Technology', baselinePrice: 41800.00 },
  { indexSymbol: 'NIFTYBANK', name: 'Nifty Bank Index', sector: 'Banking & Financials', baselinePrice: 51200.00 },
  { indexSymbol: 'NIFTYAUTO', name: 'Nifty Auto Index', sector: 'Automobile', baselinePrice: 26100.00 },
  { indexSymbol: 'NIFTYFMCG', name: 'Nifty FMCG Index', sector: 'FMCG', baselinePrice: 63500.00 }
];

module.exports = {
  STOCK_UNIVERSE,
  BENCHMARKS
};
