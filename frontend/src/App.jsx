import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/user/Home';
import Category from './pages/user/Category';
import ProductDetail from './pages/user/ProductDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Confirm from './pages/user/Confirm';
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';
import OrderDetail from './pages/user/OrderDetail';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import AdminApp from './pages/admin/AdminApp';
import ProtectedRoute from './components/ProtectedRoute';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/category" element={<PageWrapper><Category /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><Category /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/confirm" element={<PageWrapper><Confirm /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
        <Route path="/orders/:id" element={<PageWrapper><OrderDetail /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminApp />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <AnimatedRoutes />
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
