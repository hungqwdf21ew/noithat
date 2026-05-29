import { useContext } from 'react';
import { FavoriteContext } from '../contexts/FavoriteContext';
import {
  getFavorites,
  saveFavorites,
  normalizeFavoriteProduct,
} from '../helpers/favorite.helper';

export const useFavorites = () => {
  const context = useContext(FavoriteContext);

  const syncFavorites = (items) => {
    saveFavorites(items);
    context?.setFavorites?.([...items]);
  };

  const isFavorite = (productId) => {
    const items = context?.favorites ?? getFavorites();
    return items.some((item) => item.id === productId);
  };

  const addFavorite = (product) => {
    const items = getFavorites();
    if (items.some((item) => item.id === product.id)) return;

    syncFavorites([normalizeFavoriteProduct(product), ...items]);
  };

  const removeFavorite = (productId) => {
    const items = getFavorites().filter((item) => item.id !== productId);
    syncFavorites(items);
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const clearFavorites = () => {
    syncFavorites([]);
  };

  const favorites = context?.favorites ?? getFavorites();
  const favoriteCount = favorites.length;

  return {
    favorites,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  };
};
