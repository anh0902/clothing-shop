import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, Plus, Minus,
  AlertCircle, CheckCircle2, RefreshCw,
  Loader, ChevronRight, BookOpen,
  Hash, Scale, Maximize2, Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { bookAPI, cartAPI } from '../services/api';
import axiosClient from '../axiosClient';
import { getImageUrl } from '../utils/urlHelper';
import './ProductDetail.css';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + '₫';
const extractList = (r) => r.data?.data?.data || r.data?.data || [];

// Đã chuyển logic sang src/utils/urlHelper.js

/* ══════════════ Skeleton ══════════════ */
const Skeleton = () => (
  <div className="pd3-root">
    <div className="pd3-wrap">
      <div className="pd3-sk productdetail-auto-1" />
      <div className="pd3-main-card">
        <div className="pd3-main-grid">
          <div className="pd3-img-col">
            <div className="pd3-sk productdetail-auto-2" />
          </div>
          <div className="pd3-info-col productdetail-auto-3">
            <div className="pd3-sk productdetail-auto-4" />
            <div className="pd3-sk productdetail-auto-5" />
            <div className="pd3-sk productdetail-auto-6" />
            <div className="pd3-sk productdetail-auto-7" />
            <div className="pd3-sk productdetail-auto-8" />
            <div className="productdetail-auto-9">
              <div className="pd3-sk productdetail-auto-10" />
              <div className="pd3-sk productdetail-auto-11" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════ Error ══════════════ */
const ErrorUI = ({ onRetry }) => (
  <div className="pd3-root">
    <div className="pd3-wrap">
      <div className="productdetail-auto-12">
        <AlertCircle size={52} color="#e53e3e" className="productdetail-auto-13" />
        <h2 className="productdetail-auto-14">
          Không tìm thấy sản phẩm
        </h2>
        <p className="productdetail-auto-15">
          Sản phẩm có thể đã bị xóa hoặc đường dẫn không đúng.
        </p>
        <div className="productdetail-auto-16">
          <Link to="/category" className="pd3-btn-outline">
            <BookOpen size={15} /> Xem sản phẩm khác
          </Link>
          <button className="pd3-btn-solid" onClick={onRetry}>
            <RefreshCw size={15} /> Thử lại
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════ Related card ══════════════ */
const RelCard = ({ sach }) => (
  <Link to={`/product/${sach.id}`} className="pd3-rel-card">
    <div className="pd3-rel-img">
      <img
        src={getImageUrl(sach.anh_bia)}
        alt={sach.ten_sach} loading="lazy"
        onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-book.jpg'; }}
      />
      {sach.so_luong <= 0 && <span className="pd3-oos-badge">Hết hàng</span>}
    </div>
    <div className="pd3-rel-body">
      <p className="pd3-rel-name">{sach.ten_sach}</p>
      {sach.tac_gia && <p className="pd3-rel-author">{sach.tac_gia}</p>}
      <p className="pd3-rel-price">{fmt(sach.gia_ban || sach.gia)}</p>
    </div>
  </Link>
);

/* ══════════════════════════════════════════
   PRODUCT DETAIL PAGE
══════════════════════════════════════════ */
const ProductDetail = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { fetchCart } = useCart();

  const [book,    setBook]   = useState(null);
  const [loading, setLoad]   = useState(true);
  const [error,   setError]  = useState(false);
  const [qty,     setQty]    = useState(1);
  const [adding,  setAdding] = useState(false);
  const [buying,  setBuying] = useState(false);
  const [related, setRel]    = useState([]);
  const [loadRel, setLoadRel]= useState(false);

  /* ── Fetch sách ── */
  const fetchBook = useCallback(async () => {
    setLoad(true); setError(false);
    try {
      const res  = await bookAPI.getDetail(id);
      const raw  = res.data.data; // Laravel: res.data.data là object sách
      
      const data = {
        id: raw.id,
        ten_sach: raw.ten_sach || raw.tenSach,
        tac_gia: raw.tac_gia || raw.tacGia,
        nha_xuat_ban: raw.nha_xuat_ban || raw.nhaXuatBan,
        gia: raw.gia,
        so_luong: raw.so_luong || raw.soLuong,
        mo_ta: raw.mo_ta || raw.moTa,
        anh_bia: raw.anh_bia || raw.anhBia,
        loai_sach_id: raw.loai_sach_id || raw.loaiSachId,
        trang_thai: raw.trang_thai || raw.trangThai,
        loaisach: raw.loaisach ? { ten_loai: raw.loaisach.ten_loai || raw.loaisach.tenLoai } : null
      };

      setBook(data);
      if (data.loai_sach_id) {
        setLoadRel(true);
        bookAPI.getFiltered({ loai_sach_id: data.loai_sach_id, size: 6 })
          .then(r => {
            const list = r.data.data.data || []; // Laravel pagination
            setRel(list
              .map(s => ({
                id: s.id,
                ten_sach: s.ten_sach || s.tenSach,
                anh_bia: s.anh_bia || s.anhBia,
                gia: s.gia
              }))
              .filter(b => b.id !== data.id)
              .slice(0, 5)
            );
          })
          .catch(() => {})
          .finally(() => setLoadRel(false));
      }
    } catch { setError(true); }
    finally { setLoad(false); }
  }, [id]);

  useEffect(() => { fetchBook(); setQty(1); }, [fetchBook]);

  const needLogin = () => { toast.error('Vui lòng đăng nhập để tiếp tục'); navigate('/login'); };

  /* ── Thêm vào giỏ ── */
  const handleAdd = async () => {
    if (!user) return needLogin();
    if (qty > book.so_luong) { toast.error(`Chỉ còn ${book.so_luong} sản phẩm trong kho`); return; }
    setAdding(true);
    try {
      console.log('--- ADD TO CART DEBUG ---');
      console.log('Payload:', { sach_id: book.id, so_luong: qty });
      
      const res = await cartAPI.addToCart({ sach_id: book.id, so_luong: qty });
      
      console.log('Response:', res.data);

      if (res.data?.success) { 
        toast.success(res.data.message || 'Đã thêm vào giỏ hàng'); 
        fetchCart(); 
      } else {
        toast.error(res.data?.message || 'Có lỗi khi thêm vào giỏ');
      }
    } catch (e) { 
      console.error('Cart Error Detail:', e.response?.data || e.message);
      toast.error(e.response?.data?.message || 'Không thể kết nối Server giỏ hàng'); 
    }
    finally { setAdding(false); }
  };

  /* ── Mua ngay ── */
  const handleBuy = async () => {
    if (!user) return needLogin();
    setBuying(true);
    try {
      const res = await cartAPI.addToCart({ sach_id: book.id, so_luong: qty });
      if (res.data?.success) { fetchCart(); navigate('/checkout'); }
      else { toast.error(res.data?.message || 'Có lỗi xảy ra'); setBuying(false); }
    } catch (e) { toast.error(e.response?.data?.message || 'Không thể thêm vào giỏ hàng'); setBuying(false); }
  };

  if (loading) return <Skeleton />;
  if (error || !book) return <ErrorUI onRetry={fetchBook} />;

  const oos        = book.so_luong <= 0;
  const price      = book.gia_ban || book.gia || 0;
  const hasDisc    = book.gia_ban && book.gia && book.gia_ban < book.gia;

  return (
    <div className="pd3-root">
      <div className="pd3-wrap">

        {/* ── Breadcrumb ── */}
        <nav className="pd3-bc">
          <Link to="/" className="pd3-bc-a">Trang chủ</Link>
          <ChevronRight size={12} className="pd3-bc-sep" />
          <Link to="/category" className="pd3-bc-a">Sản phẩm</Link>
          <ChevronRight size={12} className="pd3-bc-sep" />
          <span className="pd3-bc-cur">{book.ten_sach}</span>
        </nav>

        {/* ════════════ CARD 1: Thông tin chính ════════════ */}
        <div className="pd3-main-card">
          <div className="pd3-main-grid">

            {/* ── Cột trái: ảnh ── */}
            <div className="pd3-img-col">
              <div className="pd3-img-frame">
                <img
                  src={getImageUrl(book.anh_bia)}
                  alt={book.ten_sach} className="pd3-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-book.jpg'; }}
                />
                {oos && <div className="pd3-img-oos">Hết hàng</div>}
              </div>
            </div>

            {/* ── Cột phải: info ── */}
            <div className="pd3-info-col">

              {/* Badge thể loại */}
              {book.loaisach?.ten_loai && (
                <span className="pd3-badge">{book.loaisach.ten_loai}</span>
              )}

              {/* Tên sách */}
              <h1 className="pd3-title">{book.ten_sach}</h1>

              {/* Tác giả / NXB */}
              <div className="pd3-meta">
                {book.tac_gia && (
                  <span>Tác giả: <strong>{book.tac_gia}</strong></span>
                )}
                {book.tac_gia && book.nha_xuat_ban && <span className="pd3-dot">·</span>}
                {book.nha_xuat_ban && (
                  <span>NXB: <strong>{book.nha_xuat_ban}</strong></span>
                )}
              </div>

              <div className="pd3-hline" />

              {/* Giá */}
              <div className="pd3-price-row">
                <span className="pd3-price">{fmt(price)}</span>
                {hasDisc && <span className="pd3-price-old">{fmt(book.gia)}</span>}
              </div>

              {/* Tình trạng kho */}
              <div className={`pd3-stock${oos ? ' oos' : ''}`}>
                {oos
                  ? <><AlertCircle size={13} /> Hết hàng</>
                  : <><CheckCircle2 size={13} /> Còn hàng <em>({book.so_luong} cuốn)</em></>
                }
              </div>

              {/* Thông số nhanh inline */}
              {(book.so_trang || book.trong_luong || book.kich_thuoc) && (
                <div className="pd3-quick-specs">
                  {book.so_trang  && <span><Hash size={12}/> {book.so_trang} trang</span>}
                  {book.kich_thuoc && <span><Maximize2 size={12}/> {book.kich_thuoc}</span>}
                  {book.trong_luong && <span><Scale size={12}/> {book.trong_luong}g</span>}
                </div>
              )}

              <div className="pd3-hline" />

              {/* Quantity */}
              {!oos && (
                <div className="pd3-qty-row">
                  <span className="pd3-qty-label">Số lượng</span>
                  <div className="pd3-qty-ctrl">
                    <button className="pd3-qty-btn"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      disabled={qty <= 1}><Minus size={13} /></button>
                    <span className="pd3-qty-num">{qty}</span>
                    <button className="pd3-qty-btn"
                      onClick={() => setQty(q => Math.min(book.so_luong, q + 1))}
                      disabled={qty >= book.so_luong}><Plus size={13} /></button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pd3-actions">
                <button
                  id="add-to-cart-btn"
                  className="pd3-btn-outline"
                  onClick={handleAdd}
                  disabled={oos || adding}
                >
                  {adding ? <Loader size={15} className="pd3-spin" /> : <ShoppingCart size={15} />}
                  {adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <button
                  id="buy-now-btn"
                  className="pd3-btn-solid"
                  onClick={handleBuy}
                  disabled={oos || buying}
                >
                  {buying ? <Loader size={15} className="pd3-spin" /> : <Package size={15} />}
                  {buying ? 'Đang xử lý...' : 'Mua ngay'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ════════════ CARD 2: Thông số + Mô tả ════════════ */}
        <div className="pd3-detail-card">

          {/* Bảng thông số */}
          {(book.so_trang || book.trong_luong || book.kich_thuoc || book.loaisach || book.tac_gia || book.nha_xuat_ban) && (
            <div className="pd3-specs-wrap">
              <h2 className="pd3-section-title">
                <span className="pd3-title-bar" />
                Thông tin chi tiết
              </h2>
              <table className="pd3-specs">
                <tbody>
                  {book.loaisach?.ten_loai && (
                    <tr><td><Layers size={13}/> Thể loại</td><td>{book.loaisach.ten_loai}</td></tr>
                  )}
                  {book.tac_gia && (
                    <tr><td><BookOpen size={13}/> Tác giả</td><td>{book.tac_gia}</td></tr>
                  )}
                  {book.nha_xuat_ban && (
                    <tr><td><BookOpen size={13}/> Nhà xuất bản</td><td>{book.nha_xuat_ban}</td></tr>
                  )}
                  {book.so_trang && (
                    <tr><td><Hash size={13}/> Số trang</td><td>{book.so_trang} trang</td></tr>
                  )}
                  {book.kich_thuoc && (
                    <tr><td><Maximize2 size={13}/> Kích thước</td><td>{book.kich_thuoc}</td></tr>
                  )}
                  {book.trong_luong && (
                    <tr><td><Scale size={13}/> Trọng lượng</td><td>{book.trong_luong}g</td></tr>
                  )}
                  <tr>
                    <td><Package size={13}/> Tình trạng</td>
                    <td style={{ color: oos ? '#dc2626' : '#059669', fontWeight: 600 }}>
                      {oos ? 'Hết hàng' : `Còn ${book.so_luong} cuốn`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Divider */}
          {book.mo_ta && <div className="pd3-card-div" />}

          {/* Mô tả */}
          {book.mo_ta && (
            <div className="pd3-desc-wrap">
              <h2 className="pd3-section-title">
                <span className="pd3-title-bar" />
                Mô tả sản phẩm
              </h2>
              <div className="pd3-desc">
                {book.mo_ta.split('\n').map((line, i) =>
                  line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ════════════ CARD 3: Sản phẩm liên quan ════════════ */}
        {(loadRel || related.length > 0) && (
          <div className="pd3-related-card">
            <div className="pd3-rel-hd">
              <h2 className="pd3-section-title productdetail-auto-17">
                <span className="pd3-title-bar" />
                Có thể bạn cũng thích
              </h2>
              <Link to="/category" className="pd3-rel-viewall">Xem tất cả <ChevronRight size={13} /></Link>
            </div>
            <div className="pd3-rel-grid">
              {loadRel
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="pd3-rel-card productdetail-auto-18">
                      <div className="pd3-rel-img">
                        <div className="pd3-sk productdetail-auto-19" />
                      </div>
                      <div className="pd3-rel-body">
                        <div className="pd3-sk productdetail-auto-20" />
                        <div className="pd3-sk productdetail-auto-21" />
                      </div>
                    </div>
                  ))
                : related.map(s => <RelCard key={s.id} sach={s} />)
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;