import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AttentionStreakBadge({ streakCount = 0, className = '' }) {
  if (streakCount <= 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/60 select-none ${className}`}
      title="Consecutive check-ins in a row where no noisy false alarms occurred"
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
      <span>
        {streakCount} check-in{streakCount > 1 ? 's' : ''} in a row, no noise
      </span>
    </div>
  );
}
