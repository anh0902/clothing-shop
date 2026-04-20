import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { orderAPI } from '../../services/userService';
import {
  User, Phone, MapPin, MessageSquare, CreditCard, Truck,
  CheckCircle2, ShoppingCart, Loader, AlertCircle
} from 'lucide-react';
import { getImageUrl } from '../../utils';
import '../../styles/design-system.css';
import './Checkout.css';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

const validators = {
  ten_nguoi_nhan: (v) => v.trim().length >= 2 ? '' : 'Họ tên tối thiểu 2 ký tự',
  sdt_nguoi_nhan: (v) => /^(0|\+84)[0-9]{9}$/.test(v.trim()) ? '' : 'SĐT không hợp lệ',
  dia_chi_giao_hang: (v) => v.trim().length >= 5 ? '' : 'Địa chỉ quá ngắn',
};

const Field = ({ ico: Ico, id, label, type='text', rows, form, errors, touched, onChange, onBlur }) => {
  const err = touched[id] && errors[id];
  const ok  = touched[id] && !errors[id];
  return (
    <div className="ds-field">
      <label className="ds-label" htmlFor={id}>{label}</label>
      <div className="ds-input-wrap" style={{ alignItems: rows ? 'flex-start' : 'center' }}>
        <Ico size={15} className="ds-input-ico" style={rows ? { top: '14px' } : {}} />
        {rows ? (
          <textarea
            className={`ds-input${err ? ' has-error' : ok ? ' is-valid' : ''} checkout-auto-1`}
            rows={rows} placeholder={`Nhập ${label.toLowerCase()}...`}
            value={form[id]} onChange={e => onChange(id, e.target.value)} onBlur={() => onBlur(id)}
          />
        ) : (
           <input
             id={id} type={type} className={`ds-input${err ? ' has-error' : ok ? ' is-valid' : ''}`}
             placeholder={`Nhập ${label.toLowerCase()}...`}
             value={form[id]} onChange={e => onChange(id, e.target.value)} onBlur={() => onBlur(id)}
           />
        )}
        {ok && !rows && <CheckCircle2 size={15} color="#059669" className="checkout-auto-2" />}
      </div>
      {err && <div className="ds-field-error"><AlertCircle size={11} /> {err}</div>}
    </div>
  );
};

const Checkout = () => {
  const { user, login: authLogin, loading: authLoading } = useAuth();
  const { cartItems, loadingCart, fetchCart } = useCart();
  const navigate      = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [payMethod,  setPayMethod]   = useState('ONLINE');
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});

  const [form, setForm] = useState({
    ten_nguoi_nhan: '',
    sdt_nguoi_nhan: '',
    dia_chi_giao_hang: '',
    ghi_chu: '',
  });

  // Sync with user data when loaded
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        ten_nguoi_nhan: user.ten_dang_nhap || '',
        sdt_nguoi_nhan: user.so_dien_thoai || '',
        dia_chi_giao_hang: user.dia_chi || '',
      }));
    }
  }, [user]);

  // ... (các hàm validate giữ nguyên)
  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach(k => {
      const err = validators[k](form[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    setTouched({ ten_nguoi_nhan: true, sdt_nguoi_nhan: true, dia_chi_giao_hang: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (id, val) => setForm(prev => ({ ...prev, [id]: val }));
  const handleBlur = (id) => setTouched(prev => ({ ...prev, [id]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) { toast.error('Vui lòng kiểm tra lại thông tin'); return; }
    if (!cartItems || cartItems.length === 0) { toast.error('Giỏ hàng trống'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ho_ten: form.ten_nguoi_nhan,
        so_dien_thoai: form.sdt_nguoi_nhan,
        dia_chi: form.dia_chi_giao_hang,
        ghi_chu: form.ghi_chu,
        phuong_thuc_thanh_toan: payMethod === 'ONLINE' ? 'transfer' : 'cod'
      };

      const res = await orderAPI.checkout(payload);
      if (res && res.success) {
        // TỰ ĐỘNG CẬP NHẬT THÔNG TIN HỒ SƠ NẾU CÓ THAY ĐỔI
        try {
          const resSync = await userAPI.updateProfile(user.id, {
            ten_dang_nhap: form.ten_nguoi_nhan,
            so_dien_thoai: form.sdt_nguoi_nhan,
            dia_chi:       form.dia_chi_giao_hang
          });

          // SYNC AUTH CONTEXT ĐỂ CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC
          if (resSync && resSync.data) {
            const token = localStorage.getItem('token');
            if (token) authLogin(resSync.data, token);
          }
        } catch (err) {
          console.error('Không thể tự động cập nhật hồ sơ:', err);
        }

        await fetchCart();
        toast.success(res.message || 'Đặt hàng thành công!');
        navigate('/confirm', { state: { orderId: res.don_hang_id } });
      } else {
        toast.error(res?.message || 'Có lỗi khi xử lý đơn hàng');
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi khi đặt hàng');
    } finally { setSubmitting(false); }
  };

  const total = (cartItems || []).reduce((s, i) => s + parseFloat(i.thanh_tien || 0), 0);



  return (
    <div className="ds-page">
      <div className="ds-wrap checkout-container">
        <div className="ds-page-hd">
          <h1 className="ds-page-title"><ShoppingCart size={22} /> Thanh toán</h1>
        </div>

        <form onSubmit={handleSubmit} id="ck-form" noValidate className="ck-layout">
          {/* LEFT COL */}
          <div className="ck-col-main">
            {/* Delivery Info */}
            <div className="ds-card checkout-auto-3">
              <h2 className="ds-card-title"><MapPin size={16} /> Thông tin giao hàng</h2>
              <div className="ck-card-bd">
                <div className="ck-field-grid">
                  <Field id="ten_nguoi_nhan" label="Họ và tên người nhận" ico={User} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                  <Field id="sdt_nguoi_nhan" label="Số điện thoại"        ico={Phone} type="tel" form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                </div>
                <Field id="dia_chi_giao_hang" label="Địa chỉ giao hàng" ico={MapPin} rows={3} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                <Field id="ghi_chu"         label="Ghi chú đơn hàng"    ico={MessageSquare} rows={2} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="ds-card">
              <h2 className="ds-card-title"><CreditCard size={16} /> Phương thức thanh toán</h2>
              <div className="ck-pay-bd">
                <label className={`ck-pay-opt${payMethod === 'ONLINE' ? ' active' : ''}`}>
                  <input
                    type="radio" name="pay" checked={payMethod === 'ONLINE'}
                    onChange={() => setPayMethod('ONLINE')} className="ck-pay-radio"
                  />
                  <span className="ck-pay-emoji">🏦</span>
                  <div className="ck-pay-txt">
                    <strong>Chuyển khoản / QR Code</strong>
                    <span>Quét mã thanh toán nhanh chóng</span>
                  </div>
                  {payMethod === 'ONLINE' && <CheckCircle2 size={18} color="#059669" className="ck-pay-chk" />}
                </label>

                <label className={`ck-pay-opt${payMethod === 'COD' ? ' active' : ''}`}>
                  <input
                    type="radio" name="pay" checked={payMethod === 'COD'}
                    onChange={() => setPayMethod('COD')} className="ck-pay-radio"
                  />
                  <span className="ck-pay-emoji">🚚</span>
                  <div className="ck-pay-txt">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Trả tiền mặt cho shipper</span>
                  </div>
                  {payMethod === 'COD' && <CheckCircle2 size={18} color="#059669" className="ck-pay-chk" />}
                </label>

                {/* QR Code box */}
                {payMethod === 'ONLINE' && (
                  <div className="ck-qr-box">
                    <p className="ck-qr-hdr">Mã QR Thanh Toán</p>
                    <img
                      src={`https://img.vietqr.io/image/MB-0948342040-compact2.jpg?amount=${Math.round(total)}&addInfo=Thanh+toan+BookOne&accountName=VO+THAI+ANH`}
                      alt="QR" className="ck-qr-img" onError={e => e.target.style.display = 'none'}
                    />
                    <div className="ck-qr-details">
                      <div className="ck-qr-row"><span>Ngân hàng</span><strong>MB Bank</strong></div>
                      <div className="ck-qr-row"><span>Số tài khoản</span><strong>0948342040</strong></div>
                      <div className="ck-qr-row"><span>Chủ tài khoản</span><strong>VO THAI ANH</strong></div>
                      <div className="ck-qr-row"><span>Số tiền</span><strong className="checkout-auto-4">{fmt(total)}</strong></div>
                      <div className="ck-qr-row"><span>Nội dung</span><strong>Thanh toan BookOne</strong></div>
                    </div>
                  </div>
                )}
                {/* COD note */}
                {payMethod === 'COD' && (
                  <div className="ck-cod-box">
                    <Truck size={17} color="#2563eb" />
                    <span>Bạn sẽ thanh toán <strong>{fmt(total)}</strong> khi nhận hàng. Giao hàng từ 2-5 ngày làm việc.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COL (Summary) */}
          <div className="ck-col-side">
            <div className="ck-summary-card">
              <h2 className="ds-card-title">Tóm tắt đơn hàng</h2>
              <div className="ck-card-bd">
                {loadingCart ? (
                  <Loader size={24} className="ds-spin checkout-auto-6" />
                ) : (
                  <div className="ck-sum-list">
                    {cartItems.map(it => (
                      <div key={it.sach_id} className="ck-sum-item">
                        <img src={getImageUrl(it.sach?.anh_bia)} alt="cover" className="ck-sum-img"/>
                        <div className="ck-sum-info">
                          <span className="ck-sum-name">{it.sach?.ten_sach}</span>
                          <span className="ck-sum-qty">Số lượng: {it.so_luong}</span>
                        </div>
                        <span className="ck-sum-price">{fmt(it.thanh_tien)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ck-sum-line" />

                <div className="ck-sum-totals">
                  <div className="ck-sum-tr"><span>Tạm tính</span><span>{fmt(total)}</span></div>
                  <div className="ck-sum-tr"><span>Phí giao hàng</span><span className="checkout-auto-7">Miễn phí</span></div>
                  <div className="ck-sum-tr ck-sum-grand"><span>Tổng cộng</span><span>{fmt(total)}</span></div>
                </div>

                <button type="submit" className="ds-btn-primary" disabled={submitting || loadingCart}>
                  {submitting
                    ? <><Loader size={17} className="ds-spin" /> Đang thiết lập...</>
                    : 'Xác nhận đặt hàng'
                  }
                </button>
                <Link to="/cart" className="ck-back">Quay lại giỏ hàng</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
