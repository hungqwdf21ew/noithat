import { useContext, useCallback } from 'react';
import { CartContext } from '../contexts/CartContext';
import { getCart, saveCart, getCartLineKey } from '../helpers/cart.helper';
import { getToken } from '../helpers/storage.helper';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper gọi cart API (chỉ khi đã đăng nhập)
const cartApi = {
  getHeaders: () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }),

  get: () =>
    fetch(`${API_BASE}/cart`, { headers: cartApi.getHeaders() }).then(r => r.json()),

  add: (productId, quantity) =>
    fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: cartApi.getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    }).then(r => r.json()),

  update: (productId, quantity) =>
    fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: cartApi.getHeaders(),
      body: JSON.stringify({ quantity }),
    }).then(r => r.json()),

  remove: (productId) =>
    fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: cartApi.getHeaders(),
    }).then(r => r.json()),

  clear: () =>
    fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: cartApi.getHeaders(),
    }).then(r => r.json()),

  sync: (items) =>
    fetch(`${API_BASE}/cart/sync`, {
      method: 'POST',
      headers: cartApi.getHeaders(),
      body: JSON.stringify({
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      }),
    }).then(r => r.json()),
};

export const useCart = () => {
  const context = useContext(CartContext);
  const token = getToken();
  const isLoggedIn = !!token;

  const syncCart = useCallback((items) => {
    saveCart(items);
    context?.setCartItems?.([...items]);
  }, [context]);

  /* ── Thêm vào giỏ ── */
  const addToCart = useCallback(async (product) => {
    // Luôn cập nhật localStorage trước (UX nhanh)
    const currentCart = getCart();
    const lineKey = getCartLineKey(product);
    const idx = currentCart.findIndex(i => getCartLineKey(i) === lineKey);

    if (idx >= 0) {
      currentCart[idx].quantity += product.quantity || 1;
    } else {
      currentCart.push({ ...product, quantity: product.quantity || 1 });
    }
    syncCart(currentCart);

    // Đồng bộ lên BE nếu đã đăng nhập
    if (isLoggedIn) {
      try {
        await cartApi.add(product.id, product.quantity || 1);
      } catch (e) {
        console.warn('[useCart] addToCart API error:', e.message);
      }
    }
  }, [isLoggedIn, syncCart]);

  /* ── Xóa 1 sản phẩm ── */
  const removeFromCart = useCallback(async (lineKey) => {
    const currentCart = getCart();
    const item = currentCart.find(i => getCartLineKey(i) === lineKey);
    const newCart = currentCart.filter(i => getCartLineKey(i) !== lineKey);
    syncCart(newCart);

    if (isLoggedIn && item) {
      try {
        await cartApi.remove(item.id);
      } catch (e) {
        console.warn('[useCart] removeFromCart API error:', e.message);
      }
    }
  }, [isLoggedIn, syncCart]);

  /* ── Cập nhật số lượng ── */
  const updateQuantity = useCallback(async (lineKey, quantity) => {
    if (quantity < 1) return;
    const currentCart = getCart();
    const item = currentCart.find(i => getCartLineKey(i) === lineKey);
    const newCart = currentCart.map(i =>
      getCartLineKey(i) === lineKey ? { ...i, quantity } : i
    );
    syncCart(newCart);

    if (isLoggedIn && item) {
      try {
        await cartApi.update(item.id, quantity);
      } catch (e) {
        console.warn('[useCart] updateQuantity API error:', e.message);
      }
    }
  }, [isLoggedIn, syncCart]);

  /* ── Xóa toàn bộ giỏ ── */
  const clearCart = useCallback(async () => {
    syncCart([]);
    if (isLoggedIn) {
      try {
        await cartApi.clear();
      } catch (e) {
        console.warn('[useCart] clearCart API error:', e.message);
      }
    }
  }, [isLoggedIn, syncCart]);

  /* ── Sync cart localStorage lên BE (gọi sau login) ── */
  const syncToServer = useCallback(async () => {
    if (!isLoggedIn) return;
    const items = getCart();
    if (items.length === 0) return;
    try {
      await cartApi.sync(items);
    } catch (e) {
      console.warn('[useCart] syncToServer error:', e.message);
    }
  }, [isLoggedIn]);

  const cartItems = context?.cartItems ?? getCart();
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncToServer,
    getCartLineKey,
  };
};
