import api from '../api';

// Helper mapping to ensure CamelCase for UI (Matched with Java Model: Sach.java)
const mapBook = (b) => ({
  id: b.id,
  name: b.tenSach,
  author: b.tacGia,
  publisher: b.nhaXuatBan,
  price: b.gia,
  quantity: b.soLuong,
  weight: b.trongLuong || 0,
  size: b.kichThuoc || '',
  pages: b.soTrang || 0,
  description: b.moTa || '',
  image: b.anhBia || '',
  status: b.trangThai,
  categoryId: b.loaiSachId,
  createdAt: b.ngayTao
});

export const AdminAPI = {
  // 📚 BOOKS (Spring Boot - /api/admin/sach)
  getBooks: async (params = {}) => {
    const res = await api.get('/sach', { params });
    const data = res.data.content || res.data;
    return Array.isArray(data) ? data.map(mapBook) : [];
  },

  addBook: async (bookData) => {
    // Spring Boot SachController expects @RequestBody Sach
    const res = await api.post('/sach', bookData);
    return res.data;
  },

  updateBook: async (id, bookData) => {
    const res = await api.put(`/sach/${id}`, bookData);
    return res.data;
  },

  deleteBook: async (id) => {
    const res = await api.delete(`/sach/${id}`);
    return res.data;
  },

  // 📂 CATEGORIES (Spring Boot - /api/admin/loai-sach)
  getCategories: async () => {
    const res = await api.get('/loai-sach');
    return res.data;
  },
  addCategory: async (data) => {
    const res = await api.post('/loai-sach', data);
    return res.data;
  },
  updateCategory: async (id, data) => {
    const res = await api.put(`/loai-sach/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/loai-sach/${id}`);
    return res.data;
  },

  // 👥 USERS (Spring Boot - /api/admin/users)
  getUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data; // Page object or List
  },
  addUser: async (data) => {
    const res = await api.post('/users', data);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};
