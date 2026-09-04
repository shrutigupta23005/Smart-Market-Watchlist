import React from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function DigestMode({
  enabled,
  onToggle,
  mustSee = [],
  worthChecking = [],
  nothingHappened = false
}) {
  const generateSentence = () => {
    if (nothingHappened) {
      return 'Quiet session: no meaningful reversals or divergence occurred in your watchlist.';
    }

    const points = [];
    if (mustSee.length > 0) {
      const top = mustSee[0];
      const direction = top.percentChange < 0 ? 'dropped sharply' : 'surged sharply';
      points.push(`${top.symbol} ${direction} (${top.percentChange > 0 ? '+' : ''}${top.percentChange}%)`);
    }

    if (mustSee.length > 1) {
      points.push(`${mustSee.length - 1} other stock${mustSee.length > 2 ? 's' : ''} require attention`);
    }

    if (worthChecking.length > 0) {
      points.push(`${worthChecking.length} asset${worthChecking.length > 1 ? 's' : ''} experienced moderate drift`);
    }

    return `${mustSee.length + worthChecking.length} items worth noting: ${points.join('; ')}.`;
  };

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Digest Mode · TL;DR
          </div>
          <div className="text-sm text-slate-200 mt-0.5 leading-snug">
            {generateSentence()}
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="self-end sm:self-center px-3 py-1.5 rounded-lg border border-slate-800 bg-[#171E27] hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors shrink-0"
      >
        <span>{enabled ? 'Show Detail Cards' : 'Digest View'}</span>
        {enabled ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
