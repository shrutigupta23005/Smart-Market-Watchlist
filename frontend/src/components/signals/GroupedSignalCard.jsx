import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatPercent, formatPrice } from '../../utils/formatters';
import FreshnessIndicator from '../watchlist/FreshnessIndicator';

export default function GroupedSignalCard({ group, onFeedback }) {
  const [expanded, setExpanded] = useState(false);

  if (!group) return null;

  const { label, sector, avgChange, count, symbols, description, items = [] } = group;
  const isNegative = avgChange < 0;

  return (
    <div className="rounded-xl border border-indigo-900/60 bg-[#12171E] p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border border-indigo-700/60 bg-indigo-950/50 text-indigo-300 uppercase tracking-wider">
              <Layers className="w-3 h-3" />
              Sector Echo
            </span>
            <span className="font-mono font-bold text-base text-slate-100">{label}</span>
          </div>
          <div className="text-xs text-slate-400">
            {count} correlated stocks: <span className="text-indigo-300 font-mono">{symbols.join(', ')}</span>
          </div>
        </div>

        {/* Avg Change Badge */}
        <div className="text-right font-mono">
          <div className="text-[10px] uppercase text-slate-500">Average Move</div>
          <div
            className={`text-lg font-bold flex items-center justify-end gap-1 ${
              isNegative ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {isNegative ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            <span>{formatPercent(avgChange)}</span>
          </div>
        </div>
      </div>

      {/* Synthesis description */}
      <p className="text-xs text-slate-300 leading-relaxed bg-[#171E27]/50 p-3 rounded-lg border border-slate-800/80">
        {description}
      </p>

      {/* Expand/Collapse Child Stocks */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>{expanded ? 'Hide individual breakdown' : `View all ${count} constituent stocks`}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && items.length > 0 && (
          <div className="mt-3 divide-y divide-slate-800/60 border border-slate-800 rounded-lg overflow-hidden bg-[#171E27]/30">
            {items.map((item) => (
              <div key={item.symbol} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-200">{item.symbol}</span>
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    Score: {item.attentionScore} · {item.fingerprintLabel || item.fingerprint}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-slate-200 font-medium">{formatPrice(item.currentPrice)}</div>
                  <div
                    className={`text-[11px] ${
                      item.percentChange > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatPercent(item.percentChange)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
