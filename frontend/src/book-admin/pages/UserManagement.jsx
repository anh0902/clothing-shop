import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, User, Shield, Phone, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    hoTen: '', email: '', matKhau: '', soDienThoai: '', diaChi: '', quyen: 'USER'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.getUsers({ keyword: searchTerm });
      setUsers(res?.content || res || []);
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
       <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '8px' }}>
        <div style={{ position: 'relative', width: '200px' }}>
          <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={14} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="form-control"
            style={{ paddingLeft: '32px' }}
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
              [1,2,3].map(i => <tr key={i}><td colSpan="5" style={{ padding: '24px' }}><div className="skeleton" style={{ height: '30px' }} /></td></tr>)
            ) : users?.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <User className="empty-state-icon" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontWeight: 600 }}>Danh sách người dùng trống.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user?.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 700 }}>{user?.hoTen || 'Thành viên'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
                    </div>
                  </td>
                  <td>{user?.soDienThoai || 'N/A'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.diaChi || '-'}</td>
                  <td className="text-center">
                    <span style={{ 
                      fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px',
                      background: user?.quyen === 'ADMIN' ? '#eff6ff' : '#f1f5f9',
                      color: user?.quyen === 'ADMIN' ? '#1d4ed8' : '#64748b'
                    }}>
                      {user?.quyen || 'USER'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => handleOpenModal(user)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(user?.id)} className="btn btn-danger" style={{ padding: '6px' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '16px', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontWeight: 800 }}>{editingUser ? 'Sửa Thành viên' : 'Thêm Thành viên'}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '4px', borderRadius: '50%' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
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
