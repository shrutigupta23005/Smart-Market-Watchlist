import React from 'react';
import Navbar from './Navbar';

export default function AppShell({ children, activeTab, setActiveTab, onDemoSeeded }) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-slate-200 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onDemoSeeded={onDemoSeeded} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        SIGNAL · Attention is protected · No predictions, pure explainable change
      </footer>
    </div>
  );
}
