import { useContext } from 'react';
import { CompareContext } from '../contexts/CompareContext';
import { getCompareList, saveCompareList, MAX_COMPARE } from '../helpers/compare.helper';
import { normalizeCompareProduct } from '../data/compareProducts';

export const useCompare = () => {
  const context = useContext(CompareContext);

  const syncCompare = (items) => {
    saveCompareList(items);
    context?.setCompareItems?.([...items]);
  };

  const isInCompare = (productId) => {
    const items = context?.compareItems ?? getCompareList();
    return items.some((item) => item.id === Number(productId));
  };

  const addToCompare = (product) => {
    const normalized = normalizeCompareProduct(product);
    const items = getCompareList();

    if (items.some((item) => item.id === normalized.id)) {
      return { success: false, message: 'Sản phẩm đã có trong danh sách so sánh.' };
    }

    if (items.length >= MAX_COMPARE) {
      return { success: false, message: `Chỉ so sánh tối đa ${MAX_COMPARE} sản phẩm. Hãy xóa một sản phẩm trước.` };
    }

    syncCompare([...items, normalized]);
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    const items = getCompareList().filter((item) => item.id !== Number(productId));
    syncCompare(items);
  };

  const clearCompare = () => {
    syncCompare([]);
  };

  const compareItems = context?.compareItems ?? getCompareList();
  const compareCount = compareItems.length;

  return {
    compareItems,
    compareCount,
    isInCompare,
    addToCompare,
    removeFromCompare,
    clearCompare,
    maxCompare: MAX_COMPARE,
  };
};
