import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Users, 
  ShoppingCart, LogOut, Package, ChevronLeft, ChevronRight,
  Bell, Search, User, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import './admin.css';

const NavGroup = ({ title, children, isCollapsed }) => (
  <div style={{ marginBottom: '20px' }}>
    {!isCollapsed && (
      <div style={{ 
        padding: '0 14px', marginBottom: '8px', fontSize: '0.6rem', 
        fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', 
        letterSpacing: '0.1em' 
      }}>
        {title}
      </div>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {children}
    </div>
  </div>
);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/books')) return 'Sản phẩm';
    if (path.includes('/categories')) return 'Danh mục';
    if (path.includes('/users')) return 'Thành viên';
    if (path.includes('/orders')) return 'Đơn hàng';
    return 'Admin';
  };

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px', background: 'var(--admin-sidebar-bg)' }}>
        <div style={{ padding: '0 10px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px' }}>
             <Package size={24} color="#fff" />
             {!isCollapsed && <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>ADMIN</span>}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <NavGroup title="Hệ quản trị" isCollapsed={isCollapsed}>
            <NavLink to="/admin" end className="admin-nav-item">
              <LayoutDashboard size={18} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </NavGroup>

          <NavGroup title="Cửa hàng" isCollapsed={isCollapsed}>
            <NavLink to="/admin/books" className="admin-nav-item">
              <BookOpen size={18} />
              {!isCollapsed && <span>Sản phẩm</span>}
            </NavLink>
            <NavLink to="/admin/categories" className="admin-nav-item">
              <Layers size={18} />
              {!isCollapsed && <span>Danh mục</span>}
            </NavLink>
          </NavGroup>

          <NavGroup title="Khách hàng" isCollapsed={isCollapsed}>
            <NavLink to="/admin/users" className="admin-nav-item">
              <Users size={18} />
              {!isCollapsed && <span>Thành viên</span>}
            </NavLink>
            <NavLink to="/admin/orders" className="admin-nav-item">
              <ShoppingCart size={18} />
              {!isCollapsed && <span>Đơn hàng</span>}
            </NavLink>
          </NavGroup>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="admin-nav-item" style={{ width: '100%', marginBottom: '10px' }}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span></span>}
          </button>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', color: '#ef4444' }}>
            <LogOut size={18} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main" style={{ marginLeft: isCollapsed ? '80px' : '260px' }}>
        <header className="admin-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{getPageTitle()}</h1>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <a href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                <ExternalLink size={16} /> Xem Shop
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Admin</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Quản trị hệ thống</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#6366f1" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          transition: 0.2s;
        }
        .admin-nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .admin-nav-item.active { color: #fff; background: rgba(255, 255, 255, 0.15); box-shadow: inset 4px 0 0 #fff; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
