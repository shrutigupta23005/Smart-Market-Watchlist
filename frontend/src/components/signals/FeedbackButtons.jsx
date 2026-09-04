import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

export default function FeedbackButtons({ symbol, alertId, attentionScore, onFeedback }) {
  const [submitted, setSubmitted] = useState(null);

  const handleClick = (action) => {
    setSubmitted(action);
    if (onFeedback) {
      onFeedback({
        symbol,
        alertId: alertId || `${symbol}-${Date.now()}`,
        action,
        attentionScoreAtTime: attentionScore
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
        <Check className="w-3 h-3 text-cyan-400" />
        <span>Feedback saved · SIGNAL will adjust sensitivity</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
      <span>Was this alert relevant?</span>
      <button
        onClick={() => handleClick('useful')}
        title="Helpful alert"
        className="px-2 py-0.5 rounded border border-slate-800 hover:border-cyan-800 bg-[#171E27] hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
      >
        <ThumbsUp className="w-3 h-3" />
        <span>Useful</span>
      </button>
      <button
        onClick={() => handleClick('not_useful')}
        title="Quiet this type of signal"
        className="px-2 py-0.5 rounded border border-slate-800 hover:border-rose-900 bg-[#171E27] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
      >
        <ThumbsDown className="w-3 h-3" />
        <span>Not useful</span>
      </button>
    </div>
  );
}
