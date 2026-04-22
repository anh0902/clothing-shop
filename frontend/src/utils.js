
export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder-book.jpg';
  
  // Nếu là URL tuyệt đối (http...) hoặc blob (preview), giữ nguyên
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }

  // Lấy Base URL của User Backend (nhom1be.onrender.com)
  const apiBase = import.meta.env.VITE_API_USER_URL || 'http://127.0.0.1:8000/api';
  
  // Loại bỏ hậu tố /api để lấy domain gốc
  const rootDomain = apiBase.replace(/\/api$/, '');

  // Xử lý logic đường dẫn tương đương với Laravel
  if (path.startsWith('assets/')) {
    return `${rootDomain}/${path}`;
  }
  
  return `${rootDomain}/assets/product/${path}`;
};
