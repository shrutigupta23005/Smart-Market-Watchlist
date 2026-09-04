import React, { useState, useEffect } from 'react';
import { getReplayApi, getWatchlistReplayApi } from '../../api/replayApi';
import ReplayEventRow from './ReplayEventRow';
import { History, X, Loader2, Calendar } from 'lucide-react';

export default function MarketReplayTimeline({ symbol, onClose, isOpen = true }) {
  const [range, setRange] = useState('24h');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchReplay = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (symbol) {
          res = await getReplayApi(symbol, range);
        } else {
          res = await getWatchlistReplayApi(range);
        }

        if (isMounted && res.success) {
          setEvents(res.data || []);
        }
      } catch (err) {
        if (isMounted) setError(err?.error || 'Failed to load market replay');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReplay();
    return () => {
      isMounted = false;
    };
  }, [symbol, range, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12171E] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-mono">
                Market Replay {symbol ? `· ${symbol}` : '· Watchlist Merged'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Chronological sequence of meaningful events while you were away.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Range Controls */}
        <div className="px-6 py-2.5 bg-[#171E27]/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Time Horizon:
          </span>
          <div className="flex items-center gap-1 bg-[#12171E] p-0.5 rounded-lg border border-slate-800">
            {['24h', '48h', '7d'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  range === r
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Fetching chronological timeline...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-rose-400 text-xs font-mono">{error}</div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No significant change events recorded in this window.
            </div>
          ) : (
            <div className="pt-2">
              {events.map((evt, idx) => (
                <ReplayEventRow
                  key={evt._id || idx}
                  event={evt}
                  isLast={idx === events.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#171E27]/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Sparse event log · Only meaningful threshold crossings</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
