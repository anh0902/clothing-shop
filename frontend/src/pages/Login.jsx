import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, BookOpen, Loader } from 'lucide-react';
import '../styles/design-system.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', mat_khau: '' });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.mat_khau) {
      toast.error('Vui lòng nhập đầy đủ thông tin'); return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.post('/login', formData);
      if (!res.data.success) { toast.error(res.data.message || 'Đăng nhập thất bại'); return; }
      login(res.data.user, res.data.access_token);
      toast.success('Đăng nhập thành công! Chào mừng trở lại!');
      
      // Chuyển hướng theo vai trò (role)
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.data?.errors)
        toast.error(Object.values(err.response.data.errors)[0][0]);
      else
        toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root ds-page">
      <div className="auth-center">
        <div className="ds-card auth-card-premium shadow-2xl">
          {/* Logo Section */}
          <div className="auth-header-compact">
            <div className="auth-logo-box-small">
              <BookOpen size={20} className="auth-logo-icon" />
            </div>
            <h1 className="auth-title-compact">Đăng nhập</h1>
            <p className="auth-subtitle-compact">Chào mừng bạn trở lại!</p>
          </div>

          <div className="auth-body-compact">
            <form onSubmit={handleSubmit} id="login-form" className="auth-form-compact">
              {/* Email */}
              <div className="ds-field-compact">
                <label className="ds-label-compact" htmlFor="login-email">Email</label>
                <div className="ds-input-wrap">
                  <Mail size={14} className="ds-input-ico" />
                  <input
                    id="login-email" type="email" name="email"
                    placeholder="example@gmail.com"
                    value={formData.email} onChange={handleChange}
                    className="ds-input-refined" autoComplete="email" required
                  />
                </div>
              </div>
              {/* Password */}
              <div className="ds-field-compact">
                <div className="auth-label-row">
                  <label className="ds-label-compact" htmlFor="login-password">Mật khẩu</label>
                  <a href="#" className="auth-forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="ds-input-wrap">
                  <Lock size={14} className="ds-input-ico" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    name="mat_khau" placeholder="Mật khẩu của bạn"
                    value={formData.mat_khau} onChange={handleChange}
                    className="ds-input-refined ds-input-pass"
                    autoComplete="current-password" required
                  />
                  <button type="button" className="auth-eye-compact"
                    onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="ds-btn-primary ds-btn-pill premium-btn" disabled={loading} id="login-submit">
                {loading
                  ? <><Loader size={16} className="ds-spin" /> Đang xử lý...</>
                  : 'Đăng nhập ngay'
                }
              </button>
            </form>

            <div className="auth-footer-compact">
              <p className="auth-switch-text">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="auth-switch-link" id="go-register">Đăng ký</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;