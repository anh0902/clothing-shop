import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, BookOpen, Home, Package } from 'lucide-react';

import '../styles/design-system.css';
import './Confirm.css';

const Confirm = () => {
  const navigate = useNavigate();

  // Tự động về trang chủ sau 10 giây
  useEffect(() => {
    const t = setTimeout(() => navigate('/'), 10000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="cf-root">
      <div className="cf-card">
        {/* Icon thành công */}
        <div className="cf-icon-wrap">
          <CheckCircle2 size={56} className="cf-icon" strokeWidth={1.5} />
          <div className="cf-icon-ring" />
        </div>

        <h1 className="cf-title">Đặt hàng thành công!</h1>
        <p className="cf-sub">
          Cảm ơn bạn đã tin tưởng <strong>BookOne</strong>. Đơn hàng của bạn đang được xử lý.
        </p>

        {/* Thông tin */}
        <div className="cf-info-box">
          <div className="cf-info-row">
            <Package size={16} className="cf-info-icon" />
            <span>Chúng tôi sẽ giao hàng trong <strong>2–5 ngày làm việc</strong></span>
          </div>
          <div className="cf-info-row">
            <BookOpen size={16} className="cf-info-icon" />
            <span>Email xác nhận đơn hàng đã được gửi đến tài khoản của bạn</span>
          </div>
        </div>

        {/* Auto redirect countdown */}
        <p className="cf-redirect-note">
          Tự động chuyển về trang chủ sau 10 giây...
        </p>

        {/* Buttons */}
        <div className="cf-actions">
          <Link to="/" className="cf-btn-home" id="back-home-btn">
            <Home size={16} /> Trang chủ
          </Link>
          <Link to="/category" className="cf-btn-shop" id="continue-shopping-btn">
            <BookOpen size={16} /> Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
