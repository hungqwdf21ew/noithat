export const getToken = () => localStorage.getItem('furniture_shop_token');
export const setToken = (token) => localStorage.setItem('furniture_shop_token', token);
export const removeToken = () => localStorage.removeItem('furniture_shop_token');
