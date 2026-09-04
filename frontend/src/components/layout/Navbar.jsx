import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../api/axiosClient';
import { Shield, Eye, Settings, LogOut, TrendingUp, Sparkles, Check, Loader2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onDemoSeeded }) {
  const { user, logout } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('rich_signals');

  const triggerSeed = async (mode) => {
    setSeeding(true);
    setCurrentScenario(mode);
    try {
      await axiosClient.post(`/demo/seed?mode=${mode}`);
      if (onDemoSeeded) {
        onDemoSeeded(mode);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to seed demo scenario:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#0B0E11]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm tracking-wider font-semibold text-slate-100 uppercase">SIGNAL</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">What actually changed since you looked</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              While You Were Away
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              Watchlist
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'settings'
                  ? 'bg-slate-800/80 text-cyan-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Demo Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* Demo Preset Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-[#171E27] p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-500 px-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Scenario:
            </span>
            <button
              onClick={() => triggerSeed('rich_signals')}
              disabled={seeding}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentScenario === 'rich_signals'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Changes
            </button>
            <button
              onClick={() => triggerSeed('nothing_happened')}
              disabled={seeding}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentScenario === 'nothing_happened'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Silence
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-slate-200">{user?.name}</span>
            <span className="text-[10px] font-mono text-slate-500">Threshold: {user?.preferences?.attentionThreshold || 70}</span>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
