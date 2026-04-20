import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
  Search, ShoppingCart, User, LogOut,
  Package, ChevronDown, Menu, X, BookOpen,
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const navigate         = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchVal,    setSearchVal]    = useState('');
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout  = () => { logout(); setDropdownOpen(false); navigate('/login'); };
  const handleSearch  = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchVal.trim())}`);
      setMobileOpen(false);
    }
  };
  const getInits = (n) => (n ? n.charAt(0).toUpperCase() : 'U');
  const closeM   = () => setMobileOpen(false);

  return (
    <header className={`hd4-root${scrolled ? ' hd4-shadow' : ''}`}>

      {/* ══════════ MAIN BAR ══════════ */}
      <div className="hd4-bar">
        <div className="hd4-inner">

          {/* Mobile hamburger */}
          <button className="hd4-hamburger" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}
          <Link to="/" className="hd4-logo" onClick={closeM}>
            <div className="hd4-logo-ico">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div className="hd4-logo-txt">
              <span className="hd4-logo-brand">BookOne</span>
              <span className="hd4-logo-tag">Thế giới sách</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hd4-nav">
            <Link to="/"        className="hd4-nav-a">Trang chủ</Link>
            <Link to="/about"   className="hd4-nav-a">Về chúng tôi</Link>
            <Link to="/category" className="hd4-nav-a">Sản phẩm</Link>
            <Link to="/contact" className="hd4-nav-a">Liên hệ</Link>
          </nav>

          {/* SEARCH – desktop */}
          <form className="hd4-search" onSubmit={handleSearch}>
            <Search size={16} className="hd4-search-ico" />
            <input
              id="header-search"
              type="text"
              placeholder="Tìm sách, tác giả, thể loại..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="hd4-search-inp"
            />
            {searchVal && (
              <button
                type="button"
                className="hd4-search-clear"
                onClick={() => setSearchVal('')}
              ><X size={13} /></button>
            )}
          </form>

          {/* RIGHT ACTIONS */}
          <div className="hd4-right">

            {/* Giỏ hàng */}
            <Link to="/cart" className="hd4-icon-btn" aria-label="Giỏ hàng" id="cart-btn">
              <ShoppingCart size={21} />
              {cartCount > 0 && <span className="hd4-badge">{cartCount}</span>}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hd4-av-wrap" ref={dropdownRef}>
                <button
                  className="hd4-av-btn"
                  onClick={() => setDropdownOpen(p => !p)}
                  id="avatar-trigger"
                >
                  <div className="hd4-av-circle">{getInits(user.ten_dang_nhap)}</div>
                  <span className="hd4-av-name">{user.ten_dang_nhap}</span>
                  <ChevronDown
                    size={13}
                    style={{ color: '#6b7280', transition: 'transform .2s',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {dropdownOpen && (
                  <div className="hd4-dd">
                    {/* User info */}
                    <div className="hd4-dd-info">
                      <div className="hd4-dd-av">{getInits(user.ten_dang_nhap)}</div>
                      <div>
                        <div className="hd4-dd-uname">{user.ten_dang_nhap}</div>
                        <div className="hd4-dd-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="hd4-dd-line" />
                    <Link to="/profile" className="hd4-dd-item" onClick={() => setDropdownOpen(false)} id="profile-link">
                      <User size={15} /> Thông tin cá nhân
                    </Link>
                    <Link to="/orders" className="hd4-dd-item" onClick={() => setDropdownOpen(false)} id="orders-link">
                      <Package size={15} /> Đơn hàng của tôi
                    </Link>
                    <div className="hd4-dd-line" />
                    <button className="hd4-dd-item hd4-dd-logout" onClick={handleLogout} id="logout-btn">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hd4-login-btn" id="login-btn">
                <User size={17} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div className={`hd4-mob${mobileOpen ? ' open' : ''}`}>
        {/* Mobile search */}
        <div className="hd4-mob-search-wrap">
          <form className="hd4-mob-search" onSubmit={handleSearch}>
            <Search size={15} className="hd4-mob-search-ico" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="hd4-mob-search-inp"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </form>
        </div>

        {/* Mobile nav */}
        <nav className="hd4-mob-nav">
          <Link to="/"         className="hd4-mob-a" onClick={closeM}>🏠 Trang chủ</Link>
          <Link to="/category" className="hd4-mob-a" onClick={closeM}>📚 Sản phẩm</Link>
          <Link to="/about"    className="hd4-mob-a" onClick={closeM}>ℹ️ Về chúng tôi</Link>
          <Link to="/contact"  className="hd4-mob-a" onClick={closeM}>📞 Liên hệ</Link>
          {user && <>
            <Link to="/profile" className="hd4-mob-a" onClick={closeM}>👤 Tài khoản</Link>
            <Link to="/orders"  className="hd4-mob-a" onClick={closeM}>📦 Đơn hàng</Link>
            <button className="hd4-mob-a hd4-mob-logout" onClick={() => { handleLogout(); closeM(); }}>
              🚪 Đăng xuất
            </button>
          </>}
          {!user && (
            <Link to="/login" className="hd4-mob-a hd4-mob-login" onClick={closeM}>Đăng nhập</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
