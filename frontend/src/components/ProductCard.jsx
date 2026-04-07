import React from 'react';
import { Link } from 'react-router-dom';

// ── ProductCard tối giản theo đúng thiết kế mẫu ──────────────────────────────
const ProductCard = ({ sach }) => {
  const price = sach.gia_ban || sach.gia || 0;
  const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' VND';

  return (
    <Link to={`/product/${sach.id}`} className="pc2-card">
      <div className="pc2-img-wrap">
        <img
          src={sach.anh_bia || '/images/placeholder-book.jpg'}
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
