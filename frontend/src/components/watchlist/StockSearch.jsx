import React, { useState, useEffect, useRef } from 'react';
import { searchStocksApi } from '../../api/marketApi';
import { Search, Plus, Check, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function StockSearch({ onAddStock, watchlistSymbols = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchStocksApi(query);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search stocks to track (e.g. RELIANCE, TCS)..."
          className="w-full bg-[#12171E] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
        />
        {loading && (
          <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 animate-spin" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#12171E] border border-slate-800 rounded-lg shadow-2xl max-h-72 overflow-y-auto z-50 divide-y divide-slate-800/60">
          {results.map((stock) => {
            const isAdded = watchlistSymbols.includes(stock.symbol);
            return (
              <div
                key={stock.symbol}
                className="p-3 hover:bg-slate-800/40 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm text-slate-200">{stock.symbol}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {stock.sector}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{stock.name}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">
                    {formatPrice(stock.baselinePrice)}
                  </span>
                  {isAdded ? (
                    <button
                      disabled
                      className="px-2.5 py-1 rounded text-xs bg-slate-800/80 text-emerald-400 border border-slate-700 flex items-center gap-1 cursor-default"
                    >
                      <Check className="w-3 h-3" />
                      Added
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onAddStock(stock.symbol);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="px-2.5 py-1 rounded text-xs bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Track
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
