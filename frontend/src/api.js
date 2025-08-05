import axios from 'axios';
import router from '../router';


// Detect environment and set API baseURL accordingly
let baseURL = import.meta.env.VITE_API_URL;
if (typeof window !== 'undefined') {
  // If running in browser, adjust for Docker/local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    baseURL = 'http://localhost:3000/api';
  } else {
    // If running in Docker (accessed by container name or IP), use env or fallback
    baseURL = baseURL || 'http://backend:3000/api';
  }
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
