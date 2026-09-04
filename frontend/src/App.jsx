import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { WatchlistProvider } from './context/WatchlistContext';
import { useAwaySummary } from './hooks/useAwaySummary';
import axiosClient from './api/axiosClient';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WatchlistManagePage from './pages/WatchlistManagePage';
import SettingsPage from './pages/SettingsPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'watchlist' | 'settings'

  const {
    summary,
    loading: summaryLoading,
    refreshSummary,
    ackSession,
    submitFeedback
  } = useAwaySummary();

  const handleSwitchScenario = async (mode) => {
    try {
      await axiosClient.post(`/demo/seed?mode=${mode}`);
      await refreshSummary(true);
    } catch (err) {
      console.error('Failed to switch scenario:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center text-slate-500 font-mono text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        <span>Initializing SIGNAL...</span>
      </div>
    );
  }

  if (!user) {
    if (authView === 'signup') {
      return <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />;
  }

  const currentScenario = summary?.nothingHappened ? 'nothing_happened' : 'rich_signals';

  return (
    <WatchlistProvider>
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={currentScenario}
        onSwitchScenario={handleSwitchScenario}
        onDemoSeeded={() => refreshSummary(true)}
      >
        {activeTab === 'dashboard' && (
          <DashboardPage
            summary={summary}
            loading={summaryLoading}
            refreshSummary={refreshSummary}
            ackSession={ackSession}
            submitFeedback={submitFeedback}
            onNavigateToWatchlist={() => setActiveTab('watchlist')}
          />
        )}
        {activeTab === 'watchlist' && <WatchlistManagePage />}
        {activeTab === 'settings' && <SettingsPage />}
      </AppShell>
    </WatchlistProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
