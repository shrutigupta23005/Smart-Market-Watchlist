import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { WatchlistProvider } from './context/WatchlistContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import WatchlistManagePage from './pages/WatchlistManagePage';
import SettingsPage from './pages/SettingsPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'watchlist' | 'settings'
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
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

  return (
    <WatchlistProvider>
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDemoSeeded={() => setRefreshKey((k) => k + 1)}
      >
        {activeTab === 'dashboard' && (
          <DashboardPage
            key={refreshKey}
            onNavigateToWatchlist={() => setActiveTab('watchlist')}
          />
        )}
        {activeTab === 'watchlist' && <WatchlistManagePage key={refreshKey} />}
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
