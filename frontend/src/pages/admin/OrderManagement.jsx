import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Eye, Filter, 
  Calendar, CreditCard, MapPin, Phone, User, X,
  Clock, CheckCircle, Truck, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAPI } from '../../services/adminService';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const configs = {
    'PENDING': { color: '#f59e0b', bg: '#fffbeb', icon: Clock, label: 'Chờ xử lý' },
    'CONFIRMED': { color: '#6366f1', bg: '#eef2ff', icon: CheckCircle, label: 'Đã xác nhận' },
    'SHIPPING': { color: '#3b82f6', bg: '#eff6ff', icon: Truck, label: 'Đang giao' },
    'COMPLETED': { color: '#10b981', bg: '#ecfdf5', icon: CheckCircle, label: 'Hoàn tất' },
    'CANCELLED': { color: '#ef4444', bg: '#fef2f2', icon: XCircle, label: 'Đã hủy' },
    'DEFAULT': { color: '#64748b', bg: '#f8fafc', icon: Clock, label: 'Không xác định' }
  };

  const config = configs[status] || configs.DEFAULT;
  const Icon = config.icon;

  return (
    <span style={{ 
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
      background: config.bg, color: config.color, border: `1px solid ${config.color}30`
    }}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(o => {
    const orderId = o?.id?.toString() || '';
    const customerName = o?.tenNguoiNhan?.toLowerCase() || '';
    const searchLow = (searchTerm || '').toLowerCase();
    
    return orderId.includes(searchLow) || customerName.includes(searchLow);
  }) : [];

  return (
    <div className="order-management animate-in">
      <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: 'auto' }}>
           <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Quản lý Đơn hàng</h3>
        </div>
        <div style={{ position: 'relative', width: '240px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-light)' }} size={14} />
          <input 
            type="text" 
            placeholder="Tìm mã đơn, tên khách..." 
            className="form-control"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => <tr key={i}><td colSpan="7" style={{ padding: '24px' }}><div className="skeleton" style={{ height: '40px', borderRadius: '2px' }} /></td></tr>)
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <ShoppingCart className="empty-state-icon" style={{ margin: '0 auto 16px', color: 'var(--admin-text-light)' }} />
                    <p style={{ fontWeight: 500, color: 'var(--admin-text-muted)' }}>Chưa có đơn hàng nào.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order?.id}>
                  <td style={{ fontSize: '13px', color: 'var(--admin-text-light)', fontWeight: 500 }}>#{order?.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--admin-text-head)', fontSize: '14px' }}>{order?.tenNguoiNhan}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{order?.sdtNguoiNhan}</div>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {order?.ngayTao ? new Date(order.ngayTao).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--admin-primary)' }}>{order?.tongTien?.toLocaleString()}đ</div>
                  </td>
                  <td className="text-center">{order?.soLuongSach || 0}</td>
                  <td className="text-center">
                    <StatusBadge status={order?.trangThai} />
                  </td>
                  <td className="text-center">
                    <button onClick={() => handleOpenDetail(order)} className="btn btn-secondary" style={{ minWidth: '32px', minHeight: '32px', padding: 0 }}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              style={{ width: '100%', maxWidth: '600px', background: 'var(--admin-bg-pure)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--admin-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 500, fontSize: '18px' }}>Chi tiết Đơn hàng #{selectedOrder.id}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-light)', marginTop: '4px' }}>Đặt ngày {new Date(selectedOrder.ngayTao).toLocaleString('vi-VN')}</div>
                </div>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ minWidth: '32px', minHeight: '32px', padding: 0, borderRadius: '50%' }}><X size={18} /></button>
              </div>

              <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ color: 'var(--admin-primary)' }}><User size={16} /></div>
                       <div>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Người nhận</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{selectedOrder.tenNguoiNhan}</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ color: 'var(--admin-primary)' }}><Phone size={16} /></div>
                       <div>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Số điện thoại</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{selectedOrder.sdtNguoiNhan}</p>
                       </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ color: 'var(--admin-primary)' }}><CreditCard size={16} /></div>
                       <div>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thanh toán</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{selectedOrder.phuongThucThanhToan || 'Tiền mặt'}</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ color: 'var(--admin-primary)' }}><Filter size={16} /></div>
                       <div>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trạng thái</p>
                          <StatusBadge status={selectedOrder.trangThai} />
                       </div>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', background: 'var(--admin-bg-ash)', padding: '16px', borderRadius: '4px', marginTop: '8px' }}>
                     <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ color: 'var(--admin-text-muted)', marginTop: '2px' }}><MapPin size={16} /></div>
                        <div>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Địa chỉ giao hàng</p>
                          <p style={{ margin: '4px 0 0', fontSize: '14px', lineHeight: 1.5 }}>{selectedOrder.diaChiGiaoHang}</p>
                        </div>
                     </div>
                  </div>

                  {selectedOrder.ghiChu && (
                    <div style={{ gridColumn: 'span 2', padding: '12px 16px', borderLeft: '3px solid var(--admin-divider)' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--admin-text-light)', textTransform: 'uppercase' }}>Ghi chú đơn hàng</p>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', fontStyle: 'italic' }}>"{selectedOrder.ghiChu}"</p>
                    </div>
                  )}

                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--admin-divider)', paddingTop: '24px', marginTop: '16px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Tổng số lượng sách</span>
                        <span style={{ fontWeight: 500 }}>{selectedOrder.soLuongSach} cuốn</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', marginTop: '16px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--admin-text-head)' }}>Tổng thanh toán</span>
                        <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{selectedOrder.tongTien?.toLocaleString()}đ</span>
                     </div>
                  </div>
                </div>

                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
