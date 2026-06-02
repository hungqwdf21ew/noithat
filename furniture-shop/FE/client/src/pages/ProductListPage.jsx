import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Heart, Scale, Eye, ChevronRight, ChevronLeft, Phone } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useFavorites } from '../hooks/useFavorites';
import { useCompare } from '../hooks/useCompare';
import { formatCurrency } from '../utils/currency.util';
import productApi from '../apis/product.api';
import { getImageUrl } from '../helpers/image.helper';
import './ProductListPage.css';

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

const ROOMS = [
  { name: 'Phòng khách', count: 0 },
  { name: 'Phòng ngủ', count: 0 },
  { name: 'Phòng bếp', count: 0 },
  { name: 'Phòng làm việc', count: 0 },
  { name: 'Ban công', count: 0 },
];


const PRICE_RANGES = [
  { label: 'Dưới 20 triệu', min: 0, max: 20000000 },
  { label: '20 – 50 triệu', min: 20000000, max: 50000000 },
  { label: '50 – 100 triệu', min: 50000000, max: 100000000 },
  { label: 'Trên 100 triệu', min: 100000000, max: Infinity },
];

const COLORS = ['#3d1a0a', '#7a3b1e', '#c9973a', '#e8c068', '#d4c5a9', '#6b6b6b', '#2a2a2a'];

const COLOR_MAP = {
  '#3d1a0a': ['nâu', 'gỗ'],
  '#7a3b1e': ['nâu', 'gỗ'],
  '#c9973a': ['vàng', 'đồng'],
  '#e8c068': ['vàng', 'đồng'],
  '#d4c5a9': ['trắng', 'kem'],
  '#6b6b6b': ['xám', 'ghi'],
  '#2a2a2a': ['đen']
};


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

const getSecondaryImage = (p) => {
  if (p.gallery && p.gallery.length > 0) {
    return p.gallery[0];
  }
  
  const name = p.name ? p.name.toLowerCase() : '';
  const mainImg = p.image ? p.image.toLowerCase() : '';
  
  if (name.includes('sofa') || mainImg.includes('sofa')) {
    if (name.includes('cong') || mainImg.includes('cong')) return '/images/sofacong_ct_mausapphire.png';
    return '/images/sofabo.png';
  }
  if (name.includes('giường') || mainImg.includes('giuong')) {
    return '/images/giuongngu_ct_maube_1.png';
  }
  if (name.includes('bàn') || mainImg.includes('ban')) {
    if (name.includes('ăn')) return '/images/banantancodien_ct_mauvangdong_12.png';
    return '/images/bantron_ct_maube_11.png';
  }
  if (name.includes('ghế') || mainImg.includes('ghe')) {
    return '/images/ghebanh_ct_maudo_1.png';
  }
  if (name.includes('tủ') || mainImg.includes('tu')) {
    return '/images/tuda_ct_maube_1.png';
  }
  if (name.includes('đèn') || mainImg.includes('den')) {
    return '/images/dendung_1.png';
  }
  
  return '/images/noi_that_cao_cap_boi_canh_02.png';
};

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchParams, searchSetParams] = useSearchParams();
  const [search, setSearch]           = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeStyles, setActiveStyles]     = useState([]);
  const [activeMaterials, setActiveMaterials] = useState([]);
  const [activeRooms, setActiveRooms]       = useState([]);
  const [activePriceRange, setActivePriceRange] = useState(null);
  const [activeColor, setActiveColor]       = useState('');
  const [sortBy, setSortBy]                 = useState('newest');
  const [page, setPage]                     = useState(1);
  const { isFavorite, toggleFavorite }      = useFavorites();
  const { addToCompare }                    = useCompare();
  const PER_PAGE = 9;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState(STYLES);
  const [materials, setMaterials] = useState(MATERIALS);
  const [rooms, setRooms] = useState(ROOMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await productApi.getAll();
        if (res.success) {
          const fetchedProducts = res.data.products;
          setProducts(fetchedProducts);
          
          // Calculate category counts
          const catMap = res.data.categories.map(c => {
            const count = fetchedProducts.filter(p => p.categoryId === c.id).length;
            return { name: c.name, id: c.id, count };
          });
          setCategories(catMap);

          // Dynamically calculate style counts from database products
          const styleMap = STYLES.map(s => {
            const count = fetchedProducts.filter(p => p.style && (p.style.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(p.style.toLowerCase()) || (s.name === 'Cổ điển châu Âu' && p.style.toLowerCase().includes('cổ điển')))).length;
            return { ...s, count };
          });
          setStyles(styleMap);

          // Dynamically calculate material counts from database products
          const materialMap = MATERIALS.map(m => {
            const count = fetchedProducts.filter(p => p.material && (p.material.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(p.material.toLowerCase()) || (m.name === 'Gỗ tự nhiên' && p.material.toLowerCase().includes('gỗ')) || (m.name === 'Da thật' && p.material.toLowerCase().includes('da')) || (m.name === 'Vải cao cấp' && p.material.toLowerCase().includes('vải')))).length;
            return { ...m, count };
          });
          setMaterials(materialMap);

          // Dynamically calculate room counts from database products
          const roomMap = ROOMS.map(r => {
            const count = fetchedProducts.filter(p => p.room && p.room.toLowerCase().includes(r.name.toLowerCase())).length;
            return { ...r, count };
          });
          setRooms(roomMap);
        }
      } catch (err) {
        console.error('Error loading live products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync search, category and room from URL query parameters
  useEffect(() => {
    const queryVal = searchParams.get('search');
    if (queryVal !== null) {
      setSearch(queryVal);
    }
    const catVal = searchParams.get('category');
    if (catVal !== null) {
      setActiveCategory(catVal);
    }
    const roomVal = searchParams.get('room');
    if (roomVal !== null) {
      setActiveRooms([roomVal]);
    }
  }, [searchParams]);


  /* ── Filter logic ── */
  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory && p.category !== activeCategory) return false;
    
    // Substring partial-matching for Style (e.g. "Cổ điển châu Âu" matches "Cổ điển")
    if (activeStyles.length && !activeStyles.some(s => p.style && (p.style.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(p.style.toLowerCase()) || (s === 'Cổ điển châu Âu' && p.style.toLowerCase().includes('cổ điển'))))) return false;
    
    // Substring partial-matching for Material (e.g. "Gỗ tự nhiên" matches "Gỗ MDF" or "Gỗ cao su")
    if (activeMaterials.length && !activeMaterials.some(m => p.material && (p.material.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(p.material.toLowerCase()) || (m === 'Gỗ tự nhiên' && p.material.toLowerCase().includes('gỗ')) || (m === 'Da thật' && p.material.toLowerCase().includes('da')) || (m === 'Vải cao cấp' && p.material.toLowerCase().includes('vải'))))) return false;
    
    // Substring partial-matching for Room (e.g. "Phòng khách" matches "Phòng khách")
    if (activeRooms.length && !activeRooms.some(r => p.room && p.room.toLowerCase().includes(r.toLowerCase()))) return false;

    // Filter by Color matching Hex code from UI to Vietnamese substrings in CSDL
    if (activeColor) {
      const allowedKeywords = COLOR_MAP[activeColor];
      if (allowedKeywords) {
        const matchesColor = p.color && allowedKeywords.some(keyword => p.color.toLowerCase().includes(keyword));
        if (!matchesColor) return false;
      }
    }

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
  const toggleRoom     = r => setActiveRooms(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const clearAll = () => {
    setSearch(''); setActiveCategory(''); setActiveStyles([]);
    setActiveMaterials([]); setActiveRooms([]); setActivePriceRange(null); setActiveColor('');
  };

  useEffect(() => { setPage(1); }, [search, activeCategory, activeStyles, activeMaterials, activeRooms, activePriceRange]);

  const hasFilter = activeCategory || activeStyles.length || activeMaterials.length || activeRooms.length || activePriceRange !== null;

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
              <div className="sb-ornament">⚜ ──────── ⚜</div>
              <ul className="sb-list">
                {categories.map(c => (
                  <li key={c.name}
                    className={`sb-item ${activeCategory === c.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === c.name ? '' : c.name)}
                  >
                    <span className={`sb-classic-checkbox ${activeCategory === c.name ? 'checked' : ''}`}></span>
                    <span className="sb-item-name">{c.name}</span>
                    <span className="sb-item-count">({c.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phong cách */}
            <div className="sb-block">
              <div className="sb-title">PHONG CÁCH</div>
              <div className="sb-ornament">⚜ ──────── ⚜</div>
              <ul className="sb-list">
                {styles.map(s => (
                  <li key={s.name}
                    className={`sb-item ${activeStyles.includes(s.name) ? 'active' : ''}`}
                    onClick={() => toggleStyle(s.name)}
                  >
                    <span className={`sb-classic-checkbox ${activeStyles.includes(s.name) ? 'checked' : ''}`}></span>
                    <span className="sb-item-name">{s.name}</span>
                    <span className="sb-item-count">({s.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chất liệu */}
            <div className="sb-block">
              <div className="sb-title">CHẤT LIỆU</div>
              <div className="sb-ornament">⚜ ──────── ⚜</div>
              <ul className="sb-list">
                {materials.map(m => (
                  <li key={m.name}
                    className={`sb-item ${activeMaterials.includes(m.name) ? 'active' : ''}`}
                    onClick={() => toggleMaterial(m.name)}
                  >
                    <span className={`sb-classic-checkbox ${activeMaterials.includes(m.name) ? 'checked' : ''}`}></span>
                    <span className="sb-item-name">{m.name}</span>
                    <span className="sb-item-count">({m.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Không gian / Phòng */}
            <div className="sb-block">
              <div className="sb-title">KHÔNG GIAN</div>
              <div className="sb-ornament">⚜ ──────── ⚜</div>
              <ul className="sb-list">
                {rooms.map(r => (
                  <li key={r.name}
                    className={`sb-item ${activeRooms.includes(r.name) ? 'active' : ''}`}
                    onClick={() => toggleRoom(r.name)}
                  >
                    <span className={`sb-classic-checkbox ${activeRooms.includes(r.name) ? 'checked' : ''}`}></span>
                    <span className="sb-item-name">{r.name}</span>
                    <span className="sb-item-count">({r.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Khoảng giá */}
            <div className="sb-block">
              <div className="sb-title">KHOẢNG GIÁ</div>
              <div className="sb-ornament">⚜ ──────── ⚜</div>
              <div className="sb-price-slider">
                <div className="sb-price-track">
                  <div className="sb-price-fill" />
                </div>
                <div className="sb-price-labels">
                  <span>5.000.000 đ</span>
                  <span>200.000.000 đ</span>
                </div>
              </div>
              <div className="sb-price-grid">
                {PRICE_RANGES.map((r, i) => (
                  <button key={i}
                    className={`sb-price-btn ${activePriceRange === i ? 'active' : ''}`}
                    onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu sắc */}
            <div className="sb-block">
              <div className="sb-title">MÀU SẮC</div>
              <div className="sb-ornament">⚜ ──────── ⚜</div>
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
              <button className="sb-clear" onClick={clearAll}>Xóa bộ lọc ↻</button>
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
                {categories.slice(0, 5).map(c => (
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
                      <img className="plp-img-primary" src={getImageUrl(p.image)} alt={p.name} loading="lazy" />
                      <img className="plp-img-secondary" src={getImageUrl(getSecondaryImage(p))} alt={p.name} loading="lazy" />
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
                          type="button"
                          className={`plp-icon-btn ${isFavorite(p.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(p)}
                          title="Yêu thích"
                        >
                          <Heart size={16} fill={isFavorite(p.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className="plp-icon-btn"
                          title="So sánh"
                          onClick={() => {
                            addToCompare(p);
                            navigate('/compare');
                          }}
                        >
                          <Scale size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="plp-pagination-container">
                <span className="plp-pagination-ornament left">⚜ ──────</span>
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
                <span className="plp-pagination-ornament right">────── ⚜</span>
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
            LIÊN HỆ NGAY &gt;
          </a>
        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default ProductListPage;
