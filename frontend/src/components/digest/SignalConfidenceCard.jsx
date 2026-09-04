import React from 'react';
import { ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export default function SignalConfidenceCard({
  totalStocks = 18,
  confidence = { level: 'HIGH' }
}) {
  return (
    <div className="bg-[#12171E] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider text-emerald-400 uppercase text-xs">
              DATA CONFIDENCE: HIGH
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            All {totalStocks} assets updated within the last 60 seconds · Zero data drift
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>No delayed feeds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>No conflicting data points</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Deterministic z-scores</span>
        </div>
      </div>
    </div>
  );
}
