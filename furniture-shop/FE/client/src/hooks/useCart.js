import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { getCart, saveCart, getCartLineKey } from '../helpers/cart.helper';

export const useCart = () => {
  const context = useContext(CartContext);

  const syncCart = (items) => {
    saveCart(items);
    context?.setCartItems?.([...items]);
  };

  const addToCart = (product) => {
    const currentCart = getCart();
    const lineKey = getCartLineKey(product);
    const existingIndex = currentCart.findIndex(
      (item) => getCartLineKey(item) === lineKey
    );

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += product.quantity || 1;
    } else {
      currentCart.push({ ...product, quantity: product.quantity || 1 });
    }

    syncCart(currentCart);
  };

  const removeFromCart = (lineKey) => {
    const currentCart = getCart().filter(
      (item) => getCartLineKey(item) !== lineKey
    );
    syncCart(currentCart);
  };

  const updateQuantity = (lineKey, quantity) => {
    if (quantity < 1) return;
    const currentCart = getCart().map((item) =>
      getCartLineKey(item) === lineKey ? { ...item, quantity } : item
    );
    syncCart(currentCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const cartItems = context?.cartItems ?? getCart();
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartLineKey,
  };
};
