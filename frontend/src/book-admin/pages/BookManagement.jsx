import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, X, Image as ImageIcon, 
  Info, BarChart3, FileText, ChevronRight, Hash, User, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../api';
import toast from 'react-hot-toast';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [formData, setFormData] = useState({
    tenSach: '', tacGia: '', nhaXuatBan: '', gia: '', soLuong: '',
    loaiSachId: '', moTa: '', trangThai: 1, trongLuong: '', 
    kichThuoc: '', soTrang: '', anhBia: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, catsData] = await Promise.all([
        AdminAPI.getBooks(),
        AdminAPI.getCategories()
      ]);
      setBooks(booksData || []);
      setCategories(catsData || []);
    } catch (err) {
      toast.error('Lỗi kết nối dữ liệu từ Server');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        tenSach: book?.name || '',
        tacGia: book?.author || '',
        nhaXuatBan: book?.publisher || '',
        gia: book?.price?.toString() || '',
        soLuong: book?.quantity?.toString() || '',
        loaiSachId: book?.categoryId || (categories?.[0]?.id || ''),
        moTa: book?.description || '',
        trangThai: book?.status ?? 1,
        trongLuong: book?.weight?.toString() || '',
        kichThuoc: book?.size || '',
        soTrang: book?.pages?.toString() || '',
        anhBia: book?.image || ''
      });
    } else {
      setEditingBook(null);
      setFormData({
        tenSach: '', tacGia: '', nhaXuatBan: '', gia: '', soLuong: '',
        loaiSachId: categories?.[0]?.id || '', moTa: '', trangThai: 1,
        trongLuong: '', kichThuoc: '', soTrang: '', anhBia: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    const loadingToast = toast.loading('Đang xử lý...');
    try {
      const payload = {
        ...formData,
        gia: parseFloat(formData.gia) || 0,
        soLuong: parseInt(formData.soLuong) || 0,
        loaiSachId: parseInt(formData.loaiSachId) || 0,
        trongLuong: parseInt(formData.trongLuong) || 0,
        soTrang: parseInt(formData.soTrang) || 0,
        trangThai: parseInt(formData.trangThai)
      };

      if (editingBook) {
        await AdminAPI.updateBook(editingBook.id, payload);
        toast.success('Cập nhật thành công', { id: loadingToast });
      } else {
        await AdminAPI.addBook(payload);
        toast.success('Thêm sách mới thành công', { id: loadingToast });
      }
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

  const filteredBooks = books?.filter(b => 
    b?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="book-management animate-in">
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
                  <td colSpan="6" style={{ padding: '20px' }}><div className="skeleton" style={{ height: '30px' }} /></td>
                </tr>
              ))
            ) : filteredBooks?.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <BookOpen className="empty-state-icon" style={{ margin: '0 auto 16px' }} />
                    <p style={{ fontWeight: 600 }}>Chưa có dữ liệu sản phẩm nào.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Hãy bắt đầu bằng việc thêm mới sản phẩm vào hệ thống.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredBooks?.map((book, idx) => (
                  <motion.tr 
                    key={book?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <td>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          {book?.image ? (
                            <img src={book.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><ImageIcon size={14} /></div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{book?.name || 'Không có tên'}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{book?.author || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                       <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>
                        {categories?.find(c => c.id === book?.categoryId)?.tenLoai || 'Chưa phân loại'}
                       </span>
                    </td>
                    <td><div style={{ fontWeight: 700, color: '#1e293b' }}>{book?.price?.toLocaleString() || 0}đ</div></td>
                    <td className="text-center"><span style={{ fontWeight: 700 }}>{book?.quantity || 0}</span></td>
                    <td className="text-center">
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px',
                        background: book?.status === 1 ? '#dcfce7' : '#fee2e2',
                        color: book?.status === 1 ? '#166534' : '#991b1b'
                      }}>
                        {book?.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleOpenModal(book)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(book?.id)} className="btn btn-danger" style={{ padding: '6px' }}><Trash2 size={14} /></button>
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '800px', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontWeight: 800 }}>{editingBook ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}</h3>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '4px', borderRadius: '50%' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
                    <select className="form-control" value={formData.loaiSachId} onChange={(e) => setFormData({...formData, loaiSachId: e.target.value})}>
                      {categories?.map(c => <option key={c.id} value={c.id}>{c.tenLoai}</option>)}
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

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
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
