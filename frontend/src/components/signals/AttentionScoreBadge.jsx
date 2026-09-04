import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AttentionScoreBadge({ score = 0, bucket = 'NO_ACTION', confidence = 'verified', freshness = 'LIVE', ageSeconds = 0 }) {
  const isMustSee = bucket === 'MUST_SEE' || score >= 70;
  const isWorthChecking = (bucket === 'WORTH_CHECKING' || (score >= 40 && score < 70)) && !isMustSee;

  let scoreColor = 'text-slate-400 border-slate-700 bg-slate-800/40';
  let badgeLabel = 'NO ACTION';

  if (isMustSee) {
    scoreColor = 'text-rose-400 border-rose-800/80 bg-rose-950/40';
    badgeLabel = 'MUST SEE';
  } else if (isWorthChecking) {
    scoreColor = 'text-amber-400 border-amber-800/80 bg-amber-950/40';
    badgeLabel = 'WORTH CHECKING';
  }

  const isVerified = confidence === 'verified' && freshness === 'LIVE';

  return (
    <div className="flex flex-col items-end gap-1 font-mono">
      {/* Score Pill */}
      <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 ${scoreColor}`}>
        <span className="text-xl font-bold tracking-tight">{score}</span>
        <span className="text-[10px] uppercase tracking-wider font-semibold border-l border-current/30 pl-2">
          {badgeLabel}
        </span>
      </div>

      {/* Confidence Qualifier */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        {isVerified ? (
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3 h-3" /> verified live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-400/90 font-medium" title={`Score computed with ${freshness} data (${ageSeconds}s old)`}>
            <AlertTriangle className="w-3 h-3" /> est. ({freshness.toLowerCase()})
          </span>
        )}
      </div>
    </div>
  );
}
