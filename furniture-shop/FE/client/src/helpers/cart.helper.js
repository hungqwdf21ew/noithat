import { getUser } from './storage.helper';

// Key riêng cho từng user — khách vãng lai dùng 'cart_guest'
export const getCartKey = () => {
  const user = getUser();
  return user?.id ? `cart_user_${user.id}` : 'cart_guest';
};

export const getCartLineKey = (item) =>
  `${item.id}::${item.selectedColor || ''}::${item.selectedSize || ''}`;

export const getCart = () => {
  try {
    const raw = localStorage.getItem(getCartKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cartItems) => {
  localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
};

export const clearCartStorage = () => {
  localStorage.removeItem(getCartKey());
};

// Merge cart khách vào cart user khi đăng nhập
// Gọi hàm này ngay sau khi login thành công (trước khi setUser)
export const mergeGuestCartOnLogin = (userId) => {
  try {
    const guestKey = 'cart_guest';
    const userKey  = `cart_user_${userId}`;

    const guestCart = JSON.parse(localStorage.getItem(guestKey) || '[]');
    if (guestCart.length === 0) return;

    const userCart = JSON.parse(localStorage.getItem(userKey) || '[]');

    // Merge: nếu sản phẩm đã có trong cart user thì cộng số lượng
    guestCart.forEach(guestItem => {
      const lineKey = getCartLineKey(guestItem);
      const idx = userCart.findIndex(u => getCartLineKey(u) === lineKey);
      if (idx >= 0) {
        userCart[idx].quantity += guestItem.quantity;
      } else {
        userCart.push(guestItem);
      }
    });

    localStorage.setItem(userKey, JSON.stringify(userCart));
    localStorage.removeItem(guestKey); // xóa cart khách sau khi merge
  } catch (e) {
    console.error('[cart.helper] mergeGuestCartOnLogin:', e);
  }
};
