import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Heart, Scale, Eye, ChevronRight, ChevronLeft, Phone } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/currency.util';
import './ProductListPage.css';

/* ── Mock data dùng khi chưa có API ── */
const MOCK_PRODUCTS = [
  { id: 1, name: 'Sofa Heritage Royale', subtitle: 'Sang trọng · Tinh tế · Quyền quý', price: 78500000, badge: 'MỚI', category: 'Sofa', style: 'Cổ điển châu Âu', material: 'Gỗ tự nhiên', image: '/images/anhghesofa.png' },
  { id: 2, name: 'Ghế Bành Louis XV', subtitle: 'Vẻ đẹp hoàng gia vượt thời gian', price: 24800000, badge: 'BÁN CHẠY', category: 'Ghế bành', style: 'Tân cổ điển', material: 'Da thật', image: '/images/anhghebandenkh.png' },
  { id: 3, name: 'Bàn Ăn Grand Palace', subtitle: 'Kiệt tác dành cho không gian đẳng cấp', price: 125000000, badge: 'ĐỘC QUYỀN', category: 'Bàn ăn', style: 'Hoàng gia', material: 'Gỗ tự nhiên', image: '/images/anhbanghekh.png' },
  { id: 4, name: 'Đèn Bàn Imperial', subtitle: 'Ánh sáng của sự tinh tế', price: 18900000, badge: '', category: 'Đèn trang trí', style: 'Cổ điển châu Âu', material: 'Đồng mạ vàng', image: '/images/anhbobanghe.png' },
  { id: 5, name: 'Bàn Console Majestic', subtitle: 'Tinh xảo trong từng chi tiết', price: 62000000, badge: '', category: 'Bàn console', style: 'Tân cổ điển', material: 'Gỗ tự nhiên', image: '/images/anhbanandai.png' },
  { id: 6, name: 'Giường Imperial Majesty', subtitle: 'Giấc ngủ hoàng gia – Đẳng cấp đích thực', price: 98000000, badge: 'MỚI', category: 'Giường ngủ', style: 'Hoàng gia', material: 'Gỗ tự nhiên', image: '/images/anhgiuong.png' },
  { id: 7, name: 'Tủ Trang Trí Royal Moments', subtitle: 'Trưng bày đẳng cấp – Giá trị vượt thời gian', price: 68000000, badge: 'BÁN CHẠY', category: 'Bàn console', style: 'Luxury Classic', material: 'Gỗ tự nhiên', image: '/images/anhbanandai.png' },
  { id: 8, name: 'Bàn Trà Heritage', subtitle: 'Hài hòa · Tinh tế · Đặc sắc', price: 29800000, badge: '', category: 'Bàn ăn', style: 'Tân cổ điển', material: 'Vải cao cấp', image: '/images/anhbanan.png' },
  { id: 9, name: 'Giường Trang Trí Imperial', subtitle: 'Phẩm chuẩn về đẳng cấp sống', price: 16500000, badge: 'ĐỘC QUYỀN', category: 'Giường ngủ', style: 'Cổ điển châu Âu', material: 'Gỗ tự nhiên', image: '/images/anhgiuonghaiden.png' },
];

const CATEGORIES = [
  { name: 'Sofa', count: 38 },
  { name: 'Bàn ăn', count: 18 },
  { name: 'Ghế bành', count: 24 },
  { name: 'Giường ngủ', count: 31 },
  { name: 'Đèn trang trí', count: 29 },
  { name: 'Bàn console', count: 14 },
];

const STYLES = [
  { name: 'Cổ điển châu Âu', count: 72 },
  { name: 'Tân cổ điển', count: 45 },
  { name: 'Hoàng gia', count: 24 },
  { name: 'Luxury Classic', count: 26 },
];

const MATERIALS = [
  { name: 'Gỗ tự nhiên', count: 64 },
  { name: 'Da thật', count: 28 },
  { name: 'Vải cao cấp', count: 42 },
  { name: 'Đá tự nhiên', count: 18 },
  { name: 'Pha lê', count: 16 },
  { name: 'Đồng mạ vàng', count: 22 },
];

const PRICE_RANGES = [
  { label: 'Dưới 20 triệu', min: 0, max: 20000000 },
  { label: '20 – 50 triệu', min: 20000000, max: 50000000 },
  { label: '50 – 100 triệu', min: 50000000, max: 100000000 },
  { label: 'Trên 100 triệu', min: 100000000, max: Infinity },
];

const COLORS = ['#3d1a0a', '#7a3b1e', '#c9973a', '#e8c068', '#d4c5a9', '#6b6b6b', '#2a2a2a'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nổi bật' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'popular', label: 'Phổ biến nhất' },
];

const BADGE_STYLE = {
  'MỚI':       { bg: '#4a7c7e', color: '#fff' },
  'BÁN CHẠY':  { bg: '#c9973a', color: '#fff' },
  'ĐỘC QUYỀN': { bg: '#5c3d2e', color: '#e8c068' },
};

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]           = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeStyles, setActiveStyles]     = useState([]);
  const [activeMaterials, setActiveMaterials] = useState([]);
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [activeColor, setActiveColor]       = useState('');
  const [sortBy, setSortBy]                 = useState('newest');
  const [page, setPage]                     = useState(1);
  const [favorites, setFavorites]           = useState({});
  const PER_PAGE = 9;

  /* ── Filter logic ── */
  const filtered = MOCK_PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeStyles.length && !activeStyles.includes(p.style)) return false;
    if (activeMaterials.length && !activeMaterials.includes(p.material)) return false;
    if (activePriceRange) {
      const r = PRICE_RANGES[activePriceRange];
      if (p.price < r.min || p.price > r.max) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleStyle    = s => setActiveStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleMaterial = m => setActiveMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleFav      = id => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  const clearAll = () => {
    setSearch(''); setActiveCategory(''); setActiveStyles([]);
    setActiveMaterials([]); setActivePriceRange(null); setActiveColor('');
  };

  useEffect(() => { setPage(1); }, [search, activeCategory, activeStyles, activeMaterials, activePriceRange]);

  const hasFilter = activeCategory || activeStyles.length || activeMaterials.length || activePriceRange !== null;

  return (
    <div className="lavish-root">
      <DauTrang />

      {/* ── HERO BANNER ── */}
      <div className="plp-hero">
        <div className="plp-hero-overlay" />
        <div className="plp-hero-content container">
          <h1 className="plp-hero-title">SẢN PHẨM</h1>
          <div className="plp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Sản phẩm</span>
          </div>
        </div>
      </div>

      <main className="plp-main container">
        {/* ── LAYOUT: sidebar + content ── */}
        <div className="plp-layout">

          {/* ════ SIDEBAR ════ */}
          <aside className="plp-sidebar">

            {/* Danh mục */}
            <div className="sb-block">
              <div className="sb-title">DANH MỤC</div>
              <div className="sb-ornament">✦</div>
              <ul className="sb-list">
                {CATEGORIES.map(c => (
                  <li key={c.name}
                    className={`sb-item ${activeCategory === c.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === c.name ? '' : c.name)}
                  >
                    <span className="sb-item-name">{c.name}</span>
                    <span className="sb-item-count">({c.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phong cách */}
            <div className="sb-block">
              <div className="sb-title">PHONG CÁCH</div>
              <div className="sb-ornament">✦</div>
              <ul className="sb-list">
                {STYLES.map(s => (
                  <li key={s.name}
                    className={`sb-item ${activeStyles.includes(s.name) ? 'active' : ''}`}
                    onClick={() => toggleStyle(s.name)}
                  >
                    <span className="sb-checkbox">{activeStyles.includes(s.name) ? '☑' : '☐'}</span>
                    <span className="sb-item-name">{s.name}</span>
                    <span className="sb-item-count">({s.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chất liệu */}
            <div className="sb-block">
              <div className="sb-title">CHẤT LIỆU</div>
              <div className="sb-ornament">✦</div>
              <ul className="sb-list">
                {MATERIALS.map(m => (
                  <li key={m.name}
                    className={`sb-item ${activeMaterials.includes(m.name) ? 'active' : ''}`}
                    onClick={() => toggleMaterial(m.name)}
                  >
                    <span className="sb-checkbox">{activeMaterials.includes(m.name) ? '☑' : '☐'}</span>
                    <span className="sb-item-name">{m.name}</span>
                    <span className="sb-item-count">({m.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Khoảng giá */}
            <div className="sb-block">
              <div className="sb-title">KHOẢNG GIÁ</div>
              <div className="sb-ornament">✦</div>
              <div className="sb-price-slider">
                <div className="sb-price-track">
                  <div className="sb-price-fill" />
                </div>
                <div className="sb-price-labels">
                  <span>5.000.000 đ</span>
                  <span>200.000.000 đ</span>
                </div>
              </div>
              <ul className="sb-list" style={{ marginTop: 12 }}>
                {PRICE_RANGES.map((r, i) => (
                  <li key={i}
                    className={`sb-item ${activePriceRange === i ? 'active' : ''}`}
                    onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
                  >
                    <span className="sb-checkbox">{activePriceRange === i ? '☑' : '☐'}</span>
                    <span className="sb-item-name">{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Màu sắc */}
            <div className="sb-block">
              <div className="sb-title">MÀU SẮC</div>
              <div className="sb-ornament">✦</div>
              <div className="sb-colors">
                {COLORS.map(c => (
                  <button key={c}
                    className={`sb-color ${activeColor === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setActiveColor(activeColor === c ? '' : c)}
                  />
                ))}
              </div>
            </div>

            {/* Xóa bộ lọc */}
            {hasFilter && (
              <button className="sb-clear" onClick={clearAll}>✕ Xóa bộ lọc</button>
            )}
          </aside>

          {/* ════ CONTENT ════ */}
          <div className="plp-content">

            {/* Toolbar */}
            <div className="plp-toolbar">
              <div className="plp-toolbar-left">
                <span className="plp-count">
                  Hiển thị {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} trong tổng số <strong>{filtered.length}</strong> sản phẩm
                </span>
              </div>

              {/* Category quick tabs */}
              <div className="plp-tabs">
                <button className={`plp-tab ${!activeCategory ? 'active' : ''}`} onClick={() => setActiveCategory('')}>Tất cả</button>
                {CATEGORIES.slice(0, 5).map(c => (
                  <button key={c.name}
                    className={`plp-tab ${activeCategory === c.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === c.name ? '' : c.name)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="plp-toolbar-right">
                <div className="plp-search-box">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Search size={16} />
                </div>
                <div className="plp-sort">
                  <span>Sắp xếp:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {paginated.length === 0 ? (
              <div className="plp-empty">
                <div className="plp-empty-icon">🪑</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                <button className="plp-btn-gold" onClick={clearAll}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="plp-grid">
                {paginated.map((p, idx) => (
                  <div key={p.id} className="plp-card" style={{ animationDelay: `${idx * 0.07}s` }}>
                    {/* Badge */}
                    {p.badge && (
                      <div className="plp-badge" style={BADGE_STYLE[p.badge]}>{p.badge}</div>
                    )}

                    {/* Image */}
                    <div className="plp-card-img">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <div className="plp-card-overlay">
                        <Link to={`/products/${p.id}`} className="plp-overlay-btn">
                          <Eye size={16} /> Xem chi tiết
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="plp-card-body">
                      <h3 className="plp-card-name">{p.name}</h3>
                      <p className="plp-card-sub">{p.subtitle}</p>
                      <div className="plp-card-price">{formatCurrency(p.price)}</div>

                      <div className="plp-card-actions">
                        <Link to={`/products/${p.id}`} className="plp-btn-detail">
                          XEM CHI TIẾT
                        </Link>
                        <button
                          className={`plp-icon-btn ${favorites[p.id] ? 'active' : ''}`}
                          onClick={() => toggleFav(p.id)}
                          title="Yêu thích"
                        >
                          <Heart size={16} fill={favorites[p.id] ? 'currentColor' : 'none'} />
                        </button>
                        <Link to={`/compare?add=${p.id}`} className="plp-icon-btn" title="So sánh">
                          <Scale size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="plp-pagination">
                <button
                  className="plp-page-btn nav"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`plp-page-btn ${page === n ? 'active' : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}

                {totalPages > 5 && <span className="plp-page-dots">...</span>}
                {totalPages > 5 && (
                  <button
                    className={`plp-page-btn ${page === totalPages ? 'active' : ''}`}
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  className="plp-page-btn nav"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA BANNER ── */}
        <div className="plp-cta">
          <div className="plp-cta-left">
            <div className="plp-cta-icon"><Phone size={28} /></div>
            <div>
              <div className="plp-cta-title">CẦN TƯ VẤN LỰA CHỌN SẢN PHẨM?</div>
              <div className="plp-cta-sub">Liên hệ chuyên viên của Lavish Heritage</div>
            </div>
          </div>
          <a href="tel:02838228888" className="plp-cta-btn">
            LIÊN HỆ NGAY →
          </a>
        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default ProductListPage;
