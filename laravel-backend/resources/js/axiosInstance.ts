import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'https://riis.denrcalabarzon.com/api', // URL of the Laravel backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
