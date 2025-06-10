import axios from 'axios';
import router from './router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
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
          // Si la petición es de login, no redirigir, solo rechazar el error
          if (error.config && error.config.url &&
              (error.config.url.includes('/guards/login') || error.config.url.includes('/admins/login'))
          ) {
            // No redirigir, solo rechazar para que el login muestre el mensaje
            break;
          }
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
