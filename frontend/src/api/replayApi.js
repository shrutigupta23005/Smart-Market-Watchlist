import axiosClient from './axiosClient';

export const getReplayApi = (symbol, range = '24h') =>
  axiosClient.get(`/replay?symbol=${encodeURIComponent(symbol)}&range=${encodeURIComponent(range)}`);

export const getWatchlistReplayApi = (range = '24h') =>
  axiosClient.get(`/replay/watchlist?range=${encodeURIComponent(range)}`);
