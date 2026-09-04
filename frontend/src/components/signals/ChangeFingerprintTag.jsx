import React from 'react';
import { FINGERPRINTS } from '../../utils/constants';
import { Zap, GitCompare, ArrowUpDown, TrendingUp, Activity, Compass } from 'lucide-react';

export default function ChangeFingerprintTag({ fingerprint = 'STABLE', description }) {
  const meta = FINGERPRINTS[fingerprint] || {
    label: fingerprint,
    color: 'text-slate-400 bg-slate-800/40 border-slate-700'
  };

  const getIcon = () => {
    switch (fingerprint) {
      case 'DIVERGENT_MOVE':
        return <GitCompare className="w-3 h-3" />;
      case 'VOLATILITY_SPIKE':
        return <Activity className="w-3 h-3" />;
      case 'SUDDEN_REVERSAL':
        return <ArrowUpDown className="w-3 h-3" />;
      case 'RECOVERY':
        return <TrendingUp className="w-3 h-3" />;
      case 'STRONG_MOMENTUM':
        return <Zap className="w-3 h-3" />;
      default:
        return <Compass className="w-3 h-3" />;
    }
  };

  return (
    <span
      title={description}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border uppercase tracking-wider ${meta.color}`}
    >
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
}
