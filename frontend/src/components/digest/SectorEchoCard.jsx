import React from 'react';
import { Layers, ArrowDownRight, ShieldCheck, Sparkles } from 'lucide-react';
import { formatPercent } from '../../utils/formatters';

export default function SectorEchoCard({
  group
}) {
  const defaultGroup = {
    title: 'IT Sector Echo',
    headline: 'IT Sector Echo: TCS, INFY, WIPRO, HCLTECH all declined ~2.1% together',
    explanation: 'This was a sector-wide move, not individual company news.',
    stocks: [
      { symbol: 'TCS', percentChange: -2.38 },
      { symbol: 'INFY', percentChange: -2.55 },
      { symbol: 'WIPRO', percentChange: -2.17 },
      { symbol: 'HCLTECH', percentChange: -2.10 }
    ],
    correlationScore: 0.89
  };

  const data = group || defaultGroup;
  const headlineText = data.summary || data.headline || 'IT Sector Echo: TCS, INFY, WIPRO, HCLTECH all declined ~2.1% together';

  return (
    <div className="bg-[#12171E] border border-indigo-900/40 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/30 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-indigo-300">
            Section 6 · Sector Echo (Correlated Co-movement)
          </h2>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 self-start sm:self-auto">
          4 Alerts Collapsed into 1
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">
            {headlineText}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {data.explanation || 'This was a sector-wide move, not individual company news.'}
          </p>
        </div>

        {/* Constituent stock badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {(data.stocks || []).map((stk) => (
            <div
              key={stk.symbol}
              className="px-3 py-1.5 rounded-lg bg-[#171E27] border border-slate-800 flex items-center gap-2 text-xs font-mono"
            >
              <span className="font-bold text-slate-200">{stk.symbol}</span>
              <span className="text-rose-400 flex items-center font-semibold">
                <ArrowDownRight className="w-3 h-3" />
                {formatPercent(stk.percentChange)}
              </span>
            </div>
          ))}
        </div>

        {/* Bulleted justification */}
        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-slate-300 space-y-1.5 font-sans">
          <div className="flex items-center gap-2 text-indigo-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Attention Shield Rationale</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Correlated co-movement detected across 4 tech exporters with 0.89 correlation coefficient. Individual alerts were collapsed into this single sector digest item to prevent alert fatigue.
          </p>
        </div>
      </div>
    </div>
  );
}
