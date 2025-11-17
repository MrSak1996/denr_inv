import axios from 'axios';
const api = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://10.201.13.78:8000/api/',
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://riis.denrcalabarzon.com/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Attach token dynamically on each request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('api_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));
export default api;
