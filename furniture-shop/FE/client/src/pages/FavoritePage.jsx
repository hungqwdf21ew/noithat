import { Link } from 'react-router-dom';
import {
  Heart, ShoppingCart, Trash2, ArrowRight, Eye,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import './FavoritePage.css';

const FavoritePage = () => {
  const { favorites, favoriteCount, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="fav-page">
          <div className="container">
            <nav className="fav-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Sản phẩm yêu thích</span>
            </nav>
            <div className="fav-empty">
              <div className="fav-empty-icon">
                <Heart size={48} />
              </div>
              <h1>Chưa có sản phẩm yêu thích</h1>
              <p>Lưu những món nội thất bạn thích để xem lại và mua sắm sau.</p>
              <Link to="/products" className="fav-btn-primary">
                Khám phá sản phẩm <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="fav-page">
        <div className="container">
          <nav className="fav-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Sản phẩm yêu thích</span>
          </nav>

          <div className="fav-header">
            <div>
              <h1>Sản Phẩm Yêu Thích</h1>
              <p>{favoriteCount} sản phẩm đã lưu</p>
            </div>
            <button type="button" className="fav-clear-btn" onClick={clearFavorites}>
              Xóa tất cả
            </button>
          </div>

          <div className="fav-grid">
            {favorites.map((item) => (
              <article key={item.id} className="fav-card">
                <button
                  type="button"
                  className="fav-remove-btn"
                  aria-label="Bỏ yêu thích"
                  onClick={() => removeFavorite(item.id)}
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/products/${item.id}`} className="fav-card-img">
                  <img src={getImageUrl(item.image)} alt={item.name} loading="lazy" />
                </Link>

                <div className="fav-card-body">
                  {item.category && (
                    <span className="fav-card-category">{item.category}</span>
                  )}
                  <Link to={`/products/${item.id}`} className="fav-card-name">
                    {item.name}
                  </Link>
                  {item.subtitle && (
                    <p className="fav-card-sub">{item.subtitle}</p>
                  )}
                  <div className="fav-card-price">{formatCurrency(item.price)}</div>

                  <div className="fav-card-actions">
                    <button
                      type="button"
                      className="fav-btn-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={16} /> Thêm vào giỏ
                    </button>
                    <Link to={`/products/${item.id}`} className="fav-btn-view">
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="fav-footer-actions">
            <Link to="/products" className="fav-btn-outline">
              ← Tiếp tục mua sắm
            </Link>
            <Link to="/cart" className="fav-btn-primary">
              Xem giỏ hàng <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default FavoritePage;
