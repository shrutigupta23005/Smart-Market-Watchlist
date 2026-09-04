import React from 'react';
import { Clock } from 'lucide-react';

export default function AttentionSessionEstimate({ seconds = 10, className = '' }) {
  const formatEstimate = (sec) => {
    if (sec < 60) return `~${sec} sec`;
    const min = Math.ceil(sec / 60);
    return `~${min} min`;
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 ${className}`}
      title="Estimated reading time for changes requiring your attention"
    >
      <Clock className="w-3.5 h-3.5 text-cyan-400" />
      <span>{formatEstimate(seconds)} to review what changed</span>
    </div>
  );
}
