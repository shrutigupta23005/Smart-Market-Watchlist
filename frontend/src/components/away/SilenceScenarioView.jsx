import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, Leaf, Sparkles, Filter, RefreshCw, ChevronDown, ChevronRight, EyeOff, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function SilenceScenarioView({
  totalStocks = 5,
  awayDuration = { days: 0, hours: 4, minutes: 25 },
  noActionList = [],
  onAcknowledge,
  acking = false,
  onSwitchToChanges
}) {
  const [expandedFilterIndex, setExpandedFilterIndex] = useState(null);

  // Fallback if list is empty
  const defaultNoAction = [
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd.',
      sector: 'Automobile',
      currentPrice: 980.90,
      percentChange: 0.04,
      noiseThreshold: '±1.9%',
      noiseMultiple: '0.02x',
      filterReason: 'Routine bid-ask fluctuation well within baseline volatility (±1.9%)',
      confidence: 'verified'
    },
    {
      symbol: 'INFY',
      name: 'Infosys Ltd.',
      sector: 'Information Technology',
      currentPrice: 1780.50,
      percentChange: 0.02,
      noiseThreshold: '±1.6%',
      noiseMultiple: '0.01x',
      filterReason: 'Tracked sector benchmark exactly (0.0% divergence); zero alert needed',
      confidence: 'verified'
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Energy',
      currentPrice: 2943.10,
      percentChange: 0.09,
      noiseThreshold: '±2.1%',
      noiseMultiple: '0.04x',
      filterReason: 'Price drift did not trigger volume surge or trend reversal',
      confidence: 'verified'
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd.',
      sector: 'Banking & Financial',
      currentPrice: 1640.30,
      percentChange: -0.03,
      noiseThreshold: '±1.4%',
      noiseMultiple: '0.02x',
      filterReason: 'Stable bank index tracking with zero trend reversal',
      confidence: 'verified'
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'Information Technology',
      currentPrice: 4117.50,
      percentChange: -0.06,
      noiseThreshold: '±1.5%',
      noiseMultiple: '0.04x',
      filterReason: 'Move is 0.04x daily standard deviation; filtered as noise',
      confidence: 'verified'
    }
  ];

  const displayList = noActionList && noActionList.length > 0 ? noActionList : defaultNoAction;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. SILENCE HERO SANCTUARY */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0C1518] via-[#0D161C] to-[#0A0E13] border border-emerald-900/40 p-8 sm:p-12 shadow-2xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Top Status Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO CRITICAL ALERTS · SILENCE IS A FEATURE</span>
          </div>

          {/* Core Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-100">
              You didn't miss anything important.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              <strong className="text-slate-200">{totalStocks} stocks</strong> tracked across your{' '}
              <strong className="text-emerald-400">
                {awayDuration?.days > 0 ? `${awayDuration.days}d ` : ''}
                {awayDuration?.hours || 4}h {awayDuration?.minutes || 25}m
              </strong>{' '}
              absence. The market moved, but <span className="text-emerald-300 font-semibold underline decoration-emerald-500/40">nothing crossed your attention threshold</span>.
            </p>
          </div>

          {/* Philosophy Banner Quote */}
          <div className="p-4 rounded-xl bg-[#121E23]/60 border border-emerald-800/40 text-center max-w-xl mx-auto">
            <p className="text-xs font-mono text-emerald-300 italic">
              "The smartest watchlist knows when NOT to demand your attention."
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onAcknowledge}
              disabled={acking}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${acking ? 'animate-spin' : ''}`} />
              <span>Lock Baseline Snapshot & Stay Silent</span>
            </button>

            <button
              onClick={onSwitchToChanges}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs font-mono transition-all border border-slate-700"
            >
              Switch to "Changes" Scenario →
            </button>
          </div>
        </div>
      </div>

      {/* 2. ATTENTION PRESERVATION METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12171E] border border-emerald-900/30 rounded-2xl p-5 text-center space-y-1">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Must See</div>
          <div className="text-3xl font-bold font-mono text-emerald-300">0</div>
          <div className="text-[11px] text-slate-500">Zero panic triggers</div>
        </div>

        <div className="bg-[#12171E] border border-emerald-900/30 rounded-2xl p-5 text-center space-y-1">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Worth Checking</div>
          <div className="text-3xl font-bold font-mono text-emerald-300">0</div>
          <div className="text-[11px] text-slate-500">Zero moderate deviations</div>
        </div>

        <div className="bg-[#12171E] border border-emerald-900/30 rounded-2xl p-5 text-center space-y-1">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Filtered as Noise</div>
          <div className="text-3xl font-bold font-mono text-slate-200">{displayList.length}</div>
          <div className="text-[11px] text-slate-500">100% within noise bands</div>
        </div>

        <div className="bg-[#12171E] border border-emerald-900/30 rounded-2xl p-5 text-center space-y-1">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Focus Streak</div>
          <div className="text-3xl font-bold font-mono text-cyan-300">4 / 4</div>
          <div className="text-[11px] text-slate-500">Clean intentional visits</div>
        </div>
      </div>

      {/* 3. NOISE FILTERING PROOF (THE MATHEMATICAL TRANSPARENCY) */}
      <div className="bg-[#12171E] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Noise Filter Transparency Log
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical proof: Why SIGNAL evaluated these movements and intentionally suppressed them.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 self-start sm:self-auto">
            {displayList.length} of {displayList.length} Quiet Stocks
          </span>
        </div>

        {/* List of Filtered Items */}
        <div className="divide-y divide-slate-800/60">
          {displayList.map((item, idx) => {
            const isExpanded = expandedFilterIndex === idx;
            const isPositive = item.percentChange >= 0;

            return (
              <div key={item.symbol} className="py-3.5 hover:bg-slate-800/20 px-2 rounded-lg transition-colors">
                <div
                  className="flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedFilterIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-100">{item.symbol}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.sector}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{item.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-sm font-medium text-slate-200">
                        {formatPrice(item.currentPrice)}
                      </div>
                      <div className={`text-xs font-mono ${isPositive ? 'text-slate-400' : 'text-slate-400'}`}>
                        {isPositive ? '+' : ''}{Number(item.percentChange || 0).toFixed(2)}%
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        Filtered Noise
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Mathematical Explanation */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 bg-[#171E27]/50 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span>Historical Noise Threshold: <strong className="text-slate-200">{item.noiseThreshold || '±1.8%'}</strong></span>
                      <span>Relative Magnitude: <strong className="text-slate-200">{item.noiseMultiple || '0.03x'}</strong></span>
                    </div>
                    <p className="text-slate-300 font-mono leading-relaxed">
                      💡 {item.filterReason || 'Movement stayed strictly within normal baseline variance with zero trend reversal or sector decoupling.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SILENCE AS A FEATURE MANIFESTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
            <EyeOff className="w-4 h-4" />
            <span>Attention Shield</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Other platforms treat every 0.05% fluctuation as breaking news. SIGNAL actively blocks false alarms from invading your day.
          </p>
        </div>

        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Scoring</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero black-box AI guessing. Every threshold is normalized against 20-period trailing standard deviations and sector benchmarks.
          </p>
        </div>

        <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase">
            <Leaf className="w-4 h-4" />
            <span>Gets Quieter Over Time</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            As you mark alerts useful or dismiss noise, the platform decays repeated triggers and increases silence.
          </p>
        </div>
      </div>
    </div>
  );
}
