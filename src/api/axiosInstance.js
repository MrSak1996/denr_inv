import axios from 'axios';
const token = localStorage.getItem('api_token');
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://riis.denrcalabarzon.com/api/',
    // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://10.201.12.207:8000/api/',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
});
export default api;
