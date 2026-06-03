import { createContext, useState } from 'react';
import { getCompareList, saveCompareList } from '../helpers/compare.helper';

export const CompareContext = createContext(null);

// Xóa các item cũ trong localStorage nếu thiếu trường image hoặc name
const sanitizeCompareList = () => {
  const items = getCompareList();
  const valid = items.filter(item => item.id && item.name && item.image);
  if (valid.length !== items.length) {
    saveCompareList(valid);
  }
  return valid;
};

const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => sanitizeCompareList());

  return (
    <CompareContext.Provider value={{ compareItems, setCompareItems }}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareProvider;
