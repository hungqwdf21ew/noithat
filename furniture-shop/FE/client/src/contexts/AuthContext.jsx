import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../apis/auth.api';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../helpers/storage.helper';

export const AuthContext = createContext(null);

// Hook tiện dụng
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [user, setUserState]   = useState(() => getUser());
  const [loading, setLoading]  = useState(false);
  const [initialized, setInit] = useState(false);

  // Khi app khởi động: nếu có token thì fetch lại thông tin user
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      authApi.getMe()
        .then(res => {
          if (res.success) {
            setUserState(res.data);
            setUser(res.data);
          } else {
            removeToken();
            removeUser();
          }
        })
        .catch(() => {
          removeToken();
          removeUser();
        })
        .finally(() => setInit(true));
    } else {
      setInit(true);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setUserState(res.data.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      if (res.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setUserState(res.data.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  const isAdmin    = user?.role === 'ADMIN';
  const isStaff    = user?.role === 'NHAN_VIEN';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, initialized,
      isLoggedIn, isAdmin, isStaff,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
