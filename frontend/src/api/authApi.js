import axiosClient from './axiosClient';

export const loginApi = (credentials) => axiosClient.post('/auth/login', credentials);
export const signupApi = (userData) => axiosClient.post('/auth/signup', userData);
export const guestLoginApi = () => axiosClient.post('/auth/guest');
export const getMeApi = () => axiosClient.get('/auth/me');
export const updatePreferencesApi = (preferences) => axiosClient.patch('/preferences', preferences);
