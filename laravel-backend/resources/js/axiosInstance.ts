import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.0.173:8000/api', // URL of the Laravel backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the Authorization header for every request
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('api_token'); // Store token securely
  if (token) {
    config.headers = {
      ...config.headers, // Ensure existing headers are preserved
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default api;
