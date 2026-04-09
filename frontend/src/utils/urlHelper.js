/**
 * urlHelper.js
 * Tiện ích xử lý URL hình ảnh và API linh hoạt cho môi trường Production
 */

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder-book.jpg';
  
  // Nếu là URL tuyệt đối (http...) hoặc blob (preview), giữ nguyên
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }

  // Lấy Base URL của User Backend (nhom1be.onrender.com)
  // Lưu ý: VITE_API_USER_URL thường kết thúc bằng /api
  const apiBase = import.meta.env.VITE_API_USER_URL || 'https://nhom1be.onrender.com/api';
  
  // Loại bỏ hậu tố /api để lấy domain gốc
  const rootDomain = apiBase.replace(/\/api$/, '');

  // Xử lý logic đường dẫn tương đương với Laravel
  if (path.startsWith('assets/')) {
    return `${rootDomain}/${path}`;
  }
  
  return `${rootDomain}/assets/product/${path}`;
};
