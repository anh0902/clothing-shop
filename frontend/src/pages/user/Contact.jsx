import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Mail, Phone, MapPin, Send, Loader, ArrowRight
} from 'lucide-react';

import '../../styles/design-system.css';
import './Contact.css';

// ── Validation ────────────────────────────────────────────────────────────────
const validators = {
  ho_ten: (v) => (v.trim().length >= 2 ? '' : 'Họ tên tối thiểu 2 ký tự'),
  so_dien_thoai: (v) =>
    /^(0|\+84)[0-9]{9}$/.test(v.trim()) ? '' : 'SĐT không hợp lệ',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Email không đúng định dạng',
  noi_dung: (v) => (v.trim().length >= 10 ? '' : 'Nội dung quá ngắn'),
};

const Contact = () => {
  const [form, setForm] = useState({ ho_ten: '', so_dien_thoai: '', email: '', noi_dung: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validateField = (name, value) => (validators[name] ? validators[name](value) : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    Object.keys(validators).forEach((k) => {
      const eMsg = validateField(k, form[k]);
      if (eMsg) errs[k] = eMsg;
    });
    setErrors(errs);
    
    if (Object.keys(errs).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSent(true);
    toast.success('Gửi thành công!');
    setForm({ ho_ten: '', so_dien_thoai: '', email: '', noi_dung: '' });
  };

  return (
    <div className="ds-page contact-auto-1">
      
      {/* ── Hero ── */}
      <section className="ctm-hero">
        <div className="ds-wrap">
          <h1 className="ctm-title">Liên hệ.</h1>
          <p className="ctm-subtitle">Hãy cho chúng tôi biết bạn cần hỗ trợ gì. Đội ngũ BookOne sẽ phản hồi trong 24 giờ làm việc.</p>
        </div>
      </section>

      <section className="ctm-body">
         <div className="ds-wrap ctm-layout">
           
           {/* ── Left Col: Details & Map ── */}
           <div className="ctm-info-col">
              <div className="ctm-info-list">
                 <div className="ctm-info-item">
                   <Phone size={18} />
                   <div>
                     <strong>Hotline (Miễn phí)</strong>
                     <p>1800 2345</p>
                   </div>
                 </div>
                 <div className="ctm-info-item">
                   <Mail size={18} />
                   <div>
                     <strong>Thư điện tử</strong>
                     <p>support@bookone.vn</p>
                   </div>
                 </div>
                 <div className="ctm-info-item">
                   <MapPin size={18} />
                   <div>
                     <strong>Văn phòng</strong>
                     <p>180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP. HCM</p>
                   </div>
                 </div>
              </div>

              <div className="ctm-map-box">
                <iframe
                  title="Bản đồ BookOne"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0280148993136!2d106.6870835!3d10.7340878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9a86a5b7e3%3A0x789c58c87c4b5cb2!2sC%C3%A1o%20L%E1%BB%97%2C%20Ch%C3%A1nh%20H%C6%B0ng%2C%20Qu%E1%BA%ADn%208%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  className="ctm-map-iframe contact-auto-2"
                />
              </div>
           </div>

           {/* ── Right Col: Form ── */}
           <div className="ctm-form-col">
              {sent ? (
                <div className="ctm-sent">
                  <h3 className="ctm-h3">Gửi thành công</h3>
                  <p className="ctm-p contact-auto-3">Cảm ơn bạn đã kết nối. Chúng tôi sẽ sớm phản hồi mail của bạn.</p>
                  <button className="ds-btn-outline contact-auto-4" onClick={() => setSent(false)}>
                    Tạo yêu cầu mới
                  </button>
                </div>
              ) : (
                <form className="ctm-form" onSubmit={handleSubmit}>
                  <h3 className="ctm-h3">Gửi tin nhắn</h3>
                  <p className="ctm-p">Điền thông tin vào mẫu dưới đây.</p>

                  <div className="ctm-field-group">
                    <div className="ctm-field">
                      <label>Họ & Tên</label>
                      <input 
                        type="text" 
                        value={form.ho_ten} 
                        onChange={(e) => setForm({...form, ho_ten: e.target.value})} 
                        className={errors.ho_ten ? 'error' : ''}
                      />
                      {errors.ho_ten && <span className="ctm-err">{errors.ho_ten}</span>}
                    </div>
                    <div className="ctm-field">
                      <label>Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={form.so_dien_thoai} 
                        onChange={(e) => setForm({...form, so_dien_thoai: e.target.value})} 
                        className={errors.so_dien_thoai ? 'error' : ''}
                      />
                      {errors.so_dien_thoai && <span className="ctm-err">{errors.so_dien_thoai}</span>}
                    </div>
                  </div>

                  <div className="ctm-field">
                    <label>Email liên hệ</label>
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => setForm({...form, email: e.target.value})} 
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="ctm-err">{errors.email}</span>}
                  </div>

                  <div className="ctm-field">
                     <label>Nội dung</label>
                     <textarea 
                        rows="4" 
                        value={form.noi_dung} 
                        onChange={(e) => setForm({...form, noi_dung: e.target.value})} 
                        className={errors.noi_dung ? 'error' : ''}
                      />
                      {errors.noi_dung && <span className="ctm-err">{errors.noi_dung}</span>}
                  </div>

                  <button className="ds-btn-primary contact-auto-5" type="submit" disabled={submitting}>
                    {submitting ? <Loader size={16} className="ds-spin" /> : <Send size={16} />}
                    Gửi yêu cầu
                  </button>
                </form>
              )}
           </div>

         </div>
      </section>
    </div>
  );
};

export default Contact;
