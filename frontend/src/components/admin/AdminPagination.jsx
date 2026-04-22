import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
      marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--admin-divider)' 
    }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="btn btn-secondary"
        style={{ padding: '8px', minWidth: '40px', minHeight: '40px' }}
      >
        <ChevronLeft size={16} />
      </button>

      <div style={{ display: 'flex', gap: '4px' }}>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              width: '40px', height: '40px', borderRadius: 'var(--admin-radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none',
              transition: 'all 0.2s',
              background: currentPage === page ? 'var(--admin-primary)' : 'transparent',
              color: currentPage === page ? '#fff' : 'var(--admin-text-muted)',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page) e.target.style.background = 'var(--admin-bg-ash)';
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page) e.target.style.background = 'transparent';
            }}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="btn btn-secondary"
        style={{ padding: '8px', minWidth: '40px', minHeight: '40px' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AdminPagination;
