import React from 'react';
import StockSearch from './StockSearch';
import { X, TrendingUp } from 'lucide-react';

export default function AddStockModal({ isOpen, onClose, onAddStock, watchlistSymbols = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12171E] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-mono">Track New Asset</h2>
              <p className="text-xs text-slate-400">Search equities by symbol, name, or industry sector.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Find Stock</label>
          <StockSearch
            onAddStock={(symbol) => {
              onAddStock(symbol);
              onClose();
            }}
            watchlistSymbols={watchlistSymbols}
          />
        </div>

        {/* Info */}
        <div className="text-[11px] font-mono text-slate-500 bg-[#171E27]/50 p-3 rounded-xl border border-slate-800/80">
          Tip: SIGNAL captures snapshots automatically when your session closes, recording baseline prices to detect future divergence and reversals.
        </div>
      </div>
    </div>
  );
}
