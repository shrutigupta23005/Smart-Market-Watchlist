import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
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

// Response interceptor: auto logout on 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('signal_token');
      localStorage.removeItem('signal_user');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosClient;
