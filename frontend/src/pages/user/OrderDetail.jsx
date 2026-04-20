import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/userService';
import { Package, ArrowLeft, XCircle, CheckCircle2, Clock, Loader, MapPin, Truck, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/design-system.css';
import './OrderDetail.css';

const fmt     = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'CHỜ_XÁC_NHẬN': case 'CHỜ_LẤY_HÀNG':
      return <span className="ds-badge ds-badge-wait"><Clock size={11} /> Chờ xử lý</span>;
    case 'ĐANG_GIAO_HÀNG':
      return <span className="ds-badge ds-badge-info"><Package size={11} /> Đang giao</span>;
    case 'ĐÃ_GIAO_HÀNG':
      return <span className="ds-badge ds-badge-success"><CheckCircle2 size={11} /> Đã giao</span>;
    case 'ĐÃ_HỦY': case 'HỦY':
      return <span className="ds-badge ds-badge-danger"><XCircle size={11} /> Đã hủy</span>;
    default:
      return <span className="ds-badge ds-badge-wait">{status}</span>;
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoad } = useAuth();
  const navigate = useNavigate();

  const [order,     setOrder]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error,     setError]     = useState(false);

  useEffect(() => {
    if (authLoad) return;
    if (!user) { navigate('/login'); return; }
    orderAPI.getOrderDetail(id)
      .then(res => {
        // Laravel show() returns the raw order object with its relations
        setOrder(res);
      })
      .catch(() => { setError(true); toast.error('Không tìm thấy đơn hàng'); })
      .finally(() => setLoading(false));
  }, [id, user, authLoad, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setCanceling(true);
    try {
      await orderAPI.cancelOrder(id);
      toast.success('Hủy đơn hàng thành công');
      setOrder(p => ({ ...p, trang_thai: 'ĐÃ_HỦY' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy lúc này');
    } finally { setCanceling(false); }
  };

  if (loading) return (
    <div className="ds-page orderdetail-auto-1">
      <Loader size={38} className="ds-spin orderdetail-auto-2" />
    </div>
  );
  if (error || !order) return (
    <div className="ds-page">
      <div className="ds-wrap orderdetail-auto-3">
        <AlertCircle size={52} color="#dc2626" className="orderdetail-auto-4" />
        <h2 className="orderdetail-auto-5">Không tìm thấy đơn hàng</h2>
        <Link to="/orders" className="ds-btn-outline orderdetail-auto-6">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>
    </div>
  );

  const items     = order.chitietdonhangs || order.chi_tiet_don_hangs || order.chitietdonhang || [];
  const canCancel = order.trang_thai === 'CHỜ_XÁC_NHẬN';

  return (
    <div className="ds-page">
      <div className="ds-wrap">

        {/* Back Link */}
        <Link to="/orders" className="od-back">
          <ArrowLeft size={15} /> Quay lại danh sách đơn hàng
        </Link>

        {/* Header */}
        <div className="od-hd">
          <h1 className="od-title">Chi tiết đơn hàng #{order.id}</h1>
          <StatusBadge status={order.trang_thai} />
        </div>

        <div className="od-layout">
          {/* Main Col */}
          <div className="od-col-main">
            {/* Products */}
            <div className="ds-card orderdetail-auto-7">
              <h2 className="ds-card-title"><Package size={16} /> Sản phẩm đã đặt</h2>
              <div className="od-items">
                {items.length === 0 && <p className="od-empty-text">Không có sản phẩm nào.</p>}
                {items.map((it, idx) => (
                  <div key={it.id || it.sach_id} className={`od-item${idx < items.length - 1 ? ' sep' : ''}`}>
                    <img src={it.sach?.anh_bia || 'https://picsum.photos/seed/b/50/70'} alt="cover" className="od-img" />
                    <div className="od-meta">
                      <Link to={`/product/${it.sach_id}`} className="od-name">{it.sach?.ten_sach || `Sách #${it.sach_id}`}</Link>
                      <span className="od-price-qty">{fmt(it.don_gia)} <span className="orderdetail-auto-8">x</span> {it.so_luong}</span>
                    </div>
                    <span className="od-total">{fmt(it.thanh_tien)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address info */}
            <div className="ds-card">
              <h2 className="ds-card-title"><MapPin size={16} /> Thông tin nhận hàng</h2>
              <div className="od-info-grid">
                <div className="od-info-row"><span>Người nhận</span>  <strong>{order.ten_nguoi_nhan}</strong></div>
                <div className="od-info-row"><span>Số điện thoại</span><strong>{order.sdt_nguoi_nhan}</strong></div>
                <div className="od-info-row"><span>Địa chỉ giao</span> <strong>{order.dia_chi_giao_hang}</strong></div>
                <div className="od-info-row"><span>Ghi chú</span>      <strong>{order.ghi_chu || 'Không có'}</strong></div>
              </div>
            </div>
          </div>

          {/* Side Col */}
          <div className="od-col-side">
            <div className="ds-card orderdetail-auto-9">
              <h2 className="ds-card-title"><FileText size={16} /> Tổng quan đơn hàng</h2>
              <div className="od-sum-bd">
                <div className="od-sum-row">
                  <span className="od-sum-lbl">Ngày đặt hàng:</span>
                  <span className="od-sum-val">{fmtDate(order.ngay_tao)}</span>
                </div>
                <div className="od-sum-row">
                  <span className="od-sum-lbl orderdetail-auto-10"><Truck size={14}/> Thanh toán:</span>
                  <span className="od-sum-val">{order.phuong_thuc_thanh_toan}</span>
                </div>

                <div className="od-sum-line" />

                <div className="od-sum-grand">
                  <span>Tổng thanh toán</span>
                  <span className="od-sum-grand-val">{fmt(order.thanh_tien || order.tong_tien)}</span>
                </div>

                {canCancel && (
                  <button
                    className="ds-btn-primary od-cancel-btn"
                    onClick={handleCancel} disabled={canceling}>
                    {canceling ? <Loader size={16} className="ds-spin" /> : <XCircle size={16} />}
                    {canceling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
