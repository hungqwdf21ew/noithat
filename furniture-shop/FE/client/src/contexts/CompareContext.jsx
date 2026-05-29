import { createContext, useState } from 'react';
import { getCompareList } from '../helpers/compare.helper';

export const CompareContext = createContext(null);

const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => getCompareList());

  return (
    <CompareContext.Provider value={{ compareItems, setCompareItems }}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareProvider;
