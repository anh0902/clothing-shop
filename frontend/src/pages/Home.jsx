import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import {
  BookOpen, GraduationCap, Heart, Rocket, Globe, PenTool,
  TrendingUp, Layers, ChevronRight, RefreshCw, ChevronLeft,
} from 'lucide-react';

// ── Static banner imports (Vite bundles these with hashed filenames — safe for deploy) ──
import banner1   from '../assets/banner/banner1.jpg';
import banner2   from '../assets/banner/banner2.jpg';
import banner3   from '../assets/banner/banner3.jpg';
import bmin0    from '../assets/banner/bannermin.jpg';
import bmin1    from '../assets/banner/bannermin1.jpg';
import bmin2    from '../assets/banner/bannermin2.jpg';
import city1    from '../assets/banner/city1.jpg';
import city2    from '../assets/banner/city2.jpg';
import city3    from '../assets/banner/city3.jpg';

/* ── Banner slides — dùng biến import thay vì string path để Vite xử lý đúng khi build ── */
const BANNERS = [
  { src: banner1, alt: 'Banner 1' },
  { src: banner2, alt: 'Banner 2' },
  { src: banner3, alt: 'Banner 3' },
];
const BANNERS_MIN = [bmin0, bmin1, bmin2];
const BANNERS_CITY = [city1, city2, city3];

/* ─────────────────────────────────────────── helpers ── */
const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);
const extractList = (res) => res.data?.data?.data || res.data?.data || [];

/* ─────────────────────────────────────────── skeleton ── */
const SkCard = () => (
  <div className="hx-card" style={{ pointerEvents: 'none' }}>
    <div className="hx-card-img"><div className="hx-sk" style={{ width: '100%', height: '100%' }} /></div>
    <div className="hx-card-body">
      <div className="hx-sk" style={{ height: 12, width: '85%', marginBottom: 5 }} />
      <div className="hx-sk" style={{ height: 12, width: '60%', marginBottom: 10 }} />
      <div className="hx-sk" style={{ height: 10, width: '45%', marginBottom: 6 }} />
      <div className="hx-sk" style={{ height: 14, width: '50%' }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────── book card ── */
const BookCard = ({ sach }) => {
  const price    = sach.gia_ban || sach.gia || 0;
  const hasDisc  = sach.gia_ban && sach.gia && sach.gia_ban < sach.gia;
  return (
    <Link to={`/product/${sach.id}`} className="hx-card">
      <div className="hx-card-img">
        <img
          src={sach.anh_bia || '/images/placeholder-book.jpg'}
          alt={sach.ten_sach} className="hx-img"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-book.jpg'; }}
        />
        {sach.so_luong <= 0 && <span className="hx-oos">Hết hàng</span>}
      </div>
      <div className="hx-card-body">
        <p className="hx-name">{sach.ten_sach}</p>
        {sach.tac_gia && <p className="hx-author">{sach.tac_gia}</p>}
        <div className="hx-price-row">
          <span className="hx-price-new">{fmtPrice(price)}₫</span>
          {hasDisc && <span className="hx-price-old">{fmtPrice(sach.gia)}₫</span>}
        </div>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────── section header ── */
const SecHead = ({ title, linkTo }) => (
  <div className="hx-sec-hd">
    <div className="hx-sec-hd-left">
      <span className="hx-sec-bar" />
      <h2 className="hx-sec-title">{title}</h2>
    </div>
    <Link to={linkTo || '/category'} className="hx-viewall">
      Xem tất cả <ChevronRight size={14} />
    </Link>
  </div>
);

/* ─────────────────────────────────────────── grid / scroll ── */
const BookRow = ({ books, loading, count = 5 }) => (
  <div className="hx-scroll-wrap">
    <div className="hx-grid">
      {loading
        ? [...Array(count)].map((_, i) => <SkCard key={i} />)
        : books.slice(0, count).map(b => <BookCard key={b.id} sach={b} />)
      }
    </div>
  </div>
);

/* ─────────────────────────────────────────── lazy cat section ── */
const CatSection = ({ catId, count = 5 }) => {
  const [books, setBooks]   = useState([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => {
    if (!catId) return;
    axiosClient.get('/sach/filter', { params: { loai_sach_id: catId } })
      .then(r => setBooks(extractList(r)))
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [catId]);
  return <BookRow books={books} loading={loading} count={count} />;
};

/* quick-link icons */
const QUICK_LINKS = [
  { icon: <BookOpen size={22} />,      label: 'Văn học',    q: 'văn học' },
  { icon: <GraduationCap size={22} />, label: 'Giáo dục',   q: 'giáo dục' },
  { icon: <Rocket size={22} />,        label: 'Lập trình',  q: 'lập trình' },
  { icon: <TrendingUp size={22} />,    label: 'Kinh tế',    q: 'kinh tế' },
  { icon: <Heart size={22} />,         label: 'Tâm lý',     q: 'tâm lý' },
  { icon: <Globe size={22} />,         label: 'Ngoại ngữ',  q: 'ngoại ngữ' },
  { icon: <PenTool size={22} />,       label: 'Kỹ năng',    q: 'kỹ năng' },
  { icon: <Layers size={22} />,        label: 'Khoa học',   q: 'khoa học' },
];

/* ══════════════════════════════════════ HOME PAGE ══ */
const Home = () => {
  const navigate = useNavigate();

  /* state */
  const [categories, setCats]         = useState([]);
  const [activeCat, setActiveCat]     = useState(null);
  const [newBooks, setNewBooks]       = useState([]);
  const [filtBooks, setFiltBooks]     = useState([]);
  const [spotCats, setSpotCats]       = useState([]);   // [{ id, ten_loai }]
  const [loadingNew,  setLoadNew]     = useState(true);
  const [loadingFilt, setLoadFilt]    = useState(false);
  const [error, setError]             = useState(false);
  const [email, setEmail]             = useState('');
  /* banner carousel */
  const [slide, setSlide]             = useState(0);
  const [slideMin, setSlideMin]       = useState(0);
  const [slideCity, setSlideCity]     = useState(0);
  const slideTimer                    = useRef(null);

  /* ── auto-play banner ── */
  const resetTimer = useCallback(() => {
    clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => setSlide(s => (s + 1) % BANNERS.length), 4000);
  }, []);
  useEffect(() => { resetTimer(); return () => clearInterval(slideTimer.current); }, [resetTimer]);
  const goPrev = () => { setSlide(s => (s - 1 + BANNERS.length) % BANNERS.length); resetTimer(); };
  const goNext = () => { setSlide(s => (s + 1) % BANNERS.length); resetTimer(); };
  const goTo   = (i) => { setSlide(i); resetTimer(); };

  /* auto-rotate side banners (offset timing) */
  useEffect(() => {
    const t1 = setInterval(() => setSlideMin(s => (s + 1) % BANNERS_MIN.length), 3500);
    const t2 = setInterval(() => setSlideCity(s => (s + 1) % BANNERS_CITY.length), 5000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  /* ── fetch categories ── */
  const fetchCats = useCallback(async () => {
    try {
      const res  = await axiosClient.get('/loaisach');
      const cats = res.data?.data || [];
      setCats(cats);
      // pick first 3 categories for spotlight sections
      setSpotCats(cats.slice(0, 3));
    } catch { /* silent */ }
  }, []);

  /* ── fetch newest books ── */
  const fetchNew = useCallback(async () => {
    setLoadNew(true); setError(false);
    try {
      const res = await axiosClient.get('/sach/filter', { params: { sort_by: 'moi_nhat' } });
      setNewBooks(extractList(res));
    } catch { setError(true); }
    finally { setLoadNew(false); }
  }, []);

  /* ── filter by category PILL ── */
  const filterByCat = useCallback(async (catId) => {
    setLoadFilt(true);
    try {
      const params = catId ? { loai_sach_id: catId } : { sort_by: 'moi_nhat' };
      const res = await axiosClient.get('/sach/filter', { params });
      setFiltBooks(extractList(res));
    } catch { setFiltBooks([]); }
    finally { setLoadFilt(false); }
  }, []);

  useEffect(() => { fetchCats(); fetchNew(); }, [fetchCats, fetchNew]);

  const handlePill = (cat) => {
    setActiveCat(cat || null);
    filterByCat(cat ? cat.id : null);
  };

  const visibleBooks = activeCat ? filtBooks : newBooks;
  const isLoadVisible = activeCat ? loadingFilt : loadingNew;

  return (
    <div className="hx-root">

      {/* ════════════════════ HERO BANNER ════════════ */}
      <div className="hx-hero">
        <div className="hx-hero-main">
          {/* Main banner — carousel */}
          <div className="hx-banner-main">
            {/* Slides */}
            <div className="hx-slides">
              {BANNERS.map((b, i) => (
                <img
                  key={i}
                  src={b.src} alt={b.alt}
                  className={`hx-slide-img${i === slide ? ' active' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            {/* Overlay copy */}
            <div className="hx-banner-copy">
              <p className="hx-banner-tag">Sách chính hãng – Giá tốt mỗi ngày</p>
              <h1 className="hx-banner-h1">Khám phá<br/>kho tàng tri thức</h1>
              <button className="hx-banner-cta" onClick={() => navigate('/category')}>
                Mua sắm ngay
              </button>
            </div>
            {/* Prev / Next */}
            
            {/* Dots */}
            <div className="hx-dots">
              {BANNERS.map((_, i) => (
                <button key={i} className={`hx-dot${i === slide ? ' active' : ''}`} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
          {/* Side banners */}
          <div className="hx-banner-side">
            {/* Banner nhỏ trên: bannermin */}
            <div className="hx-banner-sm">
              {BANNERS_MIN.map((src, i) => (
                <img key={i} src={src} alt={`bannermin ${i}`}
                  className={`hx-sm-img${i === slideMin ? ' active' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            {/* Banner nhỏ dưới: city */}
            <div className="hx-banner-sm">
              {BANNERS_CITY.map((src, i) => (
                <img key={i} src={src} alt={`city ${i}`}
                  className={`hx-sm-img${i === slideCity ? ' active' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════ QUICK LINKS (tích hợp filter) ════════════ */}
      <div className="hx-ql-wrap">
        <div className="hx-ql-inner">
          {/* Nút Tất cả */}
          <button
            className={`hx-ql-item${!activeCat ? ' hx-ql-active' : ''}`}
            onClick={() => handlePill(null)}>
            <div className="hx-ql-ico"><BookOpen size={22} /></div>
            <span className="hx-ql-label">Tất cả</span>
          </button>
          {/* Các danh mục từ DB */}
          {categories.map(c => (
            <button
              key={c.id}
              className={`hx-ql-item${activeCat?.id === c.id ? ' hx-ql-active' : ''}`}
              onClick={() => handlePill(c)}>
              <div className="hx-ql-ico">
                {QUICK_LINKS.find(q =>
                  c.ten_loai?.toLowerCase().includes(q.q.split(' ')[0])
                )?.icon || <Layers size={22} />}
              </div>
              <span className="hx-ql-label">{c.ten_loai}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════ MAIN CONTENT ════════════ */}
      <div className="hx-wrap">

        {/* ── Sách mới nhất / theo danh mục đang chọn ── */}
        <div className="hx-block">
          <SecHead
            title={activeCat ? activeCat.ten_loai.toUpperCase() : 'SÁCH MỚI NHẤT'}
            linkTo={activeCat ? `/category?loai=${activeCat.id}` : '/category'}
          />
          {error ? (
            <div className="hx-err">
              Không tải được dữ liệu.{' '}
              <button className="hx-retry" onClick={() => { fetchNew(); fetchCats(); }}>
                <RefreshCw size={13} /> Thử lại
              </button>
            </div>
          ) : (
            <BookRow
              books={visibleBooks}
              loading={isLoadVisible}
              count={activeCat ? 10 : 5}
            />
          )}
        </div>

        {/* ── Spotlight sections – chỉ hiện khi KHÔNG lọc danh mục ── */}
        {!activeCat && spotCats.map((cat) => (
          <div key={cat.id} className="hx-block">
            <SecHead title={cat.ten_loai.toUpperCase()} linkTo={`/category?loai=${cat.id}`} />
            <CatSection catId={cat.id} count={5} />
          </div>
        ))}

        {/* ── Newsletter ── */}
        <div className="hx-newsletter">
          <div className="hx-nl-left">
            <p className="hx-nl-title"> Đăng ký nhận ưu đãi độc quyền</p>
            <p className="hx-nl-sub">Nhận thông báo mới nhất về sách mới nhất và các chương trình khuyến mãi.</p>
          </div>
          <form className="hx-nl-form" onSubmit={e => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký! 🎉'); setEmail(''); }}>
            <input
              className="hx-nl-inp" type="email" placeholder="Nhập địa chỉ email của bạn..."
              value={email} onChange={e => setEmail(e.target.value)} required
            />
            <button className="hx-nl-btn" type="submit">Đăng ký</button>
          </form>
        </div>

      </div>{/* /hx-wrap */}

      {/* ════════════════════ STYLES ════════════ */}
      <style>{`
        /* ── Root ── */
        .hx-root { background: #f1f3f6; min-height: 100vh; font-family: inherit; }

        /* ── Hero ── */
        .hx-hero { background: #f1f3f6; padding: 1rem 1.25rem 0; max-width: 1220px; margin: 0 auto; }
        .hx-hero-main { display: grid; grid-template-columns: 1fr 260px; gap: 0.85rem; }
        .hx-banner-main {
          position: relative; border-radius: 14px; overflow: hidden;
          height: 300px; background: #0f172a;
        }
        /* ── Slides ── */
        .hx-slides { position: absolute; inset: 0; }
        .hx-slide-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block;
          opacity: 0; transition: opacity 0.7s ease;
          pointer-events: none;
        }
        .hx-slide-img.active { opacity: 1; pointer-events: auto; }
        /* ── Copy overlay ── */
        .hx-banner-copy {
          position: relative; z-index: 2;
          padding: 2.25rem 2.5rem;
          background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 70%);
          height: 100%; display: flex; flex-direction: column; justify-content: center;
        }
        .hx-banner-tag {
          color: #93c5fd; font-size: 0.78rem; font-weight: 600;
          margin-bottom: 0.75rem; letter-spacing: 0.3px;
        }
        .hx-banner-h1 {
          color: #fff; font-size: clamp(1.5rem,2.8vw,2.2rem);
          font-weight: 900; line-height: 1.2; margin-bottom: 1.5rem;
          letter-spacing: -0.3px;
        }
        .hx-banner-cta {
          background: #2563eb; color: #fff; border: none; cursor: pointer;
          font-weight: 700; font-size: 0.88rem;
          padding: 0.65rem 1.4rem; border-radius: 8px;
          transition: background .15s, transform .15s;
          align-self: flex-start;
        }
        .hx-banner-cta:hover { background: #1d4ed8; transform: translateY(-1px); }
        /* ── Prev / Next ── */
        .hx-sl-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          z-index: 3; background: rgba(255,255,255,0.2); border: none;
          color: #fff; width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s; backdrop-filter: blur(4px);
        }
        .hx-sl-btn:hover { background: rgba(255,255,255,0.4); }
        .hx-sl-prev { left: 12px; }
        .hx-sl-next { right: 12px; }
        /* ── Dots ── */
        .hx-dots {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          z-index: 3; display: flex; gap: 6px;
        }
        .hx-dot {
          width: 7px; height: 7px; border-radius: 999px;
          background: rgba(255,255,255,0.45); border: none; cursor: pointer;
          transition: all .2s; padding: 0;
        }
        .hx-dot.active { background: #fff; width: 20px; }

        .hx-banner-side { display: flex; flex-direction: column; gap: 0.85rem; }
        .hx-banner-sm {
          flex: 1; border-radius: 14px; overflow: hidden;
          position: relative; background: #e5e7eb;
          min-height: 130px;
        }
        .hx-sm-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          opacity: 0; transition: opacity 0.7s ease;
        }
        .hx-sm-img.active { opacity: 1; }


        /* ── Quick Links ── */
        .hx-ql-wrap {
          background: #fff; border-bottom: 1px solid #e9ecef;
          padding: 0.9rem 1.25rem;
        }
        .hx-ql-inner {
          max-width: 1220px; margin: 0 auto;
          display: flex; justify-content: space-around; flex-wrap: wrap; gap: 0.25rem;
        }
        .hx-ql-item {
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer;
          border-radius: 10px; transition: background .15s;
          min-width: 72px;
        }
        .hx-ql-item:hover { background: #f0f4ff; }
        .hx-ql-ico {
          width: 44px; height: 44px; border-radius: 12px;
          background: #eff6ff; color: #1e3a5f;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s;
        }
        .hx-ql-item:hover { background: #f0f4ff; }
        .hx-ql-item:hover .hx-ql-ico { background: #dbeafe; }
        .hx-ql-active .hx-ql-ico { background: #1e3a5f !important; color: #fff !important; }
        .hx-ql-active .hx-ql-label { color: #1e3a5f; font-weight: 800; }
        .hx-ql-label { font-size: 0.73rem; font-weight: 600; color: #374151; }

        /* ── Main wrap ── */
        .hx-wrap { max-width: 1220px; margin: 0 auto; padding: 0 1.25rem 4rem; }

        /* ── Content block ── */
        .hx-block {
          background: #fff; border-radius: 14px;
          border: 1px solid #e9ecef;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          padding: 1.25rem 1.4rem 1.4rem;
          margin-top: 1.25rem;
        }

        /* ── Section header ── */
        .hx-sec-hd {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem; padding-bottom: 0.75rem;
          border-bottom: 2px solid #f1f3f6;
        }
        .hx-sec-hd-left { display: flex; align-items: center; gap: 10px; }
        .hx-sec-bar { width: 4px; height: 20px; background: #1e3a5f; border-radius: 2px; flex-shrink:0; }
        .hx-sec-title { font-size: 0.9rem; font-weight: 900; color: #1e3a5f; letter-spacing: 0.6px; margin:0; }
        .hx-viewall {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.8rem; font-weight: 600; color: #6b7280;
          text-decoration: none; transition: color .15s;
        }
        .hx-viewall:hover { color: #1e3a5f; }

        /* ── Horizontal scroll ── */
        .hx-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
        .hx-scroll-wrap::-webkit-scrollbar { height: 4px; }
        .hx-scroll-wrap::-webkit-scrollbar-track { background: #f1f3f6; }
        .hx-scroll-wrap::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }

        /* ── Grid ── */
        .hx-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.9rem;
          min-width: 600px;
        }

        /* ── Book card ── */
        .hx-card {
          background: #fff; border-radius: 10px;
          border: 1px solid #f0f0f0;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column;
          transition: box-shadow 0.2s, transform 0.18s;
          cursor: pointer; overflow: hidden;
        }
        .hx-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.11); transform: translateY(-4px); }
        .hx-card-img {
          position: relative; aspect-ratio: 2/3;
          background: #f8f9fa; overflow: hidden;
        }
        .hx-img {
          width: 100%; height: 100%; object-fit: cover;
          display: block; transition: transform 0.3s;
        }
        .hx-card:hover .hx-img { transform: scale(1.04); }
        .hx-oos {
          position: absolute; top: 6px; left: 6px;
          background: rgba(15,23,42,0.65); color: #fff;
          font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 999px;
        }
        .hx-card-body { padding: 0.65rem 0.75rem 0.8rem; flex-grow:1; display:flex; flex-direction:column; }
        .hx-name {
          font-size: 0.8rem; font-weight: 700; color: #111827; line-height: 1.42;
          display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden; min-height: 2.3em; margin-bottom: 0.25rem;
        }
        .hx-author { font-size: 0.7rem; color: #6b7280; margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hx-price-row { display: flex; align-items: center; gap: 6px; margin-top: auto; }
        .hx-price-new { font-size: 0.88rem; font-weight: 800; color: #dc2626; }
        .hx-price-old { font-size: 0.73rem; color: #9ca3af; text-decoration: line-through; }

        /* ── Skeleton ── */
        @keyframes hx-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .hx-sk {
          border-radius: 5px;
          background: linear-gradient(90deg, #e8eaed 25%, #f2f4f7 50%, #e8eaed 75%);
          background-size: 1000px 100%;
          animation: hx-shimmer 1.3s infinite; display: block;
        }

        /* ── Promo strip ── */
        .hx-promo-strip {
          background: #fff; border-radius: 14px; margin-top: 1.25rem;
          border: 1px solid #e9ecef;
          display: flex; align-items: center; justify-content: space-around;
          padding: 1.25rem 1.5rem; flex-wrap: wrap; gap: 1rem;
        }
        .hx-promo-item { display: flex; align-items: center; gap: 12px; }
        .hx-promo-ico { font-size: 1.6rem; }
        .hx-promo-hd { font-size: 0.85rem; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .hx-promo-sub { font-size: 0.75rem; color: #6b7280; }
        .hx-promo-sep { width: 1px; height: 40px; background: #e9ecef; }

        /* ── Newsletter ── */
        .hx-newsletter {
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          border-radius: 16px; margin-top: 1.25rem;
          padding: 2rem 2.5rem;
          display: flex; align-items: center; gap: 2.5rem; flex-wrap: wrap;
        }
        .hx-nl-left { flex: 1; min-width: 220px; }
        .hx-nl-title { color: #fff; font-size: 1.05rem; font-weight: 800; margin-bottom: 0.4rem; }
        .hx-nl-sub { color: #bfdbfe; font-size: 0.82rem; line-height: 1.6; }
        .hx-nl-form { display: flex; gap: 0.5rem; min-width: 280px; flex: 1; }
        .hx-nl-inp {
          flex: 1; padding: 0.7rem 1rem; border-radius: 8px; border: none;
          font-size: 0.85rem; outline: none; background: rgba(255,255,255,0.15);
          color: #fff; backdrop-filter: blur(4px);
        }
        .hx-nl-inp::placeholder { color: rgba(255,255,255,0.55); }
        .hx-nl-inp:focus { background: rgba(255,255,255,0.22); }
        .hx-nl-btn {
          padding: 0.7rem 1.3rem; background: #fff; color: #1e3a5f;
          font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer;
          border-radius: 8px; transition: background .15s;
          white-space: nowrap;
        }
        .hx-nl-btn:hover { background: #eff6ff; }

        /* ── Error ── */
        .hx-err { text-align:center; padding:2.5rem 0; color:#dc2626; font-weight:500; }
        .hx-retry {
          display:inline-flex; align-items:center; gap:5px;
          background:none; border:none; color:#2563eb; font-weight:700; cursor:pointer; text-decoration:underline;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .hx-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 900px) {
          .hx-hero-main { grid-template-columns: 1fr; }
          .hx-banner-side { flex-direction: row; }
          .hx-banner-sm { height: 80px; }
          .hx-grid { grid-template-columns: repeat(3, 1fr); }
          .hx-hero { padding: 0.75rem 0.85rem 0; }
        }
        @media (max-width: 640px) {
          .hx-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); }
          .hx-wrap { padding: 0 0.75rem 3rem; }
          .hx-hero { padding: 0.5rem 0.75rem 0; }
          .hx-banner-main { height: 200px; }
          .hx-banner-h1 { font-size: 1.3rem; }
          .hx-banner-copy { padding: 1.25rem 1.5rem; }
          .hx-promo-sep { display: none; }
          .hx-newsletter { padding: 1.5rem; gap: 1.25rem; }
          .hx-nl-form { flex-direction: column; }
          .hx-ql-inner { gap: 0; justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
          .hx-ql-item { min-width: 68px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
