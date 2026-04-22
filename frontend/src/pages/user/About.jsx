import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Truck, Sparkles, PhoneCall,
  History, Target, Users, ChevronRight, BookOpen
} from 'lucide-react';
import '../../styles/design-system.css';
import './About.css';

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10.000+', label: 'Tựa sách phong phú', desc: 'Cập nhật hàng ngày từ các NXB uy tín.' },
  { value: '50.000+', label: 'Khách hàng hài lòng', desc: 'Đồng hành cùng hành trình tri thức.' },
  { value: '100%',    label: 'Cam kết Bản quyền', desc: 'Từ chối sách lậu, sách giả.' },
];

const REASONS = [
  {
    icon: <ShieldCheck size={24} strokeWidth={1.5} />,
    title: 'Chất Lượng Kỹ Lưỡng',
    desc: 'Mỗi cuốn sách trước khi đến tay bạn đều trải qua quy trình kiểm tra chất lượng đa lớp, đảm bảo sự nguyên vẹn.',
  },
  {
    icon: <Truck size={24} strokeWidth={1.5} />,
    title: 'Giao Hàng Tối Ưu',
    desc: 'Mạng lưới logistics mở rộng, hỗ trợ giao sách trong 48h tại các thành phố lớn.',
  },
  {
    icon: <Sparkles size={24} strokeWidth={1.5} />,
    title: 'Trải Nghiệm Mua Sắm',
    desc: 'Giao diện trực quan, không quảng cáo, tối giản nhất để bạn dốc toàn tâm trí vào việc chọn sách.',
  },
  {
    icon: <PhoneCall size={24} strokeWidth={1.5} />,
    title: 'Hỗ Trợ Tận Tâm',
    desc: 'Luôn có nhân viên đọc sách thực thụ giải đáp và tư vấn đầu sách hợp gu bạn nhất.',
  },
];

// ── Component ────────────────────────────────────────────────────────────────
const About = () => {
  return (
    <div className="ds-page about-auto-1">
      {/* ── Hero Minimalist ── */}
      <section className="abm-hero">
        <div className="ds-wrap abm-hero-inner">
          <BookOpen size={40} className="abm-logo-mark" strokeWidth={1} />
          <h1 className="abm-title">Về BookOne.</h1>
          <p className="abm-subtitle">
            Chúng tôi không chỉ bán những trang giấy. <br />
            Chúng tôi trao gửi những góc nhìn, tri thức và sự thấu cảm.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="abm-stats">
        <div className="ds-wrap">
          <div className="abm-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="abm-stat-box">
                <div className="abm-sv">{s.value}</div>
                <div className="abm-sl">{s.label}</div>
                <p className="abm-sd">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hành trình ── */}
      <section className="abm-story">
        <div className="ds-wrap">
          <div className="abm-two-col">
            <div className="abm-col-left">
              <span className="abm-eyebrow"><History size={15}/> Khởi nguồn</span>
              <h2 className="abm-h2">Một cửa hàng nhỏ, <br/> Giấc mơ lớn.</h2>
            </div>
            <div className="abm-col-right">
              <p className="abm-p">
                Bắt đầu từ năm 2019 trong một không gian chỉ vỏn vẹn 20m², BookOne ra đời từ nỗi trăn trở về việc tiếp cận những đầu sách bản quyền, chất lượng tại Việt Nam theo một cách thân thiện và minh bạch nhất.
              </p>
              <p className="abm-p">
                Trải qua những năm tháng chuyển mình, chúng tôi đã rũ bỏ những rườm rà của thương mại điện tử công nghiệp, giữ lại điều cốt lõi: <strong>Trải nghiệm đọc tinh tế</strong> ngay từ cú click chuột đầu tiên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tại sao chọn ── */}
      <section className="abm-reasons">
        <div className="ds-wrap">
          <div className="abm-reasons-hd">
            <span className="abm-eyebrow about-auto-2"><Target size={15}/> Tiêu chuẩn</span>
            <h2 className="abm-h2 about-auto-3">Sự khác biệt của chúng tôi</h2>
          </div>
          <div className="abm-reasons-grid">
            {REASONS.map((r, i) => (
              <div key={i} className="abm-reason-card ds-card">
                <div className="abm-reason-icon">{r.icon}</div>
                <h3 className="abm-reason-title">{r.title}</h3>
                <p className="abm-p about-auto-4">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Đội ngũ ── */}
      <section className="abm-team">
         <div className="ds-wrap about-auto-5">
            <span className="abm-eyebrow about-auto-6"><Users size={15}/> Con người</span>
            <h2 className="abm-h2">Những "Mọt Sách" Điều Hành</h2>
            <div className="abm-team-list">
              <div className="abm-team-item">
                <div className="abm-avatar">A</div>
                <strong>Nguyễn A</strong>
                <span>Sáng lập</span>
              </div>
              <div className="abm-team-item">
                <div className="abm-avatar">B</div>
                <strong>Trần B</strong>
                <span>Giám tuyển Sách</span>
              </div>
              <div className="abm-team-item">
                <div className="abm-avatar">C</div>
                <strong>Lê C</strong>
                <span>Dịch vụ Khách hàng</span>
              </div>
            </div>
         </div>
      </section>

      {/* ── CTA ── */}
      <section className="abm-cta">
        <div className="ds-wrap">
          <div className="abm-cta-box ds-card">
            <h2 className="abm-h2 about-auto-7">Cùng lật mở trang mới</h2>
            <p className="abm-p about-auto-8">
              Hãy để chúng tôi đồng hành cùng không gian tri thức của bạn.
            </p>
            <div className="abm-cta-btns">
               <Link to="/category" className="ds-btn-primary about-auto-9">Khám phá cửa hàng</Link>
               <Link to="/contact" className="ds-btn-outline about-auto-10">Trò chuyện</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
