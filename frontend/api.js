import axios from 'axios';
import router from './router';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
    if (error.response) {
      // Server error responses (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          // Unauthorized, clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          if (router.currentRoute.value.path !== '/') {
            router.push('/');
          }
          break;
        case 403:
          // Forbidden
          router.push('/dashboard');
          break;
        case 404:
          // Not found
          router.push('/not-found');
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
