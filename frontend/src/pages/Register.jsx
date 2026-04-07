import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, BookOpen, Loader } from 'lucide-react';
import '../styles/design-system.css';

// ── CRITICAL FIX: Field định nghĩa NGOÀI Register để React không unmount/remount
// khi state thay đổi, gây mất focus sau mỗi lần gõ phím.
const Field = ({ ico: Ico, id, label, type = 'text', name, placeholder,
                 autoComplete, required, minLength,
                 showToggle, shown, onToggle,
                 value, onChange }) => (
  <div className="ds-field-compact">
    <label className="ds-label-compact" htmlFor={id}>{label}</label>
    <div className="ds-input-wrap">
      <Ico size={14} className="ds-input-ico" />
      <input
        id={id}
        type={showToggle ? (shown ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`ds-input-refined${showToggle ? ' ds-input-pass' : ''}`}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
      />
      {showToggle && (
        <button type="button" className="auth-eye-compact" onClick={onToggle} tabIndex={-1}>
          {shown ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: '',
    mat_khau_confirmation: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const navigate = useNavigate();

  // Dùng functional update để tránh stale closure
  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mat_khau !== formData.mat_khau_confirmation) {
      toast.error('Mật khẩu xác nhận không khớp!'); return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.post('/register', formData);
      toast.success(res.data.message || 'Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors)
        toast.error(Object.values(err.response.data.errors)[0][0]);
      else
        toast.error('Đăng ký thất bại, vui lòng thử lại.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root ds-page">
      <div className="auth-center">
        <div className="ds-card auth-card-premium auth-card-wide">
          <div className="auth-header-compact">
            <div className="auth-logo-box-small">
              <BookOpen size={20} />
            </div>
            <h1 className="auth-title-compact">Đăng ký tài khoản</h1>
            <p className="auth-subtitle-compact">Tham gia cùng chúng tôi để nhận ưu đãi tốt nhất.</p>
          </div>

          <div className="auth-body-compact">
            <form onSubmit={handleSubmit} id="register-form" className="auth-form-compact">
              <div className="auth-grid-compact">
                <Field ico={User}   id="reg-username" label="Tên đăng nhập"     name="ten_dang_nhap"         placeholder="Tên của bạn"         required
                  value={formData.ten_dang_nhap}         onChange={handleChange} />
                <Field ico={Mail}   id="reg-email"    label="Địa chỉ Email"     name="email"                 placeholder="example@gmail.com"   type="email" autoComplete="email" required
                  value={formData.email}                 onChange={handleChange} />
                <Field ico={Phone}  id="reg-phone"    label="Số điện thoại"     name="so_dien_thoai"         placeholder="0901 234 567"         type="tel" autoComplete="tel" required
                  value={formData.so_dien_thoai}         onChange={handleChange} />
                <Field ico={MapPin} id="reg-address"  label="Địa chỉ giao hàng" name="dia_chi"               placeholder="Số nhà, tên đường..."  required
                  value={formData.dia_chi}               onChange={handleChange} />
                <Field ico={Lock}   id="reg-pass"     label="Mật khẩu"          name="mat_khau"              placeholder="Tối thiểu 6 ký tự"   required minLength={6}
                  showToggle shown={showPass} onToggle={() => setShowPass(p => !p)}
                  value={formData.mat_khau}              onChange={handleChange} />
                <Field ico={Lock}   id="reg-confirm"  label="Xác nhận mật khẩu" name="mat_khau_confirmation" placeholder="Lặp lại mật khẩu"    required
                  showToggle shown={showConfirm} onToggle={() => setShowConfirm(p => !p)}
                  value={formData.mat_khau_confirmation} onChange={handleChange} />
              </div>

              <button type="submit" className="ds-btn-primary premium-btn" disabled={loading} id="register-submit">
                {loading ? <><Loader size={16} className="ds-spin" /> Đang xử lý...</> : 'Đăng ký ngay'}
              </button>
            </form>

            <div className="auth-footer-compact">
              <p className="auth-switch-text">
                Đã có tài khoản?{' '}
                <Link to="/login" className="auth-switch-link" id="go-login">Đăng nhập</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        }
        .auth-center { width: 100%; max-width: 640px; padding: 1.5rem; }
        .auth-card-premium {
          background: rgba(255,255,255,0.97); backdrop-filter: blur(10px);
          border-radius: 24px; border: 1px solid #e2e8f0;
          padding: 2.5rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
        }
        .auth-header-compact { text-align: center; margin-bottom: 1.75rem; }
        .auth-logo-box-small {
          width: 44px; height: 44px; background: #1e3a5f; color: #fff;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }
        .auth-title-compact { font-size: 1.5rem; font-weight: 800; color: #1e3a5f; margin-bottom: 0.25rem; }
        .auth-subtitle-compact { color: #64748b; font-size: 0.9rem; }

        .auth-form-compact { display: flex; flex-direction: column; gap: 1rem; }
        .auth-grid-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }

        .ds-field-compact { display: flex; flex-direction: column; gap: 0.35rem; }
        .ds-label-compact { font-size: 0.8125rem; font-weight: 600; color: #334155; }

        .ds-input-refined {
          width: 100%; border-radius: 10px; background: #fff;
          border: 1.5px solid #e2e8f0;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          font-size: 0.9375rem; font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ds-input-refined:focus { border-color: #1e3a5f; box-shadow: 0 0 0 3px rgba(30,58,95,0.08); outline: none; }
        .ds-input-pass { padding-right: 2.5rem; }

        .ds-input-ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .auth-eye-compact {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; background: none; border: none; cursor: pointer; padding: 0;
        }

        .premium-btn { margin-top: 0.5rem; padding: 0.8rem; font-weight: 700; }

        .auth-footer-compact { margin-top: 1.5rem; text-align: center; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
        .auth-switch-text { font-size: 0.8125rem; color: #64748b; }
        .auth-switch-link { color: #1e3a5f; font-weight: 700; text-decoration: none; }
        .auth-switch-link:hover { text-decoration: underline; }

        @media (max-width: 600px) {
          .auth-grid-compact { grid-template-columns: 1fr; }
          .auth-card-premium { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Register;