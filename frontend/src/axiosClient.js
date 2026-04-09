// frontend/src/axiosClient.js
import axios from 'axios';

// 1. Instance cho Storefront (Laravel - Port 8000 / Render)
export const axiosUser = axios.create({
  baseURL: import.meta.env.VITE_API_USER_URL || 'https://nhom1be.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
});

// 2. Instance cho Admin (Spring Boot - Port 8080 / Render)
export const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_ADMIN_URL || 'https://webchieut6.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor cho User (Laravel)
axiosUser.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor cho Admin (Spring Boot)
axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Giả định dùng chung token login từ Laravel
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling chung
const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    if (error.config && error.config.url && (error.config.url.endsWith('/login') || error.config.url.endsWith('/register'))) {
      return Promise.reject(error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

axiosUser.interceptors.response.use(res => res, handleResponseError);
axiosAdmin.interceptors.response.use(res => res, handleResponseError);

// Xuất mặc định trỏ về User (để giữ tương thích cho các file cũ chưa update)
export default axiosUser;