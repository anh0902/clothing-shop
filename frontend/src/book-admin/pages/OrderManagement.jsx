import React from 'react';
import { ShoppingCart } from 'lucide-react';
import '../admin.css';

const OrderManagement = () => {
  return (
    <div className="order-management">
      <div className="admin-card glass-effect" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ background: '#fef3c7', color: '#d97706', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>Đang Nâng Cấp Hệ Thống</h2>
        <p style={{ color: 'var(--admin-text-muted)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Chức năng Quản lý Đơn hàng đang được xây dựng lại để hoàn toàn tương thích với <b>Spring Boot (Java)</b>. 
          Mọi kết nối tới Node.js cũ đã được gỡ bỏ để đảm bảo tính an toàn và đồng bộ.
        </p>
        <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '20px', background: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>
          Trạng thái: Đang phát triển (Java Version)
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
