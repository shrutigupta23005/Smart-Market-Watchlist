import React, { useState } from 'react';
import AttentionScoreBadge from './AttentionScoreBadge';
import ChangeFingerprintTag from './ChangeFingerprintTag';
import ReasonList from './ReasonList';
import FeedbackButtons from './FeedbackButtons';
import FreshnessIndicator from '../watchlist/FreshnessIndicator';
import { formatPrice, formatPercent } from '../../utils/formatters';
import { ChevronDown, ChevronUp, History } from 'lucide-react';

export default function SignalCard({ signal, onFeedback, onOpenReplay }) {
  const [expanded, setExpanded] = useState(true);

  if (!signal) return null;

  const isMustSee = signal.bucket === 'MUST_SEE';
  const isWorthChecking = signal.bucket === 'WORTH_CHECKING';

  const cardBorder = isMustSee
    ? 'border-rose-800/80 bg-[#12171E] shadow-rose-950/20 shadow-lg'
    : isWorthChecking
    ? 'border-amber-800/60 bg-[#12171E]'
    : 'border-slate-800/70 bg-[#12171E]/60';

  return (
    <div className={`rounded-xl border p-5 transition-all space-y-4 ${cardBorder}`}>
      {/* Top Row: Symbol, Metadata, Score Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono font-bold text-lg text-slate-100">{signal.symbol}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
              {signal.sector}
            </span>
            <ChangeFingerprintTag
              fingerprint={signal.fingerprint}
              description={signal.fingerprintDesc}
            />
          </div>
          <div className="text-xs text-slate-400">{signal.name}</div>
        </div>

        {/* Attention Score Badge with Confidence Qualifier */}
        <AttentionScoreBadge
          score={signal.attentionScore}
          bucket={signal.bucket}
          confidence={signal.confidence}
          freshness={signal.freshness}
          ageSeconds={signal.ageSeconds}
        />
      </div>

      {/* Middle Row: Price comparison since snapshot */}
      <div className="flex items-baseline justify-between border-y border-slate-800/60 py-3 bg-[#171E27]/40 rounded-lg px-3.5">
        <div>
          <div className="text-[10px] uppercase font-mono text-slate-500">Current Price</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-lg font-semibold text-slate-100">
              {formatPrice(signal.currentPrice)}
            </span>
            <FreshnessIndicator
              freshness={signal.freshness || 'LIVE'}
              ageSeconds={signal.ageSeconds || 0}
              timestamp={signal.timestamp}
              showLabel={false}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-mono text-slate-500">Since Last Visit</div>
          <div
            className={`font-mono text-base font-semibold mt-0.5 ${
              signal.percentChange > 0
                ? 'text-emerald-400'
                : signal.percentChange < 0
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {formatPercent(signal.percentChange)}
          </div>
        </div>
      </div>

      {/* Expandable Explainable Reasons */}
      <div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <span>Explainable Factors ({signal.reasons?.length || 0})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onOpenReplay && (
            <button
              onClick={() => onOpenReplay(signal.symbol)}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Replay Timeline</span>
            </button>
          )}
        </div>

        {expanded && <ReasonList reasons={signal.reasons} />}
      </div>

      {/* Footer Row: Feedback Loop */}
      <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between">
        <FeedbackButtons
          symbol={signal.symbol}
          attentionScore={signal.attentionScore}
          onFeedback={onFeedback}
        />
      </div>
    </div>
  );
}
