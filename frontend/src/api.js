import axios from 'axios';
import toast from 'react-hot-toast';

// 🌐 Khởi tạo Axios Instance chuẩn Production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://webchieut6.onrender.com/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 🛡️ Request Interceptor: Đính kèm Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 Response Interceptor: Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // 401: Hết hạn phiên làm việc hoặc Token không hợp lệ
      if (status === 401) {
        localStorage.removeItem('access_token');
        toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
      
      // 500: Lỗi Server
      else if (status >= 500) {
        toast.error('Lỗi hệ thống (Server Error). Vui lòng thử lại sau.');
      }
      
      // 403: Không có quyền
      else if (status === 403) {
        toast.error('Bạn không có quyền thực hiện hành động này.');
      }
    } else {
      toast.error('Không thể kết nối tới Server. Kiểm tra lại mạng hoặc Backend.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
