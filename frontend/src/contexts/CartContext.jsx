import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }
    setLoadingCart(true);
    try {
      const res = await cartAPI.getCart();
      // Laravel structure: { success: true, data: { thong_tin_gio_hang: { chitietgiohangs: [...] } } }
      if (res && res.success && res.data?.thong_tin_gio_hang) {
        setCartItems(res.data.thong_tin_gio_hang.chitietgiohangs || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Tính tổng số lượng dựa trên 'so_luong' trong DB
  const cartCount = (cartItems || []).reduce((acc, item) => {
    return acc + (parseInt(item?.so_luong) || 0);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, loadingCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
