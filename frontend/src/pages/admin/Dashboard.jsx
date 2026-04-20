import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Users, Layers, TrendingUp, 
  ExternalLink, Package, History, AlertTriangle, BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminAPI } from '../../services/adminService';


const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <div style={{ 
    background: 'var(--admin-bg-pure)', padding: '24px', borderRadius: 'var(--admin-radius)', 
    border: '1px solid var(--admin-divider)', position: 'relative',
    transition: 'border-color 0.33s'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--admin-text-muted)' }}>
        <Icon size={20} />
      </div>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 500, margin: '12px 0 4px', color: 'var(--admin-text-head)' }}>{value}</div>
    <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</div>
    {description && <div style={{ fontSize: '11px', color: 'var(--admin-text-light)', marginTop: '4px' }}>{description}</div>}
  </div>
);

const Dashboard = () => {
  // ... (giữ nguyên logic data)
  const [data, setData] = useState({
    books: [],
    users: [],
    categories: [],
    totalBooks: 0,
    totalUsers: 0,
    loading: true
  });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      const [booksRes, catsRes, usersRes] = await Promise.all([
        AdminAPI.getBooks({ size: 999 }), // Lấy nhiều hơn để tính toán Dashboard
        AdminAPI.getCategories(),
        AdminAPI.getUsers({ size: 999 })
      ]);
      
      const bookList = booksRes?.content || booksRes || [];
      const userList = usersRes?.content || usersRes || [];
      const catList  = catsRes?.content || catsRes || [];

      setData({
        books: bookList,
        categories: catList,
        users: userList,
        totalBooks: booksRes?.totalElements || bookList.length,
        totalUsers: usersRes?.totalElements || userList.length,
        loading: false
      });
    } catch (err) {
      console.error('Dashboard Load Error:', err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  if (data.loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--admin-radius)' }} />)}
      </div>
    );
  }

  const totalStock = (data?.books || []).reduce((acc, book) => acc + (parseInt(book?.soLuong) || 0), 0) || 0;
  const recentBooks = [...(data?.books || [])].reverse().slice(0, 5);
  const lowStockBooks = (data?.books || []).filter(b => (parseInt(b?.soLuong) || 0) < 5) || [];

  return (
    <div className="dashboard animate-in">
      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={ShoppingBag} label="Sản phẩm" value={data?.totalBooks || 0} description="Tổng đầu sách hiện có" />
        <StatCard icon={Package} label="Tồn kho" value={totalStock.toLocaleString()} description="Tổng số lượng sản phẩm" />
        <StatCard icon={Users} label="Thành viên" value={data?.totalUsers || 0} description="Khách hàng đăng ký" />
        <StatCard icon={Layers} label="Danh mục" value={data?.categories?.length || 0} description="Phân loại hàng hóa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        {/* Recent Products */}
        <div style={{ background: 'var(--admin-bg-pure)', borderRadius: 'var(--admin-radius)', border: '1px solid var(--admin-divider)' }}>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: 'var(--admin-text-head)' }}>Sản phẩm mới nhập</h3>
            </div>
            <a href="/admin/books" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--admin-primary)', textDecoration: 'none' }}>Tất cả</a>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid var(--admin-divider)' }}>Sản phẩm</th>
                  <th style={{ borderBottom: '1px solid var(--admin-divider)' }}>Giá lẻ</th>
                  <th className="text-center" style={{ borderBottom: '1px solid var(--admin-divider)' }}>Kho</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.length > 0 ? recentBooks.map((book) => (
                  <tr key={book?.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '44px', background: 'var(--admin-bg-ash)', borderRadius: '2px', overflow: 'hidden' }}>
                          {book?.anhBia && <img src={book.anhBia} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--admin-text-head)' }}>{book?.tenSach}</span>
                      </div>
                    </td>
                    <td>{book?.gia?.toLocaleString() || 0}đ</td>
                    <td className="text-center">
                      <span style={{ fontWeight: 500 }}>{book?.soLuong || 0}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-light)' }}>Trống</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ background: 'var(--admin-bg-ash)', borderRadius: 'var(--admin-radius)', padding: '24px' }}>
             <h4 style={{ margin: '0 0 16px', fontWeight: 500, fontSize: '14px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <AlertTriangle size={16} /> Tồn kho thấp
             </h4>
             {lowStockBooks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lowStockBooks.slice(0, 5).map(book => (
                    <div key={book?.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--admin-bg-pure)', borderRadius: '4px', border: '1px solid var(--admin-divider)' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book?.tenSach}</span>
                      <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: 500 }}>
                        Còn {book?.soLuong || 0}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-light)' }}>Hệ thống kho đang ở trạng thái tốt</p>
              )}
           </div>

           <div style={{ background: 'var(--admin-bg-pure)', padding: '24px', borderRadius: 'var(--admin-radius)', border: '1px solid var(--admin-divider)' }}>
             <h4 style={{ margin: '0 0 16px', fontWeight: 500, fontSize: '14px' }}>Tắt</h4>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => window.location.href = '/admin/books'}
                  className="btn btn-secondary" 
                  style={{ width: '100%', minHeight: '60px', flexDirection: 'column', gap: '4px' }}
                >
                  <ShoppingBag size={18} />
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>Kho</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn btn-secondary" 
                  style={{ width: '100%', minHeight: '60px', flexDirection: 'column', gap: '4px' }}
                >
                  <ExternalLink size={18} />
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>Shop</span>
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
