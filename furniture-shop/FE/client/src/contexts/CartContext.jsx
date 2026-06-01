import { createContext, useState, useEffect, useContext } from 'react';
import { getCart } from '../helpers/cart.helper';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id ?? null;

  // Re-load cart từ localStorage mỗi khi user thay đổi (login/logout)
  const [cartItems, setCartItems] = useState(() => getCart());

  useEffect(() => {
    // Khi userId thay đổi (login/logout) → load lại cart đúng của user đó
    setCartItems(getCart());
  }, [userId]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
