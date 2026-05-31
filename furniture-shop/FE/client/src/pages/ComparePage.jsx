import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  X, Heart, Scale, ShoppingCart, ArrowRight, Headphones,
  Ruler, Box, Palette, Sparkles, Weight, Globe, ShieldCheck,
  ChevronLeft, ChevronRight, Plus,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useCompare } from '../hooks/useCompare';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { getCompareProduct, COMPARE_SUGGESTIONS, SPEC_LABELS } from '../data/compareProducts';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import './ComparePage.css';

const SPEC_ICONS = {
  'Kích thước': Ruler,
  'Chất liệu khung': Box,
  'Chất liệu bọc': Box,
  'Màu sắc': Palette,
  'Phong cách': Sparkles,
  'Trọng lượng': Weight,
  'Xuất xứ': Globe,
  'Bảo hành': ShieldCheck,
};

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { compareItems, addToCompare, removeFromCompare, maxCompare } = useCompare();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [notice, setNotice] = useState('');
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const addId = searchParams.get('add');
    if (!addId) return;

    const product = getCompareProduct(addId);
    if (product) {
      const result = addToCompare(product);
      if (!result.success) setNotice(result.message);
    }

    searchParams.delete('add');
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = [
    compareItems[0] || null,
    compareItems[1] || null,
  ];

  const handleAddToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
  };

  const visibleSuggestions = COMPARE_SUGGESTIONS.slice(slide, slide + 3);

  if (compareItems.length === 0) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="cmp-page">
          <section className="cmp-hero">
            <div className="cmp-hero-bg" />
            <div className="cmp-hero-content container">
              <nav className="cmp-breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                <span>So sánh sản phẩm</span>
              </nav>
              <h1>So Sánh Sản Phẩm</h1>
            </div>
          </section>
          <div className="container cmp-empty-wrap">
            <div className="cmp-empty">
              <Scale size={48} />
              <h2>Chưa có sản phẩm để so sánh</h2>
              <p>Chọn tối đa {maxCompare} sản phẩm từ danh sách để so sánh chi tiết.</p>
              <Link to="/products" className="cmp-btn-gold">
                Chọn sản phẩm <ArrowRight size={18} />
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

      <main className="cmp-page">
        {/* Hero */}
        <section className="cmp-hero">
          <div className="cmp-hero-bg" />
          <div className="cmp-hero-content container">
            <nav className="cmp-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>So sánh sản phẩm</span>
            </nav>
            <h1>So Sánh Sản Phẩm</h1>
          </div>
        </section>

        <div className="container cmp-body">
          {notice && (
            <div className="cmp-notice">{notice}</div>
          )}

          {/* Product cards */}
          <section className="cmp-products">
            {slots.map((item, idx) => (
              <div key={idx} className="cmp-product-col">
                {item ? (
                  <article className="cmp-product-card">
                    <button
                      type="button"
                      className="cmp-remove-btn"
                      aria-label="Xóa khỏi so sánh"
                      onClick={() => removeFromCompare(item.id)}
                    >
                      <X size={16} />
                    </button>
                    <div className="cmp-product-img">
                      <img src={getImageUrl(item.image)} alt={item.name} />
                    </div>
                    <h3>{item.name}</h3>
                    <p className="cmp-product-sub">{item.subtitle}</p>
                    <div className="cmp-product-price">{formatCurrency(item.price)}</div>
                    <div className="cmp-product-btns">
                      <Link to={`/products/${item.id}`} className="cmp-btn-gold">
                        Xem chi tiết
                      </Link>
                      <button type="button" className="cmp-btn-wine" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart size={16} /> Thêm vào giỏ
                      </button>
                    </div>
                    <div className="cmp-product-icons">
                      <button
                        type="button"
                        className={`cmp-icon-btn ${isFavorite(item.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item)}
                      >
                        <Heart size={16} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <span className="cmp-icon-btn active-static">
                        <Scale size={16} />
                      </span>
                    </div>
                  </article>
                ) : (
                  <Link to="/products" className="cmp-add-slot">
                    <Plus size={32} />
                    <span>Thêm sản phẩm</span>
                  </Link>
                )}
              </div>
            ))}

            {compareItems.length === 2 && (
              <div className="cmp-vs-badge">VS</div>
            )}
          </section>

          {/* Comparison table */}
          {compareItems.length >= 2 && (
            <>
              <section className="cmp-table-wrap">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th>Tiêu chí</th>
                      <th>{compareItems[0].name}</th>
                      <th>{compareItems[1].name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_LABELS.map((label) => {
                      const Icon = SPEC_ICONS[label] || Box;
                      return (
                        <tr key={label}>
                          <td>
                            <span className="cmp-spec-label">
                              <Icon size={15} /> {label}
                            </span>
                          </td>
                          <td>{compareItems[0].specs?.[label] || '—'}</td>
                          <td>{compareItems[1].specs?.[label] || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>

              {/* Highlights */}
              <section className="cmp-highlights">
                <div className="cmp-highlights-icon">🏆</div>
                <h2>Ưu Điểm Nổi Bật</h2>
                <div className="cmp-highlights-grid">
                  <div className="cmp-highlight-col">
                    <h4>{compareItems[0].name}</h4>
                    <p>{compareItems[0].highlight}</p>
                  </div>
                  <div className="cmp-highlight-divider" />
                  <div className="cmp-highlight-col">
                    <h4>{compareItems[1].name}</h4>
                    <p>{compareItems[1].highlight}</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {compareItems.length === 1 && (
            <p className="cmp-hint">
              Thêm thêm 1 sản phẩm nữa để xem bảng so sánh chi tiết.{' '}
              <Link to="/products">Chọn sản phẩm →</Link>
            </p>
          )}

          {/* Suggestions */}
          <section className="cmp-suggestions">
            <div className="cmp-section-title">
              <span className="cmp-ornament">✦ ✦ ✦</span>
              <h2>Gợi Ý Cho Bạn</h2>
              <span className="cmp-ornament">✦ ✦ ✦</span>
            </div>

            <div className="cmp-suggest-row">
              <button
                type="button"
                className="cmp-suggest-nav"
                disabled={slide === 0}
                onClick={() => setSlide((s) => Math.max(0, s - 1))}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="cmp-suggest-grid">
                {visibleSuggestions.map((p) => (
                  <article key={p.id} className="cmp-suggest-card">
                    <Link to={`/products/${p.id}`} className="cmp-suggest-img">
                      <img src={getImageUrl(p.image)} alt={p.name} loading="lazy" />
                    </Link>
                    <div className="cmp-suggest-body">
                      <Link to={`/products/${p.id}`} className="cmp-suggest-name">{p.name}</Link>
                      <div className="cmp-suggest-price">{formatCurrency(p.price)}</div>
                      <div className="cmp-suggest-actions">
                        <button
                          type="button"
                          className={`cmp-icon-btn sm ${isFavorite(p.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(p)}
                        >
                          <Heart size={14} fill={isFavorite(p.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button type="button" className="cmp-icon-btn sm" onClick={() => handleAddToCart(p)}>
                          <ShoppingCart size={14} />
                        </button>
                        <button
                          type="button"
                          className="cmp-icon-btn sm"
                          onClick={() => {
                            const r = addToCompare(p);
                            if (!r.success) setNotice(r.message);
                            else setNotice('');
                          }}
                        >
                          <Scale size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="cmp-suggest-nav"
                disabled={slide >= COMPARE_SUGGESTIONS.length - 3}
                onClick={() => setSlide((s) => s + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="cmp-cta">
          <div className="container cmp-cta-inner">
            <div className="cmp-cta-text">
              <Headphones size={22} />
              <div>
                <strong>Cần tư vấn chọn sản phẩm phù hợp?</strong>
                <span>Đội ngũ chuyên gia Lavish Heritage luôn sẵn sàng hỗ trợ bạn.</span>
              </div>
            </div>
            <Link to="/#contact" className="cmp-cta-btn">
              Liên hệ ngay <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <ChanTrang />
    </div>
  );
};

export default ComparePage;
