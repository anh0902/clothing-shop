import { adminAxios as axios } from '../axiosClient';

// ================= QUẢN LÝ SÁCH (Spring Boot) =================
export const AdminAPI = {
  // Spring Boot trả về Page<Sach>
  getBooks: (params) => axios.get('/admin/sach', { params: {
    search: params?.search || '',
    page: params?.page || 0,
    size: params?.size || 10
  }}),
  
  addBook: (data) => axios.post('/admin/sach', data),
  updateBook: (id, data) => axios.put(`/admin/sach/${id}`, data),
  deleteBook: (id) => axios.delete(`/admin/sach/${id}`),

  // ================= QUẢN LÝ DANH MỤC =================
  getCategories: () => axios.get('/admin/loai-sach'),
  addCategory: (data) => axios.post('/admin/loai-sach', data),
  updateCategory: (id, data) => axios.put(`/admin/loai-sach/${id}`, data),
  deleteCategory: (id) => axios.delete(`/admin/loai-sach/${id}`),

  // ================= QUẢN LÝ NGƯỜI DÙNG =================
  getUsers: (params) => axios.get('/admin/users', { params: {
    keyword: params?.keyword || '',
    page: params?.page || 0,
    size: params?.size || 10
  }}),
  
  addUser: (data) => axios.post('/admin/users', data),
  updateUser: (id, data) => axios.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axios.delete(`/admin/users/${id}`),

  // ================= QUẢN LÝ ĐƠN HÀNG =================
  getOrders: () => axios.get('/admin/don-hang'),
  getOrderById: (id) => axios.get(`/admin/don-hang/${id}`),
  updateOrderStatus: (id, statusData) => axios.put(`/admin/don-hang/${id}`, statusData)
};

export default AdminAPI;
