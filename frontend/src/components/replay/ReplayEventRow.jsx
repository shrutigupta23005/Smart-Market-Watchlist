import React from 'react';
import { formatRelativeTime, formatPercent } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight, Activity, ArrowUpDown, GitCompare, Zap } from 'lucide-react';

export default function ReplayEventRow({ event, isLast = false }) {
  if (!event) return null;

  const { eventType, magnitude, description, timestamp, symbol } = event;

  const getEventBadge = () => {
    switch (eventType) {
      case 'drop':
        return {
          icon: <ArrowDownRight className="w-3.5 h-3.5" />,
          color: 'text-rose-400 bg-rose-950/40 border-rose-800',
          dot: 'bg-rose-500'
        };
      case 'spike':
        return {
          icon: <Activity className="w-3.5 h-3.5" />,
          color: 'text-amber-400 bg-amber-950/40 border-amber-800',
          dot: 'bg-amber-500'
        };
      case 'recovery':
        return {
          icon: <ArrowUpRight className="w-3.5 h-3.5" />,
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 'reversal':
        return {
          icon: <ArrowUpDown className="w-3.5 h-3.5" />,
          color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800',
          dot: 'bg-cyan-500'
        };
      case 'divergence':
        return {
          icon: <GitCompare className="w-3.5 h-3.5" />,
          color: 'text-purple-400 bg-purple-950/40 border-purple-800',
          dot: 'bg-purple-500'
        };
      default:
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          color: 'text-slate-400 bg-slate-800/40 border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const badge = getEventBadge();

  return (
    <div className="relative pl-6 pb-6 group">
      {/* Vertical Timeline Line */}
      {!isLast && (
        <div className="absolute left-[7px] top-3 bottom-0 w-[2px] bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>
      )}

      {/* Timeline Node Dot */}
      <div
        className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#12171E] ${badge.dot} shadow-md`}
      ></div>

      <div className="bg-[#171E27]/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {symbol && (
              <span className="font-mono font-bold text-xs text-slate-200">{symbol}</span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${badge.color}`}
            >
              {badge.icon}
              <span>{eventType}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span
              className={`font-semibold ${
                magnitude > 0
                  ? 'text-emerald-400'
                  : magnitude < 0
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {formatPercent(magnitude)}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{formatRelativeTime(timestamp)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
