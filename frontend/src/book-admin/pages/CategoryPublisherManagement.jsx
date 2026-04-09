import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Folder, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../api';
import toast from 'react-hot-toast';

const CategoryPublisherManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [tenLoai, setTenLoai] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error('Lỗi tải danh mục từ Server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setTenLoai(cat?.tenLoai || '');
    } else {
      setEditingCat(null);
      setTenLoai('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý...');
    try {
      const payload = { tenLoai };
      if (editingCat) {
        await AdminAPI.updateCategory(editingCat.id, payload);
        toast.success('Cập nhật thành công', { id: loadingToast });
      } else {
        await AdminAPI.addCategory(payload);
        toast.success('Thêm mới thành công', { id: loadingToast });
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
    if (!window.confirm('Xác nhận xóa danh mục này? Hệ thống sẽ mất đi phân loại này cho các sản phẩm liên quan.')) return;
    try {
      await AdminAPI.deleteCategory(id);
      toast.success('Đã xóa danh mục');
      fetchData();
    } catch (err) {
      toast.error('Lỗi khi xóa danh mục');
    }
  };

  return (
    <div className="category-management animate-in">
      <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          <div style={{ padding: '6px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
            <Folder size={16} />
          </div>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>Danh mục</h3>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <Plus size={16} /> Thêm mới
        </button>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Mã số</th>
              <th>Tên phân loại (Danh mục)</th>
              <th className="text-center" style={{ width: '150px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               [1,2].map(i => <tr key={i}><td colSpan="3" style={{ padding: '24px' }}><div className="skeleton" style={{ height: '30px' }} /></td></tr>)
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="empty-state">
                    <Folder className="empty-state-icon" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontWeight: 600 }}>Chưa có danh mục nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {categories?.map((cat, idx) => (
                  <motion.tr 
                    key={cat?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#64748b' }}><Hash size={12} /> {cat?.id}</div></td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat?.tenLoai}</div>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleOpenModal(cat)} className="btn btn-secondary" style={{ padding: '6px' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(cat?.id)} className="btn btn-danger" style={{ padding: '6px' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', background: '#fff', overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{editingCat ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '4px', borderRadius: '50%' }}><X size={16} /></button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Tên danh mục</label>
                  <input required className="form-control" value={tenLoai} onChange={(e) => setTenLoai(e.target.value)} placeholder="Nhập tên phân loại..." />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu danh mục'}
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

export default CategoryPublisherManagement;
