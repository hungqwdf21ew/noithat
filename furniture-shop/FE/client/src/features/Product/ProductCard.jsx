import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Scale } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.util';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCompare } = useCompare();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart?.(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
    navigate('/compare');
  };

  const productImage = product.images?.[0] || product.image || '/images/placeholder.png';
  const productName = product.name || product.title || 'Sản phẩm';
  const productPrice = product.price || 0;
  const productId = product.id || product._id;
  const favorited = isFavorite(productId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${productId}`} className="product-card-link">
        {/* Badge */}
        {product.isNew && (
          <div className="product-badge new">Mới</div>
        )}
        {product.discount && (
          <div className="product-badge discount">-{product.discount}%</div>
        )}

        {/* Image Container */}
        <div className="product-image-container">
          <img 
            src={productImage}
            alt={productName}
            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="product-overlay">
            <div className="product-actions">
              <button 
                className="action-btn"
                onClick={handleAddToCart}
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCart size={18} />
              </button>
              <Link 
                to={`/products/${productId}`}
                className="action-btn"
                title="Xem chi tiết"
              >
                <Eye size={18} />
              </Link>
              <button 
                className="action-btn"
                onClick={handleCompare}
                title="So sánh"
              >
                <Scale size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-card">
          {product.category && (
            <div className="product-category">{product.category}</div>
          )}
          
          <h3 className="product-name">{productName}</h3>
          
          <div className="product-price-row">
            <span className="product-price">{formatCurrency(productPrice)}</span>
            {product.originalPrice && (
              <span className="product-original-price">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < product.rating ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
              {product.reviewCount && (
                <span className="review-count">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${favorited ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
