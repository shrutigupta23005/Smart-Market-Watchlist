export const ATTENTION_BUCKETS = {
  MUST_SEE: {
    min: 70,
    label: 'MUST SEE',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    icon: '🔥'
  },
  WORTH_CHECKING: {
    min: 40,
    max: 69,
    label: 'WORTH CHECKING',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    icon: '👀'
  },
  NO_ACTION: {
    max: 39,
    label: 'NO ACTION',
    badgeClass: 'bg-slate-800/60 text-slate-400 border-slate-700/80',
    icon: '😌'
  }
};

export const FINGERPRINTS = {
  DIVERGENT_MOVE: { label: 'Divergent Move', color: 'text-purple-400 bg-purple-950/50 border-purple-800' },
  VOLATILITY_SPIKE: { label: 'Volatility Spike', color: 'text-amber-400 bg-amber-950/50 border-amber-800' },
  SUDDEN_REVERSAL: { label: 'Sudden Reversal', color: 'text-cyan-400 bg-cyan-950/50 border-cyan-800' },
  RECOVERY: { label: 'Recovery', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800' },
  NEW_HIGH: { label: 'New Period High', color: 'text-teal-400 bg-teal-950/50 border-teal-800' },
  NEW_LOW: { label: 'New Period Low', color: 'text-red-400 bg-red-950/50 border-red-800' },
  STRONG_MOMENTUM: { label: 'Strong Momentum', color: 'text-blue-400 bg-blue-950/50 border-blue-800' },
  SLOW_DRIFT: { label: 'Slow Drift', color: 'text-indigo-300 bg-indigo-950/50 border-indigo-800' },
  STABLE: { label: 'Stable', color: 'text-slate-400 bg-slate-800/40 border-slate-700' }
};

export const FRESHNESS = {
  LIVE: { label: 'LIVE', dotClass: 'bg-emerald-400 animate-pulse' },
  DELAYED: { label: 'DELAYED', dotClass: 'border border-amber-400 bg-amber-950/50' },
  STALE: { label: 'STALE', dotClass: 'border border-slate-500 bg-slate-800' }
};
