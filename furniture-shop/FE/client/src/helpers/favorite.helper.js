const FAVORITE_KEY = 'furniture_shop_favorites';

export const normalizeFavoriteProduct = (product) => ({
  id: product.id,
  name: product.name || product.title,
  price: product.price || 0,
  image: product.images?.[0] || product.image || '/images/anhghesofa.png',
  category: product.category || '',
  subtitle: product.subtitle || '',
  addedAt: new Date().toISOString(),
});

export const getFavorites = () => {
  const data = localStorage.getItem(FAVORITE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFavorites = (items) => {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(items));
};

export const clearFavoritesStorage = () => {
  localStorage.removeItem(FAVORITE_KEY);
};
