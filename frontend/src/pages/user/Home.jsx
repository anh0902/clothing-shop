import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { bookAPI, categoryAPI } from '../../services/userService';
import {
  BookOpen, GraduationCap, Heart, Rocket, Globe, PenTool,
  TrendingUp, Layers, ChevronRight, RefreshCw, ChevronLeft,
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import SkeletonCard from '../../components/SkeletonCard';
import { getImageUrl } from '../../utils';

// ── Hero banner import ──
import heroBanner from '../../assets/banner/anhnen.jpg';

/* ─────────────────────────────────────────── helpers ── */
const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

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
  <div className="hx-grid">
    {loading
      ? [...Array(count)].map((_, i) => <SkeletonCard key={i} />)
      : (books || []).slice(0, count).map(b => <ProductCard key={b.id} sach={b} />)
    }
  </div>
);

/* ─────────────────────────────────────────── lazy cat section ── */
const CatSection = ({ catId, count = 5 }) => {
  const [books, setBooks]   = useState([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => {
    if (!catId) return;
    bookAPI.getFiltered({ loai_sach_id: catId, size: count })
      .then(r => setBooks(r.success ? (r.data?.data || []) : []))
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
  const [spotCats, setSpotCats]       = useState([]);   
  const [loadingNew,  setLoadNew]     = useState(true);
  const [loadingFilt, setLoadFilt]    = useState(false);
  const [error, setError]             = useState(false);
  const [email, setEmail]             = useState('');

  /* ── fetch categories ── */
  const fetchCats = useCallback(async () => {
    try {
      const res  = await categoryAPI.getAll();
      if (res.success) {
        const cats = res.data || [];
        setCats(cats);
        setSpotCats(cats.slice(0, 3));
      }
    } catch { /* silent */ }
  }, []);

  /* ── fetch newest books ── */
  const fetchNew = useCallback(async () => {
    setLoadNew(true); setError(false);
    try {
      const res = await bookAPI.getAll({ size: 10 });
      if (res.success) {
        setNewBooks(res.data?.data || []);
      } else {
        setError(true);
      }
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
      const res = await bookAPI.getFiltered(params);
      if (res.success) {
        setFiltBooks(res.data?.data || []);
      } else {
        setFiltBooks([]);
      }
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
        <div className="hx-hero-main single-banner">
          {/* Main banner — Single Static with Motion */}
          <div className="hx-banner-main full-width overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              src={heroBanner} 
              alt="Hero Banner" 
              className="hx-slide-img active static" 
              referrerPolicy="no-referrer"
            />
            {/* Overlay copy */}
            <div className="hx-banner-copy">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="hx-banner-tag">PHONG CÁCH & TRI THỨC</p>
                <h1 className="hx-banner-h1">
                  Nâng tầm bản thân <br/>
                  <span className="hx-accent-text">Mỗi ngày một cuốn sách</span>
                </h1>
                <p className="hx-banner-desc">
                  Cùng chúng tôi khai phá những giới hạn mới của tư duy thông qua <br/> 
                  hàng ngàn đầu sách chọn lọc chất lượng cao.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hx-banner-cta" 
                  onClick={() => navigate('/category')}
                >
                  Mua sắm ngay
                </motion.button>
              </motion.div>
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
          {(categories || []).map(c => (
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
        {!activeCat && (spotCats || []).map((cat) => (
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
