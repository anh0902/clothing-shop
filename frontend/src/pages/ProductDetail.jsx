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

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + '₫';
const extractList = (r) => r.data?.data?.data || r.data?.data || [];

/* ══════════════ Skeleton ══════════════ */
const Skeleton = () => (
  <div className="pd3-root">
    <div className="pd3-wrap">
      <div className="pd3-sk" style={{ width: 260, height: 13, marginBottom: 20 }} />
      <div className="pd3-main-card">
        <div className="pd3-main-grid">
          <div className="pd3-img-col">
            <div className="pd3-sk" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 12 }} />
          </div>
          <div className="pd3-info-col" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="pd3-sk" style={{ width: 70, height: 22, borderRadius: 99 }} />
            <div className="pd3-sk" style={{ width: '88%', height: 30 }} />
            <div className="pd3-sk" style={{ width: 200, height: 14 }} />
            <div className="pd3-sk" style={{ width: 140, height: 38, marginTop: 8 }} />
            <div className="pd3-sk" style={{ width: 160, height: 14 }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <div className="pd3-sk" style={{ flex: 1, height: 48, borderRadius: 10 }} />
              <div className="pd3-sk" style={{ flex: 1, height: 48, borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>{shimmerCSS}</style>
  </div>
);

/* ══════════════ Error ══════════════ */
const ErrorUI = ({ onRetry }) => (
  <div className="pd3-root">
    <div className="pd3-wrap">
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <AlertCircle size={52} color="#e53e3e" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          Không tìm thấy sản phẩm
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Sản phẩm có thể đã bị xóa hoặc đường dẫn không đúng.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/category" className="pd3-btn-outline">
            <BookOpen size={15} /> Xem sản phẩm khác
          </Link>
          <button className="pd3-btn-solid" onClick={onRetry}>
            <RefreshCw size={15} /> Thử lại
          </button>
        </div>
      </div>
    </div>
    <style>{shimmerCSS}</style>
  </div>
);

/* ══════════════ Related card ══════════════ */
const RelCard = ({ sach }) => (
  <Link to={`/product/${sach.id}`} className="pd3-rel-card">
    <div className="pd3-rel-img">
      <img
        src={sach.anh_bia || '/images/placeholder-book.jpg'}
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

const shimmerCSS = `
  @keyframes pd3-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
  .pd3-sk{border-radius:6px;display:block;
    background:linear-gradient(90deg,#e8eaed 25%,#f2f5f7 50%,#e8eaed 75%);
    background-size:1000px 100%;animation:pd3-shimmer 1.3s infinite}
`;

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
      const data = res.data?.data || res.data;
      setBook(data);
      if (data?.loai_sach_id) {
        setLoadRel(true);
        axiosClient.get('/sach/filter', { params: { loai_sach_id: data.loai_sach_id } })
          .then(r => setRel(extractList(r).filter(b => b.id !== data.id).slice(0, 5)))
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
      const res = await cartAPI.addToCart({ sach_id: book.id, so_luong: qty });
      if (res.data?.success) { toast.success(res.data.message || 'Đã thêm vào giỏ hàng'); fetchCart(); }
      else toast.error(res.data?.message || 'Có lỗi xảy ra');
    } catch (e) { toast.error(e.response?.data?.message || 'Không thể thêm vào giỏ hàng'); }
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
                  src={book.anh_bia || '/images/placeholder-book.jpg'}
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
              <h2 className="pd3-section-title" style={{ margin: 0 }}>
                <span className="pd3-title-bar" />
                Có thể bạn cũng thích
              </h2>
              <Link to="/category" className="pd3-rel-viewall">Xem tất cả <ChevronRight size={13} /></Link>
            </div>
            <div className="pd3-rel-grid">
              {loadRel
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="pd3-rel-card" style={{ pointerEvents: 'none' }}>
                      <div className="pd3-rel-img">
                        <div className="pd3-sk" style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div className="pd3-rel-body">
                        <div className="pd3-sk" style={{ height: 12, width: '80%', marginBottom: 6 }} />
                        <div className="pd3-sk" style={{ height: 14, width: '50%' }} />
                      </div>
                    </div>
                  ))
                : related.map(s => <RelCard key={s.id} sach={s} />)
              }
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════ STYLES ═══════════════ */}
      <style>{`
        ${shimmerCSS}

        .pd3-root { background: #f1f3f6; min-height: 100vh; }
        .pd3-wrap { max-width: 1060px; margin: 0 auto; padding: 1.25rem 1.25rem 4rem; }

        /* Breadcrumb */
        .pd3-bc { display: flex; align-items: center; gap: 5px; margin-bottom: 1.1rem; flex-wrap: wrap; }
        .pd3-bc-a { font-size: 0.79rem; color: #6b7280; text-decoration: none; transition: color .15s; }
        .pd3-bc-a:hover { color: #1e3a5f; }
        .pd3-bc-sep { color: #d1d5db; }
        .pd3-bc-cur { font-size: 0.79rem; color: #374151; font-weight: 600;
          max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Card base */
        .pd3-main-card, .pd3-detail-card, .pd3-related-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e9ecef; box-shadow: 0 1px 5px rgba(0,0,0,0.055);
          margin-bottom: 1.1rem; overflow: hidden;
        }

        /* ── Card 1 ── */
        .pd3-main-card { padding: 2rem 2.25rem; }
        .pd3-main-grid {
          display: grid; grid-template-columns: 300px 1fr;
          gap: 2.5rem; align-items: start;
        }

        /* Image */
        .pd3-img-frame {
          border-radius: 12px; overflow: hidden;
          background: #f8f9fb; position: relative;
          box-shadow: 0 3px 14px rgba(0,0,0,0.09);
        }
        .pd3-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
        .pd3-img-oos {
          position: absolute; inset: 0; background: rgba(0,0,0,0.42);
          color: #fff; font-weight: 800; font-size: 1.05rem;
          display: flex; align-items: center; justify-content: center; letter-spacing: 1px;
        }

        /* Info col */
        .pd3-info-col { display: flex; flex-direction: column; gap: 0; }
        .pd3-badge {
          display: inline-block; padding: 3px 13px;
          background: #eff6ff; color: #1e3a5f;
          font-size: 0.73rem; font-weight: 700;
          border-radius: 999px; border: 1px solid #bfdbfe;
          margin-bottom: 0.85rem; align-self: flex-start;
        }
        .pd3-title {
          font-size: 1.5rem; font-weight: 900;
          color: #111827; line-height: 1.3;
          margin: 0 0 0.7rem; letter-spacing: -0.3px;
        }
        .pd3-meta {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
          font-size: 0.82rem; color: #6b7280; margin-bottom: 0;
        }
        .pd3-meta strong { color: #374151; }
        .pd3-dot { color: #d1d5db; }

        .pd3-hline { border: none; border-top: 1px solid #f1f3f6; margin: 1rem 0; }

        /* Price */
        .pd3-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 0.55rem; }
        .pd3-price { font-size: 1.9rem; font-weight: 900; color: #dc2626; line-height: 1; }
        .pd3-price-old { font-size: 1rem; color: #9ca3af; text-decoration: line-through; }

        /* Stock */
        .pd3-stock {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.8rem; font-weight: 600; color: #059669; margin-bottom: 0.75rem;
        }
        .pd3-stock.oos { color: #dc2626; }
        .pd3-stock em { color: #9ca3af; font-style: normal; font-weight: 400; }

        /* Quick specs */
        .pd3-quick-specs {
          display: flex; gap: 1rem; flex-wrap: wrap;
          font-size: 0.77rem; color: #6b7280; margin-bottom: 0;
        }
        .pd3-quick-specs span { display: flex; align-items: center; gap: 4px; }

        /* Qty */
        .pd3-qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.1rem; }
        .pd3-qty-label { font-size: 0.83rem; font-weight: 600; color: #374151; }
        .pd3-qty-ctrl {
          display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;
        }
        .pd3-qty-btn {
          padding: 0.48rem 0.85rem; border: none; background: #f8fafc;
          color: #374151; cursor: pointer; display: flex;
          align-items: center; transition: background .15s;
        }
        .pd3-qty-btn:hover:not(:disabled) { background: #eff6ff; }
        .pd3-qty-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .pd3-qty-num {
          min-width: 38px; text-align: center; font-size: 0.9rem; font-weight: 700;
          color: #111827; border-left: 1.5px solid #e2e8f0; border-right: 1.5px solid #e2e8f0;
          padding: 0 0.4rem;
        }

        /* Action buttons */
        .pd3-actions { display: flex; gap: 0.75rem; }
        .pd3-btn-outline {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 0.78rem 1rem;
          border: 2px solid #1e3a5f; background: #fff; color: #1e3a5f;
          font-size: 0.87rem; font-weight: 700; border-radius: 10px;
          cursor: pointer; transition: background .15s;
        }
        .pd3-btn-outline:hover:not(:disabled) { background: #eff6ff; }
        .pd3-btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
        .pd3-btn-solid {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 0.78rem 1rem;
          border: 2px solid #1e3a5f; background: #1e3a5f; color: #fff;
          font-size: 0.87rem; font-weight: 700; border-radius: 10px;
          cursor: pointer; transition: background .15s, border-color .15s;
        }
        .pd3-btn-solid:hover:not(:disabled) { background: #152c4a; border-color: #152c4a; }
        .pd3-btn-solid:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes pd3-spin-anim { to { transform: rotate(360deg); } }
        .pd3-spin { animation: pd3-spin-anim .8s linear infinite; }

        /* ── Card 2 ── */
        .pd3-detail-card { padding: 2rem 2.25rem; }
        .pd3-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.88rem; font-weight: 900;
          color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.5px;
          margin: 0 0 1.1rem; padding-bottom: 0.7rem;
          border-bottom: 2px solid #f1f3f6;
        }
        .pd3-title-bar { width: 4px; height: 18px; background: #1e3a5f; border-radius: 2px; flex-shrink: 0; }

        /* Specs table */
        .pd3-specs { width: 100%; border-collapse: collapse; }
        .pd3-specs tr { border-bottom: 1px solid #f3f4f6; }
        .pd3-specs tr:last-child { border-bottom: none; }
        .pd3-specs td { padding: 0.62rem 0; font-size: 0.84rem; vertical-align: top; }
        .pd3-specs td:first-child {
          color: #6b7280; font-weight: 600; width: 170px;
          display: flex; align-items: center; gap: 7px;
        }
        .pd3-specs td:last-child { color: #111827; font-weight: 500; }

        .pd3-card-div { border: none; border-top: 1px dashed #e9ecef; margin: 1.5rem 0; }

        /* Desc */
        .pd3-desc { font-size: 0.86rem; color: #374151; line-height: 1.95; }
        .pd3-desc p { margin-bottom: 0.55em; }
        .pd3-desc p:last-child { margin-bottom: 0; }

        /* ── Card 3 ── */
        .pd3-related-card { padding: 1.75rem 2.25rem 2rem; }
        .pd3-rel-hd {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.1rem;
        }
        .pd3-rel-viewall {
          font-size: 0.79rem; font-weight: 600; color: #6b7280;
          text-decoration: none; display: flex; align-items: center; gap: 2px;
          transition: color .15s;
        }
        .pd3-rel-viewall:hover { color: #1e3a5f; }

        .pd3-rel-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.9rem; }
        .pd3-rel-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #f0f0f0;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column;
          transition: box-shadow .2s, transform .18s; overflow: hidden;
        }
        .pd3-rel-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.1); transform: translateY(-4px); }
        .pd3-rel-img { aspect-ratio: 2/3; background: #f8f9fb; overflow: hidden; position: relative; }
        .pd3-rel-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
        .pd3-rel-card:hover .pd3-rel-img img { transform: scale(1.04); }
        .pd3-oos-badge {
          position: absolute; top: 6px; left: 6px;
          background: rgba(15,23,42,.65); color: #fff;
          font-size: 0.64rem; font-weight: 700; padding: 2px 7px; border-radius: 999px;
        }
        .pd3-rel-body { padding: 0.62rem 0.72rem 0.78rem; flex-grow: 1; display: flex; flex-direction: column; }
        .pd3-rel-name {
          font-size: 0.79rem; font-weight: 700; color: #111827; line-height: 1.42;
          display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden; min-height: 2.3em; margin-bottom: 0.25rem;
        }
        .pd3-rel-author { font-size: 0.69rem; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 0.35rem; }
        .pd3-rel-price { font-size: 0.87rem; font-weight: 800; color: #dc2626; margin-top: auto; }

        /* Responsive */
        @media (max-width: 860px) {
          .pd3-main-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .pd3-img-frame { max-width: 280px; margin: 0 auto; }
          .pd3-rel-grid { grid-template-columns: repeat(3, 1fr); }
          .pd3-main-card { padding: 1.5rem; }
          .pd3-detail-card { padding: 1.5rem; }
          .pd3-related-card { padding: 1.5rem; }
        }
        @media (max-width: 560px) {
          .pd3-wrap { padding: 0.75rem 0.75rem 3rem; }
          .pd3-title { font-size: 1.15rem; }
          .pd3-price { font-size: 1.4rem; }
          .pd3-actions { flex-direction: column; }
          .pd3-rel-grid { grid-template-columns: repeat(2, 1fr); gap: 0.65rem; }
          .pd3-main-card, .pd3-detail-card, .pd3-related-card { padding: 1rem 1.1rem; }
          .pd3-specs td:first-child { width: 130px; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;