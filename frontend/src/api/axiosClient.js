import axios from 'axios';
import { mockEngine } from './mockEngine';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('signal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper for browser mock responses
function handleMockRoute(url, method, data) {
  const cleanUrl = url.replace(/^\/api/, '');

  if (cleanUrl.startsWith('/auth/me')) {
    return { success: true, data: { user: mockEngine.currentUser } };
  }
  if (cleanUrl.startsWith('/auth/login') || cleanUrl.startsWith('/auth/signup')) {
    return { success: true, data: { token: 'mock_jwt_token_2026', user: mockEngine.currentUser } };
  }
  if (cleanUrl.startsWith('/away-summary/ack')) {
    mockEngine.setScenario('nothing_happened');
    return { success: true, data: { acknowledged: true, snapshotTime: new Date().toISOString() } };
  }
  if (cleanUrl.startsWith('/away-summary')) {
    return { success: true, data: mockEngine.getAwaySummary() };
  }
  if (cleanUrl.startsWith('/watchlist') && method === 'get') {
    return { success: true, data: mockEngine.getWatchlistItems() };
  }
  if (cleanUrl.startsWith('/watchlist') && method === 'post') {
    const sym = data?.symbol?.toUpperCase();
    if (sym && !mockEngine.watchlist.includes(sym)) {
      mockEngine.watchlist.push(sym);
    }
    return { success: true, data: { symbol: sym } };
  }
  if (cleanUrl.startsWith('/watchlist/') && method === 'delete') {
    const sym = cleanUrl.split('/')[2];
    mockEngine.watchlist = mockEngine.watchlist.filter(s => s !== sym);
    return { success: true, message: 'Removed' };
  }
  if (cleanUrl.startsWith('/market/search')) {
    return {
      success: true,
      data: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
        { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology' },
        { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Information Technology' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Financial' },
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automotive' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking & Financial' },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecommunications' },
        { symbol: 'ITC', name: 'ITC Ltd', sector: 'Consumer Goods' }
      ]
    };
  }
  if (cleanUrl.startsWith('/replay')) {
    return { success: true, data: mockEngine.getReplayEvents() };
  }
  if (cleanUrl.startsWith('/feedback')) {
    return { success: true, message: 'Feedback recorded' };
  }
  if (cleanUrl.startsWith('/insights/health')) {
    return { success: true, data: { healthScore: 86, grade: 'Optimal', coverageCount: mockEngine.watchlist.length } };
  }
  if (cleanUrl.startsWith('/insights/streak')) {
    return { success: true, data: { streakDays: 4, lastActiveDate: new Date().toISOString() } };
  }
  if (cleanUrl.startsWith('/preferences')) {
    if (data) {
      mockEngine.currentUser.preferences = { ...mockEngine.currentUser.preferences, ...data };
    }
    return { success: true, data: { preferences: mockEngine.currentUser.preferences } };
  }
  if (cleanUrl.startsWith('/demo/seed')) {
    const mode = cleanUrl.includes('nothing_happened') ? 'nothing_happened' : 'rich_signals';
    mockEngine.setScenario(mode);
    return { success: true, message: `Seeded ${mode} scenario`, mode };
  }

  return null;
}

// Response interceptor: auto fallback to mock engine if backend unreachable
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is down or unreachable (static deployment or network failure), provide offline simulation
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || (error.response && error.response.status === 404)) {
      const mockResult = handleMockRoute(error.config?.url || '', error.config?.method?.toLowerCase(), error.config?.data ? JSON.parse(error.config.data) : null);
      if (mockResult) {
        return Promise.resolve(mockResult);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('signal_token');
      localStorage.removeItem('signal_user');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;
