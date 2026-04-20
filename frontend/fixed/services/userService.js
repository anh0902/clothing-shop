import { userAxios } from '../axiosClient';

const userService = {
  // ================= TÀI KHOẢN =================
  login: async (credentials) => {
    const response = await userAxios.post('/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await userAxios.post('/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await userAxios.get('/user/profile');
    return response.data;
  },

  // ================= SÁCH & DANH MỤC =================
  getBooks: async () => {
    // Gọi tới Controller SachController của Laravel
    const response = await userAxios.get('/sach');
    return response.data;
  },

  getBookById: async (id) => {
    const response = await userAxios.get(`/sach/${id}`);
    return response.data;
  },

  getCategories: async () => {
    // Gọi tới LoaisachController của Laravel
    const response = await userAxios.get('/loaisach'); 
    return response.data;
  },

  // ================= GIỎ HÀNG =================
  getCart: async () => {
    const response = await userAxios.get('/giohang');
    return response.data;
  },

  addToCart: async (data) => {
    // data bao gồm: { sach_id, so_luong }
    // FIX: Đã sửa endpoint thành chitietgiohang/them để khớp với Laravel Route::post('/chitietgiohang/them', ...)
    const response = await userAxios.post('/chitietgiohang/them', data);
    return response.data;
  },

  // ================= ĐƠN HÀNG =================
  checkout: async (orderData) => {
    // FIX: Endpoint chuẩn của Laravel backend là /checkout
    const response = await userAxios.post('/checkout', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await userAxios.get('/donhang');
    return response.data;
  }
};

export default userService;
