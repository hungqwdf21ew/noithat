import { createContext, useState } from 'react';
import { getFavorites } from '../helpers/favorite.helper';

export const FavoriteContext = createContext(null);

const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => getFavorites());

  return (
    <FavoriteContext.Provider value={{ favorites, setFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteProvider;
