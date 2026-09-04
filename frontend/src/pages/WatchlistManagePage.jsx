import React, { useState } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import StockSearch from '../components/watchlist/StockSearch';
import WatchlistTable from '../components/watchlist/WatchlistTable';
import AddStockModal from '../components/watchlist/AddStockModal';
import { Plus } from 'lucide-react';

export default function WatchlistManagePage() {
  const { watchlist, loading, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [modalOpen, setModalOpen] = useState(false);
  const watchlistSymbols = watchlist.map((item) => item.symbol);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 font-mono">Manage Watchlist</h1>
          <p className="text-xs text-slate-400 mt-1">
            Stocks you track here will be monitored for meaningful divergence, reversals, and spikes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StockSearch onAddStock={addToWatchlist} watchlistSymbols={watchlistSymbols} />
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      <WatchlistTable
        items={watchlist}
        onRemoveStock={removeFromWatchlist}
        loading={loading}
      />

      <AddStockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddStock={addToWatchlist}
        watchlistSymbols={watchlistSymbols}
      />
    </div>
  );
}
