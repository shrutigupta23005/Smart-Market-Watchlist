import axiosClient from './axiosClient';

export const searchStocksApi = (query = '') => axiosClient.get(`/market/search?q=${encodeURIComponent(query)}`);
