import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, BookOpen } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  return (
    <footer className="ft3-root">

      {/* ── Main grid ── */}
      <div className="ft3-container">
        <div className="ft3-grid">

          {/* Cột 1: Thương hiệu */}
          <div className="ft3-col ft3-brand-col">
            <Link to="/" className="ft3-logo">
              <div className="ft3-logo-ico"><BookOpen size={16} strokeWidth={2.5} /></div>
              <span className="ft3-logo-name">BookOne</span>
            </Link>
            <p className="ft3-brand-desc">
              Nhà sách trực tuyến uy tín — Giao hàng tận nơi, đổi trả dễ dàng. Sách chính hãng từ các nhà xuất bản lớn trong và ngoài nước.
            </p>
            <div className="ft3-social">
              <a href="#" aria-label="Facebook" className="ft3-soc-btn"><Facebook size={16} /></a>
              <a href="#" aria-label="YouTube" className="ft3-soc-btn"><Youtube size={16} /></a>
              <a href="#" aria-label="Instagram" className="ft3-soc-btn"><Instagram size={16} /></a>
            </div>
          </div>

          {/* Cột 2: Cửa hàng */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Cửa hàng</h4>
            <ul className="ft3-links">
              <li><Link to="/category">Sản phẩm mới</Link></li>
              <li><Link to="/category">Bán chạy nhất</Link></li>
              <li><Link to="/category">Sách Tiểu Thuyết</Link></li>
              <li><Link to="/category">Sách Lập Trình</Link></li>
              <li><Link to="/category">Sách Kinh Tế</Link></li>
              <li><Link to="/category">Sách Kỹ Năng</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Hỗ trợ</h4>
            <ul className="ft3-links">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Liên hệ</h4>
            <ul className="ft3-contact">
              <li>
                <MapPin size={14} className="ft3-ico" />
                <span>180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh</span>
              </li>
              <li>
                <Phone size={14} className="ft3-ico" />
                <span>+84 917-580-880</span>
              </li>
              <li>
                <Mail size={14} className="ft3-ico" />
                <span>vothaianhth137@gmail.com</span>
              </li>
            </ul>
            <p className="ft3-hours">Thứ 2 – Chủ nhật: 8:00 – 21:00</p>
          </div>

          {/* Cột 5: Đăng ký email */}
          <div className="ft3-col ft3-nl-col">
            <h4 className="ft3-col-title">Nhận ưu đãi</h4>
            <p className="ft3-nl-desc">Đăng ký email để nhận thông tin sách mới và mã giảm giá độc quyền mỗi tuần.</p>
            
            <div className="ft3-badges">
              <span className="ft3-badge">COD</span>
              <span className="ft3-badge">Chuyển khoản</span>
              <span className="ft3-badge">Bảo mật SSL</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft3-bottom">
        <div className="ft3-bottom-inner">
          <span>© 2025 BookOne. Thiết kế bởi Nguyễn Trí Cương &amp; Võ Thái Anh.</span>
          <div className="ft3-bottom-links">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
