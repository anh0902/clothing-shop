import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bookAPI, categoryAPI } from '../../services/userService';
import ProductCard from '../../components/ProductCard';
import SkeletonCard from '../../components/SkeletonCard';
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Search, X, SlidersHorizontal, AlertCircle, RefreshCw, BookOpen,
} from 'lucide-react';
import './Category.css';

const Pagination = ({ current, total, onPage }) => {
  const safeTotal = parseInt(total || 1);
  if (safeTotal <= 1) return null;
  const pages = [];
  const range = 2;
  for (let i = 1; i <= safeTotal; i++) {
    if (i <= range || i > safeTotal - range || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return (
    <div className="cat-pagination">
      <button className="cat-page-btn" onClick={() => onPage(current - 1)} disabled={current === 1}>
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`dot-${i}`} className="cat-page-dots">…</span>
        ) : (
          <button
            key={p}
            className={`cat-page-btn ${current === p ? 'active' : ''}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        )
      )}
      <button className="cat-page-btn" onClick={() => onPage(current + 1)} disabled={current === safeTotal}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const FilterPanel = ({ hasActiveFilter, clearFilters, filters, categories, handleFilter }) => (
  <div className="cat-filter-content">
    <div className="cat-filter-header-inline">
      <span className="cat-group-label category-auto-1">Tùy chọn lọc</span>
      {hasActiveFilter && (
        <button className="cat-clear-btn" onClick={clearFilters}>Xóa </button>
      )}
    </div>

    {/* Thay radio bằng danh sách Nút bấm (Chips) cho Thể loại */}
    <div className="cat-filter-group">
      <p className="cat-group-label">Thể loại sách</p>
      <div className="cat-chip-list">
        {(categories || []).map(cat => {
          const isActive = filters.loai_sach_id == cat.id;
          return (
            <button
              key={cat.id}
              className={`cat-chip-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleFilter('loai_sach_id', isActive ? '' : cat.id)}
            >
              {cat.ten_loai}
            </button>
          );
        })}
      </div>
    </div>

    <div className="cat-filter-group">
      <p className="cat-group-label">Nhà xuất bản</p>
      <div className="cat-filter-input-wrap">
        <input
          type="text"
          placeholder="Tìm tên nhà xuất bản..."
          value={filters.nha_xuat_ban}
          onChange={e => handleFilter('nha_xuat_ban', e.target.value)}
          className="cat-price-input category-auto-2"
        />
      </div>
    </div>

    {/* Khoảng giá */}
    <div className="cat-filter-group">
      <p className="cat-group-label">Khoảng giá (VNĐ)</p>
      <div className="cat-price-row">
        <input
          type="number"
          placeholder="Tối thiểu"
          value={filters.gia_min}
          onChange={e => handleFilter('gia_min', e.target.value)}
          className="cat-price-input"
        />
        <span className="cat-price-sep">-</span>
        <input
          type="number"
          placeholder="Tối đa"
          value={filters.gia_max}
          onChange={e => handleFilter('gia_max', e.target.value)}
          className="cat-price-input"
        />
      </div>
    </div>
  </div>
);

const Category = () => {
  const [searchParams] = useSearchParams();

  const [books, setBooks]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalItems, setTotalItems]   = useState(0);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [showSort, setShowSort]       = useState(false);

  const [filters, setFilters] = useState({
    loai_sach_id: searchParams.get('loai_sach_id') || '',
    nha_xuat_ban: searchParams.get('nha_xuat_ban') || '',
    gia_min: '',
    gia_max: '',
    sort_by: 'moi_nhat',
  });

  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    categoryAPI.getAll()
      .then(r => {
        if (r.success) setCategories(r.data || []);
      })
      .catch(() => {});
  }, []);

  // header lọc loại sách , nhà xuất bản 
  useEffect(() => {
    const searchQ = searchParams.get('search');
    if (searchQ && categories.length > 0) {
      const q = searchQ.trim().toLowerCase();
      
      // 1. Tìm loại sách
      const matchedCat = categories.find(cat => 
        cat.ten_loai.toLowerCase().includes(q)
      );

      if (matchedCat) {
        // Map to Category ID
        setFilters(prev => ({ 
          ...prev, 
          loai_sach_id: matchedCat.id, 
          nha_xuat_ban: '' 
        }));
      } else {
        // 2. Tìm nhà xuất bản
        setFilters(prev => ({ 
          ...prev, 
          loai_sach_id: '', 
          nha_xuat_ban: searchQ.trim() 
        }));
      }
      setCurrentPage(1);
    }
  }, [searchParams, categories]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { 
        page: currentPage, 
        loai_sach_id: filters.loai_sach_id,
        nha_xuat_ban: filters.nha_xuat_ban,
        gia_min: filters.gia_min,
        gia_max: filters.gia_max,
        sort_by: filters.sort_by || 'moi_nhat'
      };
      
      const r = await bookAPI.getFiltered(params);
      
      if (r.success && r.data) {
        // Laravel Paginate: { current_page, data: [], last_page, total }
        setBooks(r.data.data || []);
        setTotalPages(r.data.last_page || 1);
        setTotalItems(r.data.total || 0);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    const id = setTimeout(fetchBooks, 400);
    return () => clearTimeout(id);
  }, [fetchBooks]);

  const handleFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ loai_sach_id: '', nha_xuat_ban: '', gia_min: '', gia_max: '', sort_by: 'moi_nhat' });
    setCurrentPage(1);
  };

  const sortLabel = { moi_nhat: 'Mới nhất', gia_tang: 'Giá tăng dần', gia_giam: 'Giá giảm dần' };

  const hasActiveFilter =
    filters.loai_sach_id !== '' ||
    filters.nha_xuat_ban !== '' ||
    filters.gia_min !== '' ||
    filters.gia_max !== '';

  return (
    <div className="cat-page-root">
      {/* Drawer Overlay (Black/50) */}
      {drawerOpen && <div className="cat-drawer-overlay" onClick={() => setDrawerOpen(false)} />}
      
      {/* Off-canvas Drawer */}
      <div className={`cat-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="cat-drawer-header">
          <div className="drawer-title-wrapper">
            <SlidersHorizontal size={20} className="drawer-title-icon" />
            <h4 className="drawer-title">Bộ lọc sản phẩm</h4>
          </div>
          <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="cat-drawer-body">
          <FilterPanel hasActiveFilter={hasActiveFilter} clearFilters={clearFilters} filters={filters} categories={categories} handleFilter={handleFilter} />
        </div>

        <div className="cat-drawer-footer">
          <button className="cat-apply-btn" onClick={() => setDrawerOpen(false)}>
            Xem {totalItems} kết quả
          </button>
        </div>
      </div>

      <div className="cat-layout-wrapper">
        {/* Breadcrumb & Title */}
        <div className="cat-top-header">
          <div className="cat-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="cat-mx">/</span>
            <span className="cat-active">Cửa hàng</span>
          </div>
          <h1 className="cat-main-title">Danh mục sản phẩm</h1>
        </div>

        {/* Cột Phải -> Full Width Now */}
        <main className="cat-main-fullwidth">
          {/* Toolbar */}
          <div className="cat-toolbar">
            <div className="cat-toolbar-left">
              <button className="cat-filter-trigger" onClick={() => setDrawerOpen(true)}>
                <div className="icon-wrap">
                  <SlidersHorizontal strokeWidth={1.5} size={18} />
                  {hasActiveFilter && <div className="active-dot"/>}
                </div>
                <span>Bộ lọc</span>
              </button>
              <div className="cat-result-text">
                Hiển thị <span className="cat-font-bold">{totalItems}</span> sản phẩm
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="cat-sort-wrapper" ref={sortRef}>
              <div className="cat-sort-label">Sắp xếp theo:</div>
              <button className="cat-sort-trigger" onClick={() => setShowSort(p => !p)}>
                {sortLabel[filters.sort_by]}
                <ChevronDown size={16} className={showSort ? 'rotate' : ''}/>
              </button>
              {showSort && (
                <div className="cat-sort-dropdown">
                  {Object.entries(sortLabel).map(([val, label]) => (
                    <button
                      key={val}
                      className={`cat-sort-item ${filters.sort_by === val ? 'active' : ''}`}
                      onClick={() => { handleFilter('sort_by', val); setShowSort(false); }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags (if any filter is active) */}
          {hasActiveFilter && (
            <div className="cat-tags-row">
              {filters.loai_sach_id && (categories || []).find(c => c.id == filters.loai_sach_id) && (
                <span className="cat-tag">
                  {(categories || []).find(c => c.id == filters.loai_sach_id).ten_loai}
                  <button onClick={() => handleFilter('loai_sach_id', '')}><X size={14} /></button>
                </span>
              )}
              {filters.nha_xuat_ban && (
                <span className="cat-tag">
                  NXB: {filters.nha_xuat_ban}
                  <button onClick={() => handleFilter('nha_xuat_ban', '')}><X size={14} /></button>
                </span>
              )}
              {(filters.gia_min || filters.gia_max) && (
                <span className="cat-tag">
                  Giá: {filters.gia_min || '0'}đ - {filters.gia_max || '∞'}đ
                  <button onClick={() => { handleFilter('gia_min', ''); handleFilter('gia_max', ''); }}><X size={14} /></button>
                </span>
              )}
              <button className="cat-clear-all-tags" onClick={clearFilters}>Xóa tất cả</button>
            </div>
          )}

          {/* Products Grid (Full-width 4 cols) */}
          {error ? (
            <div className="cat-error-box ds-card">
              <AlertCircle size={48} strokeWidth={1.5} className="cat-icon-err" />
              <h3 className="error-title">Không thể tải dữ liệu</h3>
              <p className="error-desc">Có lỗi xảy ra trong quá trình lấy thông tin từ máy chủ. Vui lòng thử lại sau.</p>
              <button onClick={fetchBooks} className="cat-retry-btn"><RefreshCw size={16} className="btn-icon"/> Thử lại</button>
            </div>
          ) : (
            <div className="cat-product-grid">
              {loading
                ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
                : (books || []).length > 0
                  ? (books || []).map(book => <ProductCard key={book.id} sach={book} />)
                  : (
                    <div className="cat-empty-box ds-card">
                      <BookOpen size={56} strokeWidth={1} className="cat-empty-icon" />
                      <h3 className="empty-title">Không tìm thấy sản phẩm nào</h3>
                      <p className="empty-desc">Rất tiếc, bộ sưu tập hiện tại chưa có sách khớp với tiêu chí của bạn.</p>
                      <button className="cat-clear-btn-large" onClick={clearFilters}>Xóa bộ lọc</button>
                    </div>
                  )
              }
            </div>
          )}

          {/* Pagination Component */}
           {!loading && !error && (
            <Pagination
              current={currentPage}
              total={totalPages}
              onPage={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default Category;
