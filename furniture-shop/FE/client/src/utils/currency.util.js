export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ?';

  return Number(value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};
