import axios from 'axios';
const token = localStorage.getItem('api_token');
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://riis.denrcalabarzon.com/api/',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
});
export default api;
