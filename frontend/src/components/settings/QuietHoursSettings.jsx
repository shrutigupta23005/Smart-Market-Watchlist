import React from 'react';
import { Moon } from 'lucide-react';

export default function QuietHoursSettings({ enabled, onToggle, start, onStartChange, end, onEndChange }) {
  return (
    <div className="bg-[#12171E] border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Moon className="w-4 h-4 text-purple-400" />
          <span>Quiet Hours</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
        </label>
      </div>
      <p className="text-xs text-slate-400">
        During quiet hours, new alerts are de-emphasized into calm background digests rather than demanding priority.
      </p>

      {enabled && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/60 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Start Time</label>
            <input
              type="time"
              value={start}
              onChange={(e) => onStartChange(e.target.value)}
              className="w-full bg-[#171E27] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">End Time</label>
            <input
              type="time"
              value={end}
              onChange={(e) => onEndChange(e.target.value)}
              className="w-full bg-[#171E27] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
