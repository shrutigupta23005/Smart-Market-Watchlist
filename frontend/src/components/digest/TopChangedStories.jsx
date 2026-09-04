import React from 'react';
import { Flame, Eye, ArrowUpRight, ArrowDownRight, History, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import ChangeFingerprintTag from '../signals/ChangeFingerprintTag';
import { formatPrice } from '../../utils/formatters';

export default function TopChangedStories({
  mustSee = [],
  worthChecking = [],
  onFeedback,
  onOpenReplay
}) {
  const combinedSignals = [...mustSee, ...worthChecking];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🔥</span>
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-rose-300">
              Section 3 · What Changed Most (The Core Value)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Top story cards explaining why these assets crossed your attention threshold.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Ranked by plain-English deterministic scores
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {combinedSignals.map((signal) => {
          const isPositive = signal.percentChange >= 0;
          const isMustSee = signal.bucket === 'MUST_SEE' || (signal.attentionScore >= 70);
          const fingerprints = signal.fingerprints && signal.fingerprints.length > 0
            ? signal.fingerprints
            : [signal.fingerprint || (isPositive ? 'PRICE_BREAKOUT' : 'TREND_REVERSAL')];

          return (
            <div
              key={signal.symbol}
              className="bg-[#12171E] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-4 transition-all flex flex-col justify-between"
            >
              {/* Card Header: Ticker, Sector, Attention Badge, Price & Change */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-slate-100">{signal.symbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {signal.sector}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{signal.name}</div>
                  </div>

                  {/* Attention Badge */}
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider border ${
                      isMustSee
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                    }`}
                  >
                    {isMustSee ? 'MUST SEE' : 'WORTH CHECKING'} · {signal.attentionScore}
                  </span>
                </div>

                {/* Price & Change */}
                <div className="flex items-baseline justify-between border-y border-slate-800/60 py-2.5">
                  <div className="font-mono text-lg font-semibold text-slate-100">
                    {formatPrice(signal.currentPrice)}
                  </div>
                  <div
                    className={`flex items-center gap-1 font-mono text-sm font-bold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{isPositive ? '+' : ''}{Number(signal.percentChange || 0).toFixed(2)}%</span>
                  </div>
                </div>

                {/* Change Fingerprint visual chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {fingerprints.map((fp, idx) => (
                    <ChangeFingerprintTag key={idx} fingerprint={fp} />
                  ))}
                </div>

                {/* "Why this matters" plain English bullet points */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Why this matters:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed">
                    {(signal.reasons || []).map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Replay trigger & Feedback buttons */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => onOpenReplay && onOpenReplay(signal.symbol)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Replay stock path →</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFeedback && onFeedback({ symbol: signal.symbol, action: 'useful', attentionScoreAtTime: signal.attentionScore })}
                    title="Mark this alert useful (strengthens signal)"
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFeedback && onFeedback({ symbol: signal.symbol, action: 'noise', attentionScoreAtTime: signal.attentionScore })}
                    title="Dismiss as noise (trains system to quiet this stock)"
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
