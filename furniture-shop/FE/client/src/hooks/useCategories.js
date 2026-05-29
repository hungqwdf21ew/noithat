import { useState, useEffect } from 'react';
import axiosInstance from '../apis/axios.config';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get('/categories');
      
      if (response.data.success) {
        setCategories(response.data.data || []);
      } else {
        setError(response.data.message || 'Không thể tải danh mục');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
