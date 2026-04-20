import { adminAxios } from '../axiosClient';

const adminService = {
  // ================= QUẢN LÝ SÁCH =================
  getAllBooks: async () => {
    const response = await adminAxios.get('/admin/sach');
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await adminAxios.post('/admin/sach', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await adminAxios.put(`/admin/sach/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await adminAxios.delete(`/admin/sach/${id}`);
    return response.data;
  },

  // ================= QUẢN LÝ DANH MỤC (LOẠI SÁCH) =================
  getAllCategories: async () => {
    const response = await adminAxios.get('/admin/loai-sach');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await adminAxios.post('/admin/loai-sach', categoryData);
    return response.data;
  },

  // ================= QUẢN LÝ NGƯỜI DÙNG =================
  getAllUsers: async () => {
    const response = await adminAxios.get('/admin/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await adminAxios.delete(`/admin/users/${id}`);
    return response.data;
  },

  // ================= QUẢN LÝ ĐƠN HÀNG =================
  getAllOrders: async () => {
    const response = await adminAxios.get('/admin/don-hang');
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await adminAxios.put(`/admin/don-hang/${id}`, statusData);
    return response.data;
  }
};

export default adminService;
