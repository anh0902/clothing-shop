import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import Dashboard from './Dashboard';
import BookManagement from './BookManagement';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';

const AdminApp = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        
        {/* Redirect any other sub-paths to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminApp;
