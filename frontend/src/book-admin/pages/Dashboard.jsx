import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Users, Layers, TrendingUp, 
  ExternalLink, Package, History, AlertTriangle, BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { AdminAPI } from '../api';
import '../admin.css';

const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '10px', background: `${color}10`, borderRadius: '10px', color: color }}>
        <Icon size={22} />
      </div>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '16px 0 4px', color: '#0f172a' }}>{value}</div>
    <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{label}</div>
    {description && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>{description}</div>}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    books: [],
    users: [],
    categories: [],
    loading: true
  });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      const [books, cats, users] = await Promise.all([
        AdminAPI.getBooks(),
        AdminAPI.getCategories(),
        AdminAPI.getUsers()
      ]);
      setData({
        books: books || [],
        categories: cats || [],
        users: users?.content || users || [],
        loading: false
      });
    } catch (err) {
      console.error('Dashboard Load Error:', err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  if (data.loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />)}
      </div>
    );
  }

  const totalStock = data?.books?.reduce((acc, book) => acc + (book?.quantity || 0), 0) || 0;
  const recentBooks = [...(data?.books || [])].reverse().slice(0, 5);
  const lowStockBooks = data?.books?.filter(b => (b?.quantity || 0) < 5) || [];

  return (
    <div className="dashboard animate-in">
      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard icon={ShoppingBag} label="Sản phẩm" value={data?.books?.length || 0} color="#6366f1" description="Tổng đầu sách hiện có" />
        <StatCard icon={Package} label="Tồn kho" value={totalStock.toLocaleString()} color="#8b5cf6" description="Tổng số lượng sản phẩm" />
        <StatCard icon={Users} label="Thành viên" value={data?.users?.length || 0} color="#ec4899" description="Tài khoản khách hàng" />
        <StatCard icon={Layers} label="Danh mục" value={data?.categories?.length || 0} color="#f59e0b" description="Phân loại kinh doanh" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Recent Products */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="#6366f1" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Sản phẩm mới nhập</h3>
            </div>
            <a href="/admin/books" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>Tất cả</a>
          </div>
          
          <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá lẻ</th>
                  <th className="text-center">Kho</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.length > 0 ? recentBooks.map((book) => (
                  <tr key={book?.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '28px', height: '36px', background: '#f1f5f9', borderRadius: '4px' }}>
                          {book?.image && <img src={book.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{book?.name}</span>
                      </div>
                    </td>
                    <td>{book?.price?.toLocaleString() || 0}đ</td>
                    <td className="text-center">
                      <span style={{ fontWeight: 700, color: (book?.quantity || 0) < 10 ? '#f59e0b' : '#334155' }}>{book?.quantity || 0}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #fecaca', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626' }}>
              <AlertTriangle size={18} />
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem' }}>Cảnh báo tồn kho thấp</h4>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {lowStockBooks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {lowStockBooks.slice(0, 5).map(book => (
                    <div key={book?.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book?.name}</span>
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                        Còn {book?.quantity || 0}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>Hệ thống kho ổn định</p>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: '0.85rem' }}>Lối tắt hệ thống</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button 
                onClick={() => window.location.href = '/admin/books'}
                className="btn btn-secondary" 
                style={{ flexDirection: 'column', padding: '16px', gap: '6px' }}
              >
                <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}><ShoppingBag size={20} /></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Kho hàng</span>
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-secondary" 
                style={{ flexDirection: 'column', padding: '16px', gap: '6px' }}
              >
                <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}><ExternalLink size={20} /></div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Xem Shop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
