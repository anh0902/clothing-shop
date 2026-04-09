import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Loader, CheckCircle2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, login } = useAuth(); // Assuming login function updates auth context or we can refresh user
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    so_dien_thoai: '',
    dia_chi: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      // Set temporary data from context
      setFormData({
        ten_dang_nhap: user.ten_dang_nhap || '',
        so_dien_thoai: user.so_dien_thoai || '',
        dia_chi: user.dia_chi || '',
        email: user.email || '',
      });
      // Fetch fresh data
      userAPI.getProfile(user.id).then(res => {
        const freshUser = res.data?.data || res.data;
        if (freshUser) {
          setFormData({
            ten_dang_nhap: freshUser.ten_dang_nhap || '',
            so_dien_thoai: freshUser.so_dien_thoai || '',
            dia_chi: freshUser.dia_chi || '',
            email: freshUser.email || '',
          });
        }
      }).catch(err => console.log('Có lỗi khi lấy fresh profile', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Send only fields that are editable based on backend requirements
      // Mat khau is not sent here
      const res = await userAPI.updateProfile(user.id, {
        ten_dang_nhap: formData.ten_dang_nhap,
        so_dien_thoai: formData.so_dien_thoai,
        dia_chi: formData.dia_chi
      });
      toast.success('Đã cập nhật thông tin thành công!');
      
      // Attempt to update local context if API returns new user data
      if (res.data?.data) {
         // Keep old access token, update user object
         const token = localStorage.getItem('access_token');
         if (token) login(res.data.data, token); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usr-root-premium ds-page">
      <div className="usr-container">
        <div className="ds-card profile-card-premium shadow-2xl">
          {/* Header Section with Avatar */}
          <div className="profile-header-premium">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {formData.ten_dang_nhap ? formData.ten_dang_nhap.charAt(0).toUpperCase() : <User size={32} />}
              </div>
              
            </div>
            <h1 className="profile-name-premium">{formData.ten_dang_nhap || 'Người dùng'}</h1>
            <p className="profile-email-premium">{formData.email}</p>
          </div>

          <div className="profile-body-premium">
            <form onSubmit={handleSubmit} className="profile-form-compact">
              <div className="profile-grid">
                {/* Tên đăng nhập */}
                <div className="ds-field-compact">
                  <label className="ds-label-compact">
                    <User size={14} className="label-icon" /> Tên hiển thị
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="text"
                      className="ds-input-refined"
                      value={formData.ten_dang_nhap}
                      onChange={(e) => setFormData({...formData, ten_dang_nhap: e.target.value})}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="ds-field-compact">
                  <label className="ds-label-compact">
                    <Phone size={14} className="label-icon" /> Số điện thoại
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="tel"
                      className="ds-input-refined"
                      value={formData.so_dien_thoai}
                      onChange={(e) => setFormData({...formData, so_dien_thoai: e.target.value})}
                      placeholder="0901 234 567"
                      required
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div className="ds-field-compact field-full">
                  <label className="ds-label-compact">
                    <Mail size={14} className="label-icon" /> Địa chỉ Email
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="email"
                      className="ds-input-refined input-disabled"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="ds-field-compact field-full">
                  <label className="ds-label-compact">
                    <MapPin size={14} className="label-icon" /> Địa chỉ giao hàng
                  </label>
                  <div className="ds-input-wrap">
                    <textarea
                      className="ds-input-refined area-refined"
                      rows={2}
                      value={formData.dia_chi}
                      onChange={(e) => setFormData({...formData, dia_chi: e.target.value})}
                      placeholder="Số nhà, tên đường, phường/xã..."
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="ds-btn-primary ds-btn-pill premium-btn-full"
                disabled={loading}
              >
                {loading ? <Loader size={18} className="ds-spin" /> : <>Lưu thay đổi</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
