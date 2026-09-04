import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';
import FreshnessIndicator from './FreshnessIndicator';

export default function WatchlistTable({ items = [], onRemoveStock, loading }) {
  if (loading && items.length === 0) {
    return (
      <div className="bg-[#12171E] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-mono text-sm">
        Loading watchlist...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#12171E] border border-slate-800/80 rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">Your Watchlist is Empty</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Add stocks above to begin tracking what changed. SIGNAL will capture snapshots whenever you leave.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#12171E] border border-slate-800/80 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#171E27]/80 text-slate-400 text-[11px] uppercase tracking-wider font-mono border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Symbol & Company</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Freshness</th>
              <th className="py-3 px-4 text-right">Added</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item) => (
              <tr key={item.symbol} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono font-semibold text-slate-100">{item.symbol}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.name}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {item.sector}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">
                  <span className="text-base">{formatPrice(item.price)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <FreshnessIndicator
                    freshness={item.freshness || 'LIVE'}
                    ageSeconds={item.ageSeconds || 0}
                    timestamp={item.timestamp}
                    showLabel={true}
                  />
                </td>
                <td className="py-3 px-4 text-right text-xs text-slate-500 font-mono">
                  {formatRelativeTime(item.addedAt)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onRemoveStock(item.symbol)}
                    title={`Untrack ${item.symbol}`}
                    className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
