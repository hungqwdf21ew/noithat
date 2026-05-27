import { createContext, useState } from 'react';

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  return <CartContext.Provider value={{ cartItems, setCartItems }}>{children}</CartContext.Provider>;
};

export default CartProvider;
