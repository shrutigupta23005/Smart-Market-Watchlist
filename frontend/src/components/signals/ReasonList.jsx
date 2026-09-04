import React from 'react';
import { Check } from 'lucide-react';

export default function ReasonList({ reasons = [] }) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="text-xs text-slate-500 font-mono">
        No meaningful deviation from baseline.
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 mt-2.5">
      {reasons.map((reason, idx) => (
        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
          <span className="w-4 h-4 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
            ✓
          </span>
          <span className="leading-relaxed">{reason}</span>
        </li>
      ))}
    </ul>
  );
}
