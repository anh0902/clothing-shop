import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosUser } from '../axiosClient';
import {
  BookOpen, GraduationCap, Heart, Rocket, Globe, PenTool,
  TrendingUp, Layers, ChevronRight, RefreshCw, ChevronLeft,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { getImageUrl } from '../utils/urlHelper';

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

// Map dữ liệu từ Laravel (snake_case)
const mapSach = (s) => ({
  id: s.id,
  ten_sach: s.ten_sach || s.tenSach,
  tac_gia: s.tac_gia || s.tacGia,
  nha_xuat_ban: s.nha_xuat_ban || s.nhaXuatBan,
  gia: s.gia,
  so_luong: s.so_luong || s.soLuong,
  mo_ta: s.mo_ta || s.moTa,
  anh_bia: getImageUrl(s.anh_bia || s.anhBia),
  loai_sach_id: s.loai_sach_id || s.loaiSachId,
  trang_thai: s.trang_thai || s.trangThai
});

const mapLoai = (l) => ({
  id: l.id,
  ten_loai: l.ten_loai || l.tenLoai
});

const extractList = (res) => {
  // Cấu trúc phân trang Laravel: res.data.data.data
  const data = res.data?.data?.data || res.data?.data || res.data?.content || [];
  return Array.isArray(data) ? data : [];
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

const BookRow = ({ books, loading, count = 5 }) => (
  <div className="hx-scroll-wrap">
    <div className="hx-grid">
      {loading
        ? [...Array(count)].map((_, i) => <SkeletonCard key={i} />)
        : books.slice(0, count).map(b => <ProductCard key={b.id} sach={mapSach(b)} />)
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
    axiosUser.get('/sach/filter', { params: { loai_sach_id: catId, size: count } })
      .then(r => setBooks(extractList(r)))
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [catId, count]);
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
      const res  = await axiosUser.get('/loaisach');
      const cats = (res.data?.data || res.data || []).map(mapLoai);
      setCats(cats);
      // pick first 3 categories for spotlight sections
      setSpotCats(cats.slice(0, 3));
    } catch { /* silent */ }
  }, []);

  /* ── fetch newest books ── */
  const fetchNew = useCallback(async () => {
    setLoadNew(true); setError(false);
    try {
      // Storefront gọi sang Laravel (axiosUser)
      const res = await axiosUser.get('/sach', { params: { size: 10 } });
      setNewBooks(extractList(res));
    } catch (err) {
      console.error('Home: fetchNew error:', err);
      setError(true);
    } finally {
      setLoadNew(false);
    }
  }, []);

  /* ── filter by category PILL ── */
  const filterByCat = useCallback(async (catId) => {
    setLoadFilt(true);
    try {
      const params = catId ? { loai_sach_id: catId, size: 10 } : { size: 10 };
      const res = await axiosUser.get('/sach/filter', { params });
      setFiltBooks(extractList(res));
    } catch (err) {
      console.error('Home: filterByCat error:', err);
      setFiltBooks([]);
    } finally {
      setLoadFilt(false);
    }
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
    </div>
  );
};

export default Home;
