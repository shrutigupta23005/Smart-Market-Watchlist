import axiosClient from './axiosClient';

export const getWatchlistApi = () => axiosClient.get('/watchlist');
export const addWatchlistApi = (symbol) => axiosClient.post('/watchlist', { symbol });
export const removeWatchlistApi = (symbol) => axiosClient.delete(`/watchlist/${symbol}`);
