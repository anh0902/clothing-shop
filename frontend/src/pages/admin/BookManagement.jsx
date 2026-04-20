import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon, 
  Info, BarChart3, FileText, ChevronRight, Hash, User, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../../services/adminService';
import toast from 'react-hot-toast';

import AdminPagination from '../../components/admin/AdminPagination';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [formData, setFormData] = useState({
    tenSach: '', tacGia: '', nhaXuatBan: '', gia: '', soLuong: '',
    loai_sach_id: '', moTa: '', trangThai: 1, trongLuong: '', 
    kichThuoc: '', soTrang: '', anhBia: ''
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  // Handle Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchData();
      else setPage(0); // Reset to page 0 will trigger fetchData via above useEffect
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, catsRes] = await Promise.all([
        AdminAPI.getBooks({ search: searchTerm, page: page, size: 8 }),
        AdminAPI.getCategories()
      ]);
      
      // Spring Boot Page structure: { content: [], totalPages: X }
      if (booksRes?.content) {
        setBooks(booksRes.content);
        setTotalPages(booksRes.totalPages);
      } else {
        setBooks(booksRes || []);
        setTotalPages(1);
      }
      
      setCategories(catsRes || []);
    } catch (err) {
      toast.error('Lỗi kết nối dữ liệu từ Server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    // ... (giữ nguyên logic modal)
    if (book) {
      setEditingBook(book);
      setFormData({
        tenSach: book.tenSach || '',
        tacGia: book.tacGia || '',
        nhaXuatBan: book.nhaXuatBan || '',
        gia: book.gia?.toString() || '',
        soLuong: book.soLuong?.toString() || '',
        loai_sach_id: book.loaiSach?.id || (categories?.[0]?.id || ''),
        moTa: book.moTa || '',
        trangThai: book.trangThai ?? 1,
        trongLuong: book.trongLuong?.toString() || '',
        kichThuoc: book.kichThuoc || '',
        soTrang: book.soTrang?.toString() || '',
        anhBia: book.anhBia || ''
      });
    } else {
      setEditingBook(null);
      setFormData({
        tenSach: '', tacGia: '', nhaXuatBan: '', gia: '', soLuong: '',
        loai_sach_id: categories?.[0]?.id || '', moTa: '', trangThai: 1,
        trongLuong: '', kichThuoc: '', soTrang: '', anhBia: ''
      });
    }
    setShowModal(true);
  };

  // ... (handleSubmit, handleDelete giữ nguyên)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý...');
    try {
      const payload = {
        tenSach: formData.tenSach,
        tacGia: formData.tacGia,
        nhaXuatBan: formData.nhaXuatBan,
        gia: parseFloat(formData.gia) || 0,
        soLuong: parseInt(formData.soLuong) || 0,
        loaiSach: { id: parseInt(formData.loai_sach_id) },
        moTa: formData.moTa,
        trangThai: parseInt(formData.trangThai),
        anhBia: formData.anhBia,
        trongLuong: parseInt(formData.trongLuong) || 0,
        soTrang: parseInt(formData.soTrang) || 0,
        kichThuoc: formData.kichThuoc
      };

      if (editingBook) {
        await AdminAPI.updateBook(editingBook.id, payload);
      } else {
        await AdminAPI.addBook(payload);
      }

      toast.success('Thành công', { id: loadingToast });
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(`Lỗi: ${err.message}`, { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await AdminAPI.deleteBook(id);
      toast.success('Đã xóa sản phẩm');
      fetchData();
    } catch (err) {
      toast.error('Lỗi khi xóa sản phẩm');
    }
  };

  return (
    <div className="book-management animate-in">
      <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: 'auto' }}>
           <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Quản lý Sản phẩm</h3>
        </div>
        <div style={{ position: 'relative', width: '240px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-light)' }} size={14} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sách, tác giả..." 
            className="form-control"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <th>Thông tin Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá niêm yết</th>
              <th className="text-center">Kho</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i}>
                  <td colSpan="6" style={{ padding: '24px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '2px' }} /></td>
                </tr>
              ))
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <BookOpen className="empty-state-icon" style={{ margin: '0 auto 16px', color: 'var(--admin-text-light)' }} />
                    <p style={{ fontWeight: 500, color: 'var(--admin-text-muted)' }}>Chưa có dữ liệu sản phẩm nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {Array.isArray(books) && books.map((book, idx) => (
                  <motion.tr 
                    key={book?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <td>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '56px', background: 'var(--admin-bg-ash)', borderRadius: '2px', overflow: 'hidden' }}>
                          {book?.anhBia ? (
                            <img src={book.anhBia} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-light)' }}><ImageIcon size={14} /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--admin-text-head)' }}>{book.tenSach}</div>
                          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{book.tacGia}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                       <span style={{ fontSize: '12px', padding: '4px 10px', background: 'var(--admin-bg-ash)', borderRadius: '2px', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
                        {book.loaiSach?.tenLoai || 'Chưa phân loại'}
                       </span>
                    </td>
                    <td><div style={{ fontWeight: 500, color: 'var(--admin-text-head)' }}>{book.gia?.toLocaleString() || 0}đ</div></td>
                    <td className="text-center"><span style={{ fontWeight: 500 }}>{book.soLuong || 0}</span></td>
                    <td className="text-center">
                      <span style={{ 
                        fontSize: '11px', fontWeight: 500, padding: '4px 12px', borderRadius: '12px',
                        background: book.trangThai === 1 ? '#e6fffa' : '#fff5f5',
                        color: book.trangThai === 1 ? '#047481' : '#c53030',
                        border: `1px solid ${book.trangThai === 1 ? '#b2f5ea' : '#feb2b2'}`
                      }}>
                        {book.trangThai === 1 ? 'Ổn định' : 'Ngưng bán'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleOpenModal(book)} className="btn btn-secondary" style={{ minHeight: '32px', minWidth: '32px', padding: '0' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(book?.id)} className="btn btn-danger" style={{ minHeight: '32px', minWidth: '32px', padding: '0' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
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
              style={{ width: '100%', maxWidth: '800px', background: 'var(--admin-bg-pure)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--admin-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 500, fontSize: '18px' }}>{editingBook ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ minWidth: '32px', minHeight: '32px', padding: 0, borderRadius: '50%' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Tên sách</label>
                    <input required className="form-control" name="tenSach" value={formData.tenSach} onChange={(e) => setFormData({...formData, tenSach: e.target.value})} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Tác giả</label>
                    <input required className="form-control" value={formData.tacGia} onChange={(e) => setFormData({...formData, tacGia: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select className="form-control" value={formData.loai_sach_id} onChange={(e) => setFormData({...formData, loai_sach_id: e.target.value})}>
                      {(categories || []).map(c => <option key={c.id} value={c.id}>{c.tenLoai}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input required type="number" className="form-control" value={formData.gia} onChange={(e) => setFormData({...formData, gia: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số lượng kho</label>
                    <input required type="number" className="form-control" value={formData.soLuong} onChange={(e) => setFormData({...formData, soLuong: e.target.value})} />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                     <label className="form-label">Đường dẫn ảnh</label>
                     <input className="form-control" value={formData.anhBia} onChange={(e) => setFormData({...formData, anhBia: e.target.value})} placeholder="https://..." />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Mô tả sản phẩm</label>
                    <textarea className="form-control" rows={3} value={formData.moTa} onChange={(e) => setFormData({...formData, moTa: e.target.value})} style={{ resize: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--admin-divider)' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Hủy bỏ</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Đang xử lý...' : 'Lưu dữ liệu'}
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

export default BookManagement;
