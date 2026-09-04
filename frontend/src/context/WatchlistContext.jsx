import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getWatchlistApi, addWatchlistApi, removeWatchlistApi } from '../api/watchlistApi';
import { useAuth } from '../hooks/useAuth';
import { usePolling } from '../hooks/usePolling';

export const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(async (isBackground = false) => {
    if (!user) {
      setWatchlist([]);
      return;
    }
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const res = await getWatchlistApi();
      if (res.success && res.data) {
        setWatchlist(res.data);
      }
    } catch (err) {
      if (!isBackground) setError(err?.error || 'Failed to fetch watchlist');
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Auto poll every 10 seconds in the background
  usePolling(() => {
    fetchWatchlist(true);
  }, 10000, Boolean(user));

  const addToWatchlist = async (symbol) => {
    const res = await addWatchlistApi(symbol);
    if (res.success && res.data) {
      await fetchWatchlist();
      return res.data;
    }
  };

  const removeFromWatchlist = async (symbol) => {
    const res = await removeWatchlistApi(symbol);
    if (res.success) {
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
      return true;
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        error,
        addToWatchlist,
        removeFromWatchlist,
        refreshWatchlist: fetchWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
