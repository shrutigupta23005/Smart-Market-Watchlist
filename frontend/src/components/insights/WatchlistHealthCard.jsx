import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Shield, Sparkles, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function WatchlistHealthCard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axiosClient.get('/insights/health');
        if (res.success) {
          setHealth(res.data);
        }
      } catch (err) {
        console.error('Failed to load watchlist health:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading || !health) return null;

  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-100">
              Watchlist Health · {health.healthScore}/100
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              <TrendingDown className="w-3 h-3" />
              {health.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {health.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right font-mono text-xs self-end sm:self-center">
        <div>
          <div className="text-[10px] uppercase text-slate-500">Noise Suppression</div>
          <div className="text-sm font-semibold text-slate-200">{health.noiseSuppressionRate}</div>
        </div>
        <div className="border-l border-slate-800 pl-4">
          <div className="text-[10px] uppercase text-slate-500">Tracked Assets</div>
          <div className="text-sm font-semibold text-slate-200">{health.activeTrackedCount}</div>
        </div>
      </div>
    </div>
  );
}
