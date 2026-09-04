import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './useAuth';

export function useAwaySummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async (background = false) => {
    if (!user) return;
    if (!background) setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/away-summary');
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      if (!background) setError(err?.error || 'Failed to fetch away summary');
    } finally {
      if (!background) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const ackSession = async () => {
    try {
      const res = await axiosClient.post('/away-summary/ack');
      if (res.success) {
        await fetchSummary(true);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to acknowledge session:', err);
    }
  };

  const submitFeedback = async ({ symbol, alertId, action, attentionScoreAtTime }) => {
    try {
      await axiosClient.post('/feedback', {
        symbol,
        alertId,
        action,
        attentionScoreAtTime
      });
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  return {
    summary,
    loading,
    error,
    refreshSummary: fetchSummary,
    ackSession,
    submitFeedback
  };
}
