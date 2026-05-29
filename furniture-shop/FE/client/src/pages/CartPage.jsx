import { Link } from 'react-router-dom';
import {
  ShoppingBag, Minus, Plus, Trash2, ArrowRight, Truck, Shield, Tag,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useCart } from '../hooks/useCart';
import { formatCurrency, calculateCartTotal } from '../utils/currency.util';
import './CartPage.css';

const FREE_SHIP_MIN = 10000000;
const SHIPPING_FEE = 500000;

const CartPage = () => {
  const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart, getCartLineKey } = useCart();

  const subtotal = calculateCartTotal(cartItems);
  const shipping = subtotal >= FREE_SHIP_MIN || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="cart-page">
          <div className="container">
            <nav className="cart-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Giỏ hàng</span>
            </nav>
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag size={48} />
              </div>
              <h1>Giỏ hàng trống</h1>
              <p>Bạn chưa thêm sản phẩm nào. Khám phá bộ sưu tập nội thất cao cấp ngay hôm nay.</p>
              <Link to="/products" className="cart-btn-primary">
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

      <main className="cart-page">
        <div className="container">
          <nav className="cart-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Giỏ hàng</span>
          </nav>

          <div className="cart-header">
            <div>
              <h1>Giỏ Hàng</h1>
              <p>{cartCount} sản phẩm trong giỏ</p>
            </div>
            <button type="button" className="cart-clear-btn" onClick={clearCart}>
              Xóa tất cả
            </button>
          </div>

          <div className="cart-layout">
            {/* Danh sách sản phẩm */}
            <section className="cart-items-card">
              <div className="cart-items-head">
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <span />
              </div>

              {cartItems.map((item) => {
                const lineKey = getCartLineKey(item);
                const lineTotal = item.price * item.quantity;

                return (
                  <article key={lineKey} className="cart-item">
                    <div className="cart-item-product">
                      <Link to={`/products/${item.id}`} className="cart-item-img">
                        <img src={item.image || '/images/anhghesofa.png'} alt={item.name} />
                      </Link>
                      <div className="cart-item-info">
                        <Link to={`/products/${item.id}`} className="cart-item-name">
                          {item.name}
                        </Link>
                        {item.selectedColor && (
                          <span className="cart-item-variant">Màu: {item.selectedColor}</span>
                        )}
                        {item.selectedSize && (
                          <span className="cart-item-variant">Kích thước: {item.selectedSize}</span>
                        )}
                        {item.sku && (
                          <span className="cart-item-sku">SKU: {item.sku}</span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-price">{formatCurrency(item.price)}</div>

                    <div className="cart-item-qty">
                      <button
                        type="button"
                        aria-label="Giảm số lượng"
                        onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Tăng số lượng"
                        onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item-total">{formatCurrency(lineTotal)}</div>

                    <button
                      type="button"
                      className="cart-item-remove"
                      aria-label="Xóa sản phẩm"
                      onClick={() => removeFromCart(lineKey)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                );
              })}
            </section>

            {/* Tóm tắt đơn hàng */}
            <aside className="cart-summary-card">
              <h2>Tóm tắt đơn hàng</h2>

              <div className="cart-promo">
                <Tag size={16} />
                <input type="text" placeholder="Nhập mã giảm giá" />
                <button type="button">Áp dụng</button>
              </div>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Tạm tính</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Phí vận chuyển</span>
                  <strong>
                    {shipping === 0 ? (
                      <span className="cart-free-ship">Miễn phí</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </strong>
                </div>
                {subtotal > 0 && subtotal < FREE_SHIP_MIN && (
                  <p className="cart-ship-note">
                    Mua thêm {formatCurrency(FREE_SHIP_MIN - subtotal)} để được miễn phí vận chuyển
                  </p>
                )}
                <div className="cart-summary-divider" />
                <div className="cart-summary-row cart-summary-total">
                  <span>Tổng cộng</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              <Link to="/checkout" className="cart-btn-primary cart-btn-checkout">
                Tiến hành thanh toán <ArrowRight size={18} />
              </Link>

              <Link to="/products" className="cart-btn-outline">
                ← Tiếp tục mua sắm
              </Link>

              <div className="cart-trust">
                <div><Truck size={16} /> Giao hàng toàn quốc</div>
                <div><Shield size={16} /> Bảo hành chính hãng</div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default CartPage;
