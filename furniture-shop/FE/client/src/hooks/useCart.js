import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { getCart, saveCart } from '../helpers/cart.helper';

export const useCart = () => {
  const context = useContext(CartContext);

  const addToCart = (product) => {
    const currentCart = getCart();
    const existingIndex = currentCart.findIndex(
      item => item.id === product.id &&
              item.selectedColor === product.selectedColor &&
              item.selectedSize === product.selectedSize
    );

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += (product.quantity || 1);
    } else {
      currentCart.push({ ...product, quantity: product.quantity || 1 });
    }

    saveCart(currentCart);

    if (context?.setCartItems) {
      context.setCartItems([...currentCart]);
    }
  };

  const removeFromCart = (productId) => {
    const currentCart = getCart().filter(item => item.id !== productId);
    saveCart(currentCart);
    if (context?.setCartItems) {
      context.setCartItems([...currentCart]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    const currentCart = getCart().map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(currentCart);
    if (context?.setCartItems) {
      context.setCartItems([...currentCart]);
    }
  };

  const clearCart = () => {
    saveCart([]);
    if (context?.setCartItems) {
      context.setCartItems([]);
    }
  };

  const cartItems = context?.cartItems || getCart();
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
