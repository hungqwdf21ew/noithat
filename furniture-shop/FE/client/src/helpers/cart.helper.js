const CART_KEY = 'furniture_shop_cart';

export const getCartLineKey = (item) =>
  `${item.id}::${item.selectedColor || ''}::${item.selectedSize || ''}`;

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cartItems) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

export const clearCartStorage = () => {
  localStorage.removeItem(CART_KEY);
};
