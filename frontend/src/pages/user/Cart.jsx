import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { cartAPI } from '../../services/userService';
import {
  ShoppingCart, Trash2, Plus, Minus,
  BookOpen, Loader,
} from 'lucide-react';
import '../../styles/design-system.css';
import './Cart.css';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

/* ── Skeleton row ── */
const SkRow = () => (
  <div className="crt-row">
    <div className="ds-sk cart-auto-1" />
    <div className="cart-auto-2">
      <div className="ds-sk cart-auto-3" />
      <div className="ds-sk cart-auto-4" />
    </div>
    <div className="ds-sk cart-auto-5" />
    <div className="ds-sk cart-auto-6" />
    <div className="ds-sk cart-auto-7" />
    <div className="ds-sk cart-auto-8" />
  </div>
);

/* ── Empty state ── */
const Empty = ({ title, sub, action }) => (
  <div className="crt-empty">
    <ShoppingCart size={54} className="cart-auto-9" />
    <h2 className="crt-empty-title">{title}</h2>
    <p className="crt-empty-sub">{sub}</p>
    {action}
  </div>
);

const Cart = () => {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const { cartItems, loadingCart, fetchCart, cartCount, setCartItems } = useCart();
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleQty = async (item, delta) => {
    const currentQty = parseInt(item.so_luong || 0);
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    const maxStock = item.sach?.so_luong ?? 999;
    if (newQty > maxStock) {
      toast.error(`Chỉ còn ${maxStock} sản phẩm trong kho`); return;
    }
    
    setUpdating(item.sach_id);

    // 1. Cập nhật State cục bộ ngay lập tức
    setCartItems(prev => (prev || []).map(cartItem => 
      cartItem.sach_id === item.sach_id 
        ? { ...cartItem, so_luong: newQty, thanh_tien: newQty * (cartItem.don_gia || 0) } 
        : cartItem
    ));

    try {
      await cartAPI.updateQuantity(item.sach_id, newQty);
    } catch (err) { 
      console.error('API Update Error:', err); 
    } finally { 
      setUpdating(null); 
    }
  };

  const handleDelete = async (sach_id) => {
    setDeleting(sach_id);
    
    setCartItems(prev => (prev || []).filter(cartItem => cartItem.sach_id !== sach_id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng'); 

    try {
      await cartAPI.removeItem(sach_id);
    } catch (err) { 
      console.error('API Delete Error:', err);
    } finally { 
      setDeleting(null); 
    }
  };

  const currentItems = cartItems || [];
  const total = currentItems.reduce((s, i) => s + parseFloat(i.thanh_tien || 0), 0);

  return (
    <div className="ds-page crt-page">
      <div className="ds-wrap">
        {/* Chưa đăng nhập */}
        {!user && !loadingCart ? (
          <Empty title="Vui lòng đăng nhập" sub="Bạn cần đăng nhập để xem giỏ hàng"
            action={<Link to="/login" className="ds-btn-primary cart-auto-10">Đăng nhập ngay</Link>} />
        ) : 
        
        /* Giỏ hàng trống */
        !loadingCart && currentItems.length === 0 ? (
          <Empty title="Giỏ hàng đang trống" sub="Hãy chọn thêm sách để bắt đầu mua sắm"
            action={<Link to="/category" className="ds-btn-primary cart-auto-11"><BookOpen size={16} />Khám phá sách</Link>} />
        ) : (
          
        /* Có sản phẩm */
        <>
          <div className="ds-page-hd">
            <h1 className="ds-page-title"><ShoppingCart size={24} />Giỏ hàng
              {!loadingCart && <span className="crt-count">{cartCount} sản phẩm</span>}
            </h1>
          </div>

          <div className="crt-layout">
            {/* ── Danh sách sản phẩm ── */}
            <div className="crt-list-col">
              <div className="ds-card crt-list-card">
                <div className="crt-list-head">
                  <span className="crt-h-product">Sản phẩm</span>
                  <span className="crt-h-price">Đơn giá</span>
                  <span className="crt-h-qty">Số lượng</span>
                  <span className="crt-h-total">Thành tiền</span>
                  <span />
                </div>
  
                {/* Rows */}
                {loadingCart
                  ? [...Array(3)].map((_, i) => <SkRow key={i} />)
                  : currentItems.map((item, idx) => (
                      <div key={item.sach_id || idx} className={`crt-row${idx < currentItems.length - 1 ? ' crt-row-sep' : ''}`}>
                        <div className="crt-item-info">
                          <Link to={`/product/${item.sach_id}`} className="crt-img-wrap">
                            <img 
                              src={item.sach?.anh_bia || item.sach?.image || ''} 
                              alt={item.sach?.ten_sach || 'Sách'} 
                              className="crt-img" 
                              onError={(e) => { e.target.src = 'https://picsum.photos/seed/book/80/110'; }}
                              referrerPolicy="no-referrer" 
                            />
                          </Link>
                          <div className="crt-meta">
                            <Link to={`/product/${item.sach_id}`} className="crt-name">
                              {item.sach?.ten_sach || item.sach?.tenSach || `Sản phẩm #${item.sach_id}`}
                            </Link>
                            {item.sach?.tac_gia && <span className="crt-author">{item.sach.tac_gia}</span>}
                            <span className="crt-price-mobile">{fmt(item.don_gia)}</span>
                          </div>
                        </div>
  
                        <span className="crt-h-price crt-price-val">{fmt(item.don_gia)}</span>
  
                        <div className="crt-h-qty">
                          <div className="crt-qty">
                            <button className="crt-qty-btn" onClick={() => handleQty(item, -1)} disabled={(item.so_luong || 0) <= 1 || updating === item.sach_id}><Minus size={12} /></button>
                            <span className="crt-qty-val">{updating === item.sach_id ? <Loader size={13} className="ds-spin" /> : (item.so_luong || 0)}</span>
                            <button className="crt-qty-btn" onClick={() => handleQty(item, 1)} disabled={updating === item.sach_id}><Plus size={12} /></button>
                          </div>
                        </div>
  
                        <span className="crt-h-total crt-total-val">{fmt(item.thanh_tien)}</span>
  
                        <button className="crt-del-btn" onClick={() => handleDelete(item.sach_id || item.id)} disabled={deleting === (item.sach_id || item.id)} aria-label="Xóa sản phẩm">
                          {deleting === (item.sach_id || item.id) ? <Loader size={15} className="ds-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    ))
                }
              </div>
  
              <Link to="/category" className="crt-continue"> Tiếp tục mua sắm</Link>
            </div>
  
            {/* ── Tóm tắt ── */}
            <div className="crt-summary-col">
              <div className="ds-card crt-summary-card">
                <h2 className="ds-card-title">Tóm tắt đơn hàng</h2>
                <div className="crt-sum-body">
                  <div className="crt-sum-row"><span>Tạm tính ({cartCount} sản phẩm)</span><span>{fmt(total)}</span></div>
                  <div className="crt-sum-row"><span>Phí vận chuyển</span><span className="cart-auto-12">Miễn phí</span></div>
                  <div className="crt-sum-divider" />
                  <div className="crt-sum-total"><span>Tổng cộng</span><span className="crt-sum-amount">{fmt(total)}</span></div>
                  <button className="ds-btn-primary crt-checkout-btn" onClick={() => navigate('/checkout')} disabled={loadingCart || currentItems.length === 0} id="proceed-checkout-btn">
                    Tiến hành thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Cart;
