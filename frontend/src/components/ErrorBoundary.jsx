import React from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px',
          background: '#f9fafb',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: '#fee2e2',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px'
          }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
            <h1 style={{ color: '#111827', fontSize: '24px', marginBottom: '8px' }}>
              Oops! Đã có lỗi xảy ra
            </h1>
            <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.5' }}>
              Ứng dụng gặp sự cố ngoài ý muốn. Đừng lo lắng, dữ liệu của bạn vẫn an toàn. 
              Vui lòng thử tải lại trang hoặc quay về trang chủ.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <RefreshCcw size={16} /> Tải lại trang
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Về trang chủ
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '24px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>
                <summary style={{ cursor: 'pointer' }}>Chi tiết lỗi (Chỉ hiện ở Dev)</summary>
                <pre style={{ overflowX: 'auto', marginTop: '8px' }}>
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
