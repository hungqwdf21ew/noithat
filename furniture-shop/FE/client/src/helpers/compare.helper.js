const COMPARE_KEY = 'furniture_shop_compare';
export const MAX_COMPARE = 2;

export const getCompareList = () => {
  const data = localStorage.getItem(COMPARE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCompareList = (items) => {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
};

export const clearCompareStorage = () => {
  localStorage.removeItem(COMPARE_KEY);
};
