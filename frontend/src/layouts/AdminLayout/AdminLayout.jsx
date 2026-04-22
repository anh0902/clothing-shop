import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Users, 
  ShoppingCart, LogOut, Package, ChevronLeft, ChevronRight,
  Bell, Search, User, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import './AdminLayout.css';

const NavGroup = ({ title, children, isCollapsed }) => (
  <div style={{ marginBottom: '20px' }}>
    {!isCollapsed && (
      <div style={{ 
        padding: '0 16px', marginBottom: '8px', fontSize: '11px', 
        fontWeight: 600, color: 'var(--admin-text-light)', textTransform: 'uppercase', 
        letterSpacing: '0.15em' 
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
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-w)' }}>
        <div style={{ padding: '20px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
             <Package size={20} color="var(--admin-text-head)" />
             {!isCollapsed && (
               <span style={{ 
                 fontWeight: 500, fontSize: '0.8rem', color: 'var(--admin-text-head)', 
                 letterSpacing: '0.4em', marginLeft: '8px' 
               }}>ADMIN</span>
             )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
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

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--admin-divider)', padding: '12px' }}>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="admin-nav-item" style={{ width: '100%', marginBottom: '4px' }}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={handleLogout} className="admin-nav-item logout-btn" style={{ width: '100%' }}>
            <LogOut size={18} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main" style={{ marginLeft: isCollapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-w)' }}>
        <header className="admin-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--admin-text-head)' }}>{getPageTitle()}</h1>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <a href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                <ExternalLink size={14} /> Shop
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Admin</div>
                  <div style={{ fontSize: '11px', color: 'var(--admin-text-light)' }}>Hệ thống</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--admin-bg-ash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="var(--admin-primary)" />
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
          padding: 8px 16px;
          color: var(--admin-text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--admin-radius);
          transition: background-color 0.33s cubic-bezier(0.5, 0, 0, 0.75), color 0.33s;
          margin-bottom: 2px;
        }
        .admin-nav-item:hover { color: var(--admin-text-head); background: var(--admin-bg-ash); }
        .admin-nav-item.active { 
          color: var(--admin-primary); 
          background: rgba(62, 106, 225, 0.08);
          font-weight: 500;
        }
        .logout-btn { color: #5C5E62; }
        .logout-btn:hover { color: #ef4444; background: #fee2e2; }

        @media (max-width: 768px) {
          .admin-sidebar { width: 0; transform: translateX(-100%); }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
