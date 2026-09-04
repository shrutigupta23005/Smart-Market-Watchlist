import React from 'react';
import { Clock } from 'lucide-react';

export default function AwayDurationBadge({ awayDuration }) {
  if (!awayDuration) return null;

  const { days = 0, hours = 0, minutes = 0 } = awayDuration;
  let durationText = '';

  if (days > 0) {
    durationText = `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    durationText = `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} min` : ''}`;
  } else if (minutes > 0) {
    durationText = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    durationText = 'just a few moments';
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171E27] border border-slate-800 text-slate-300 font-mono text-xs">
      <Clock className="w-3.5 h-3.5 text-cyan-400" />
      <span>
        Away for <strong className="text-cyan-300 font-semibold">{durationText}</strong>
      </span>
    </div>
  );
}
