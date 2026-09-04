import React from 'react';
import { History, ArrowRight, GitCommit, Calendar, Activity } from 'lucide-react';

export default function MarketStoryReplay({
  onOpenFullReplay
}) {
  const narrativeSteps = [
    {
      period: 'Day 1 · Initial Sector Move',
      badge: 'IT Sector Drop',
      badgeColor: 'text-indigo-300 bg-indigo-950/80 border-indigo-800',
      headline: 'IT stocks began declining together',
      description: 'Synchronized selling hit TCS, Infosys, Wipro, and HCLTech (-2.1% average move) following overseas tech revisions.',
      time: '2 days ago'
    },
    {
      period: 'Day 2 · Midday Volatility',
      badge: 'High-Volume Breakout',
      badgeColor: 'text-rose-300 bg-rose-950/80 border-rose-800',
      headline: 'Reliance had a sharp reversal midday',
      description: 'Heavy institutional turnover (2.4x average) breached 20-day support, decoupling from the wider Energy index.',
      time: 'Yesterday 1:45 PM'
    },
    {
      period: 'Now · Present Baseline',
      badge: 'Stabilization & Drift',
      badgeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-800',
      headline: 'Market stabilized with IT still suppressed',
      description: 'Tata Motors maintains positive breakout (+6.09%); Banking consolidated; IT remains quietened at new support levels.',
      time: 'Current'
    }
  ];

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-200">
            Section 5 · Market Story & Replay
          </h2>
        </div>

        <button
          onClick={onOpenFullReplay}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Explore Interactive Scrubber</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Chronological Narrative Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {narrativeSteps.map((step, idx) => (
          <div
            key={idx}
            className="bg-[#171E27]/80 border border-slate-800/80 rounded-xl p-4 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 font-semibold">{step.period}</span>
              <span className="text-slate-500">{step.time}</span>
            </div>

            <div>
              <span className={`inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border mb-1.5 ${step.badgeColor}`}>
                {step.badge}
              </span>
              <h3 className="text-sm font-semibold text-slate-200 font-sans leading-snug">
                {step.headline}
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
