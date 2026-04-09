import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import CategoryPublisherManagement from './pages/CategoryPublisherManagement';
import UserManagement from './pages/UserManagement';
import OrderManagement from './pages/OrderManagement';

const AdminApp = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="categories" element={<CategoryPublisherManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        
        {/* Redirect any other sub-paths to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
