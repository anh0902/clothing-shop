import { axiosUser } from '../axiosClient';

export const bookAPI = {
  getAll: () => axiosUser.get('/sach'),
  getFiltered: (params) => {
    // Laravel structure
    const newParams = {
      page: params.page || 1,
      loai_sach_id: params.loai_sach_id || params.loai || '',
      search: params.search || params.q || '',
      gia_min: params.gia_min || '',
      gia_max: params.gia_max || '',
      sort_by: params.sort_by || ''
    };
    return axiosUser.get('/sach/filter', { params: newParams });
  },
  getDetail: (id) => axiosUser.get(`/sach/${id}`),
};

export const categoryAPI = {
  getAll: () => axiosUser.get('/loaisach'),
};

export const cartAPI = {
  getCart: () => axiosUser.get('/giohang'),
  addToCart: (data) => axiosUser.post('/chitietgiohang/them', data),
  updateQuantity: (sach_id, so_luong) => axiosUser.put(`/chitietgiohang/${sach_id}`, { so_luong }),
  removeItem: (sach_id) => axiosUser.delete(`/chitietgiohang/${sach_id}`),
};

export const orderAPI = {
  checkout: (data) => axiosUser.post('/checkout', data),
  getOrders: () => axiosUser.get('/donhang'),
  getOrderDetail: (id) => axiosUser.get(`/donhang/${id}`),
  cancelOrder: (id) => axiosUser.delete(`/donhang/${id}`),
};

export const userAPI = {
  getProfile: (id) => axiosUser.get(`/nguoidung/${id}`),
  updateProfile: (id, data) => axiosUser.put(`/nguoidung/${id}`, data),
};