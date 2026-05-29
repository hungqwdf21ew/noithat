import { useState, useEffect } from 'react';
import { productApi } from '../apis/product.api';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getAll({ ...initialParams, ...params });
      
      if (response.success) {
        setProducts(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Không thể tải sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    refetch: fetchProducts
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getById(id);
      
      if (response.success) {
        setProduct(response.data);
      } else {
        setError(response.message || 'Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};
