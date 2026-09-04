import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, EyeOff, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function NoiseFilteredProof({
  filteredCount = 14,
  filteredList = []
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
              Section 4 · What You Didn't Need To See (Noise Filtering Proof)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Silence is an active calculation, not an empty state. SIGNAL proved these {filteredCount} movements were routine.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 self-start sm:self-auto">
          {filteredCount} Movements Filtered
        </span>
      </div>

      {/* 4 Checklist Proof Bullets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#171E27]/80 border border-slate-800/80 text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-slate-300">Minor price movement (&lt; 0.8%)</span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#171E27]/80 border border-slate-800/80 text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-slate-300">Routine movements within normal volatility</span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#171E27]/80 border border-slate-800/80 text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-slate-300">No watchlist rank change</span>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#171E27]/80 border border-slate-800/80 text-xs">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-slate-300">No unusual volume or behavior</span>
        </div>
      </div>

      {/* Expandable Accordion to inspect filtered stocks */}
      <div className="pt-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 rounded-xl bg-[#171E27] hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 transition-colors"
        >
          <span>
            {expanded ? 'Hide' : 'Inspect'} all {filteredCount} filtered assets and suppression reasons
          </span>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
        </button>

        {expanded && (
          <div className="mt-3 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60 bg-[#0E131A]">
            {filteredList.map((item) => (
              <div key={item.symbol} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{item.symbol}</span>
                      <span className="text-[10px] font-mono text-slate-500">· {item.sector}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{item.name}</div>
                  </div>
                </div>

                <div className="sm:text-right font-mono space-y-0.5">
                  <div className="text-slate-300">
                    {formatPrice(item.currentPrice)}{' '}
                    <span className="text-slate-400">
                      ({item.percentChange >= 0 ? '+' : ''}{Number(item.percentChange || 0).toFixed(2)}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.filterReason || 'Move stayed within normal baseline variance'}
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
