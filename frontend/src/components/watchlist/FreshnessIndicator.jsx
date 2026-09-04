import React from 'react';

/**
 * FreshnessIndicator
 * Mandatory on every price shown anywhere in the UI.
 * LIVE: pulsing green dot (<60s)
 * DELAYED: amber outline dot (60s-15m)
 * STALE: slate outline dot (>=15m) with timestamp
 */
export default function FreshnessIndicator({ freshness = 'LIVE', ageSeconds = 0, timestamp, showLabel = true }) {
  const isLive = freshness === 'LIVE';
  const isDelayed = freshness === 'DELAYED';
  const isStale = freshness === 'STALE';

  return (
    <div
      className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider select-none"
      title={`Data Freshness: ${freshness} (${ageSeconds !== undefined ? `${ageSeconds}s old` : ''}${timestamp ? ` · ${new Date(timestamp).toLocaleTimeString()}` : ''})`}
    >
      {/* Visual Dot */}
      {isLive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}

      {isDelayed && (
        <span className="inline-block h-2 w-2 rounded-full border border-amber-400 bg-amber-950/60"></span>
      )}

      {isStale && (
        <span className="inline-block h-2 w-2 rounded-full border border-slate-500 bg-slate-800"></span>
      )}

      {/* Text Label */}
      {showLabel && (
        <span
          className={`font-semibold uppercase ${
            isLive ? 'text-emerald-400' : isDelayed ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          {freshness}
          {isStale && timestamp && ` · ${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </span>
      )}
    </div>
  );
}
