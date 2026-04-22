import { userAxios as axios } from '../axiosClient';

// ================= TÀI KHOẢN (NGƯỜI DÙNG) =================
export const userAPI = {
  login: (credentials) => axios.post('/login', credentials),
  register: (userData) => axios.post('/register', userData),
  getProfile: (id) => axios.get(id ? `/nguoidung/${id}` : '/user/profile'),
  updateProfile: (id, data) => axios.put(`/nguoidung/${id}`, data)
};

// ================= QUẢN LÝ SÁCH =================
export const bookAPI = {
  // Trả về { success: true, data: { current_page, data: [], last_page, total } }
  getAll: (params) => axios.get('/sach', { params }),
  getDetail: (id) => axios.get(`/sach/${id}`),
  getFiltered: (params) => axios.get('/sach/filter', { params }),
};

// ================= QUẢN LÝ DANH MỤC =================
export const categoryAPI = {
  // Trả về { success: true, data: [] }
  getAll: () => axios.get('/loaisach'),
};

// ================= GIỎ HÀNG =================
export const cartAPI = {
  // Trả về { success: true, data: { thong_tin_gio_hang, tong_tien_thanh_toan } }
  getCart: () => axios.get('/giohang'),
  addToCart: (data) => axios.post('/chitietgiohang/them', data),
  updateQuantity: (sach_id, so_luong) => axios.put(`/chitietgiohang/${sach_id}`, { so_luong }),
  removeItem: (sach_id) => axios.delete(`/chitietgiohang/${sach_id}`),
};

// ================= ĐƠN HÀNG =================
export const orderAPI = {
  checkout: (orderData) => axios.post('/checkout', orderData),
  getOrders: () => axios.get('/donhang'),
  getOrderDetail: (id) => axios.get(`/donhang/${id}`),
  cancelOrder: (id) => axios.delete(`/donhang/${id}`),
};

const userService = { userAPI, bookAPI, categoryAPI, cartAPI, orderAPI };
export default userService;
