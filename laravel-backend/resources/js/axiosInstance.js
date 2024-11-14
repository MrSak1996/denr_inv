import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/api', // URL of the Laravel backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

