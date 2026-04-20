import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, User, Shield, Phone, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../../services/adminService';
import toast from 'react-hot-toast';

import AdminPagination from '../../components/admin/AdminPagination';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [formData, setFormData] = useState({
    hoTen: '', email: '', matKhau: '', soDienThoai: '', diaChi: '', quyen: 'USER'
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchData();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.getUsers({ keyword: searchTerm, page: page, size: 8 });
      // Spring Boot Page response: { content: [], totalPages: X }
      if (res?.content) {
        setUsers(res.content);
        setTotalPages(res.totalPages);
      } else {
        setUsers(res || []);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error('Lỗi tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        hoTen: user?.hoTen || '', 
        email: user?.email || '', 
        matKhau: '', 
        soDienThoai: user?.soDienThoai || '', 
        diaChi: user?.diaChi || '', 
        quyen: user?.quyen || 'USER' 
      });
    } else {
      setEditingUser(null);
      setFormData({ hoTen: '', email: '', matKhau: '', soDienThoai: '', diaChi: '', quyen: 'USER' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý...');
    try {
      if (editingUser) {
        await AdminAPI.updateUser(editingUser.id, formData);
        toast.success('Cập nhật thành công', { id: loadingToast });
      } else {
        await AdminAPI.addUser(formData);
        toast.success('Thêm người dùng mới thành công', { id: loadingToast });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Lỗi: ' + err.message, { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa người dùng này?')) return;
    try {
      await AdminAPI.deleteUser(id);
      toast.success('Đã xóa người dùng');
      fetchData();
    } catch (err) {
      toast.error('Lỗi khi xóa người dùng');
    }
  };

  return (
    <div className="user-management animate-in">
       <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: 'auto' }}>
           <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Quản lý Thành viên</h3>
        </div>
        <div style={{ position: 'relative', width: '240px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-light)' }} size={14} />
          <input 
            type="text" 
            placeholder="Tìm kiếm thành viên..." 
            className="form-control"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchData()}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Thêm mới
        </button>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Họ tên & Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th className="text-center">Quyền</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => <tr key={i}><td colSpan="5" style={{ padding: '24px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '2px' }} /></td></tr>)
            ) : users?.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <User className="empty-state-icon" style={{ margin: '0 auto 16px', color: 'var(--admin-text-light)' }} />
                    <p style={{ fontWeight: 500, color: 'var(--admin-text-muted)' }}>Danh sách thành viên trống.</p>
                  </div>
                </td>
              </tr>
            ) : (
              Array.isArray(users) && users.map((user) => (
                <tr key={user?.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--admin-text-head)', fontSize: '14px' }}>{user?.hoTen || 'Thành viên'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{user?.email}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{user?.soDienThoai || '—'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--admin-text-muted)' }}>{user?.diaChi || '—'}</td>
                  <td className="text-center">
                    <span style={{ 
                      fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: '4px',
                      background: user?.quyen === 'ADMIN' ? 'rgba(62, 106, 225, 0.1)' : 'var(--admin-bg-ash)',
                      color: user?.quyen === 'ADMIN' ? 'var(--admin-primary)' : 'var(--admin-text-muted)'
                    }}>
                      {user?.quyen || 'USER'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenModal(user)} className="btn btn-secondary" style={{ minWidth: '32px', minHeight: '32px', padding: 0 }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(user?.id)} className="btn btn-danger" style={{ minWidth: '32px', minHeight: '32px', padding: 0 }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.33, ease: [0.5, 0, 0, 0.75] }}
              style={{ width: '100%', maxWidth: '450px', background: 'var(--admin-bg-pure)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--admin-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 500, fontSize: '18px' }}>{editingUser ? 'Sửa Thành viên' : 'Thêm Thành viên'}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ minWidth: '32px', minHeight: '32px', padding: 0, borderRadius: '50%' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input required className="form-control" value={formData.hoTen} onChange={(e) => setFormData({...formData, hoTen: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input required type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!!editingUser} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mật khẩu {editingUser && '(Để trống nếu không đổi)'}</label>
                  <input type="password" className="form-control" value={formData.matKhau} onChange={(e) => setFormData({...formData, matKhau: e.target.value})} required={!editingUser} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">SĐT</label>
                    <input className="form-control" value={formData.soDienThoai} onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phân quyền</label>
                    <select className="form-control" value={formData.quyen} onChange={(e) => setFormData({...formData, quyen: e.target.value})}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--admin-divider)' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu thông tin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
