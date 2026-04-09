import React from 'react';
import { Link } from 'react-router-dom';

// ── ProductCard tối giản theo đúng thiết kế mẫu ──────────────────────────────
const ProductCard = ({ sach }) => {
  const price = sach.gia_ban || sach.gia || 0;
  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' VND';

  const getImg = (path) => {
    if (!path) return '/images/placeholder-book.jpg';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    const base = 'http://localhost:8000';
    if (path.startsWith('assets/')) return `${base}/${path}`;
    return `${base}/assets/product/${path}`;
  };

  return (
    <Link to={`/product/${sach.id}`} className="pc2-card">
      <div className="pc2-img-wrap">
        <img
          src={getImg(sach.anh_bia)}
          alt={sach.ten_sach}
          className="pc2-img"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-book.jpg'; }}
        />
        {sach.so_luong <= 0 && <span className="pc2-oos">Hết hàng</span>}
      </div>
      <div className="pc2-body">
        <p className="pc2-name">{sach.ten_sach}</p>
        <p className="pc2-price">{fmt(price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
