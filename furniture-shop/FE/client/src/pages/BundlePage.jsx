import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, X, ShoppingCart, Download, ChevronLeft, ChevronRight,
  Sofa, Lamp, Phone, ArrowRight, Sparkles
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { formatCurrency } from '../utils/currency.util';
import './BundlePage.css';

/* ── Mock data ── */
const ALL_PRODUCTS = [
  { id: 1,  name: 'Ghế Bành Louis XV',         subtitle: 'Sang trọng · Tinh tế · Quyền uy tuyệt đối', price: 24800000,  image: '/images/anhghebandenkh.png',  category: 'Ghế bành' },
  { id: 2,  name: 'Đèn Bàn Imperial',           subtitle: 'Ánh sáng ấm áp · Quý phái · Đẳng cấp',     price: 18900000,  image: '/images/anhbanandai.png',     category: 'Đèn trang trí' },
  { id: 3,  name: 'Sofa Heritage Royale',        subtitle: 'Kiệt tác phòng khách đẳng cấp',             price: 78500000,  image: '/images/anhghesofa.png',      category: 'Sofa' },
  { id: 4,  name: 'Bàn Trà Heritage',            subtitle: 'Hài hòa · Tinh tế · Đặc sắc',              price: 29800000,  image: '/images/anhbanan.png',        category: 'Bàn' },
  { id: 5,  name: 'Bàn Console Majestic',        subtitle: 'Tinh xảo trong từng chi tiết',              price: 62000000,  image: '/images/anhbanghekh.png',     category: 'Bàn console' },
  { id: 6,  name: 'Giường Imperial Majesty',     subtitle: 'Giấc ngủ hoàng gia đích thực',              price: 98000000,  image: '/images/anhgiuong.png',       category: 'Giường' },
  { id: 7,  name: 'Giường Trang Trí Imperial',   subtitle: 'Phẩm chuẩn về đẳng cấp sống',              price: 16500000,  image: '/images/anhgiuonghaiden.png', category: 'Giường' },
  { id: 8,  name: 'Bàn Ăn Grand Palace',         subtitle: 'Kiệt tác dành cho không gian đẳng cấp',    price: 125000000, image: '/images/anhbobanghe.png',     category: 'Bàn ăn' },
];

const BUNDLE_SUGGESTIONS = [
  {
    id: 1,
    product1: ALL_PRODUCTS[0],
    product2: ALL_PRODUCTS[3],
    label: 'Sofa Heritage + Bàn Trà Heritage',
    combinedImage: '/images/noi_that_01_hang1_cot1.png',
  },
  {
    id: 2,
    product1: ALL_PRODUCTS[4],
    product2: ALL_PRODUCTS[5],
    label: 'Bàn Console Majestic + Giường Imperial',
    combinedImage: '/images/noi_that_02_hang1_cot2.png',
  },
  {
    id: 3,
    product1: ALL_PRODUCTS[5],
    product2: ALL_PRODUCTS[1],
    label: 'Giường Imperial + Đèn Bàn Imperial',
    combinedImage: '/images/noi_that_03_hang1_cot3.png',
  },
];

const STEPS = [
  { icon: '🪑', label: '1. Chọn Sản Phẩm 1', desc: 'Lựa chọn sản phẩm đầu tiên bạn yêu thích' },
  { icon: '💡', label: '2. Chọn Sản Phẩm 2', desc: 'Chọn sản phẩm thứ hai để kết hợp' },
  { icon: '✨', label: '3. Tạo Ảnh Kết Hợp', desc: 'Hệ thống AI tạo phối cảnh hài hòa cho bạn' },
  { icon: '🛒', label: '4. Lưu Hoặc Mua Ngay', desc: 'Lưu ảnh hoặc thêm cả hai vào giỏ hàng' },
];

/* ── Dropdown chọn sản phẩm ── */
const ProductSelector = ({ label, selected, onSelect, onClear, exclude }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = ALL_PRODUCTS.filter(p =>
    p.id !== exclude?.id &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bp-slot">
      <div className="bp-slot-label">{label}</div>

      {selected ? (
        <div className="bp-slot-card">
          <button className="bp-slot-clear" onClick={onClear}><X size={16} /></button>
          <div className="bp-slot-img">
            <img src={selected.image} alt={selected.name} />
          </div>
          <div className="bp-slot-info">
            <h3>{selected.name}</h3>
            <p>{selected.subtitle}</p>
            <div className="bp-slot-price">{formatCurrency(selected.price)}</div>
          </div>
        </div>
      ) : (
        <div className="bp-slot-empty" onClick={() => setOpen(true)}>
          <div className="bp-slot-plus"><Plus size={32} /></div>
          <p>Nhấn để chọn sản phẩm</p>
        </div>
      )}

      {/* Dropdown */}
      <div className="bp-slot-footer">
        <div className="bp-slot-select-wrap" ref={ref}>
          <button
            className="bp-select-btn"
            onClick={() => setOpen(v => !v)}
          >
            <span>🪑</span>
            {selected ? selected.name : 'Chọn sản phẩm'}
            <span className="bp-select-arrow">{open ? '▲' : '▼'}</span>
          </button>

          {open && (
            <div className="bp-dropdown">
              <div className="bp-dropdown-search">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="bp-dropdown-list">
                {filtered.length === 0 ? (
                  <div className="bp-dropdown-empty">Không tìm thấy sản phẩm</div>
                ) : filtered.map(p => (
                  <div
                    key={p.id}
                    className={`bp-dropdown-item ${selected?.id === p.id ? 'active' : ''}`}
                    onClick={() => { onSelect(p); setOpen(false); setSearch(''); }}
                  >
                    <img src={p.image} alt={p.name} />
                    <div>
                      <div className="bp-di-name">{p.name}</div>
                      <div className="bp-di-price">{formatCurrency(p.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="bp-slot-icon-btn" title="Xem chi tiết">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BundlePage = () => {
  const [product1, setProduct1] = useState(ALL_PRODUCTS[0]);
  const [product2, setProduct2] = useState(ALL_PRODUCTS[1]);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [suggPage, setSuggPage] = useState(0);

  const handleGenerate = () => {
    if (!product1 || !product2) {
      alert('Vui lòng chọn đủ 2 sản phẩm!');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const handleAddBoth = () => {
    if (!product1 || !product2) return;
    alert(`Đã thêm vào giỏ hàng:\n• ${product1.name}\n• ${product2.name}`);
  };

  const totalPrice = (product1?.price || 0) + (product2?.price || 0);

  const SUGG_PER_PAGE = 3;
  const visibleSugg = BUNDLE_SUGGESTIONS.slice(
    suggPage * SUGG_PER_PAGE,
    suggPage * SUGG_PER_PAGE + SUGG_PER_PAGE
  );

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="bp-main">

        {/* ── HERO ── */}
        <div className="bp-hero">
          <div className="bp-hero-overlay" />
          <div className="bp-hero-content container">
            <div className="bp-hero-left">
              <h1 className="bp-hero-title">KẾT HỢP SẢN PHẨM</h1>
              <nav className="bp-breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                <span>Kết hợp sản phẩm</span>
              </nav>
              <p className="bp-hero-desc">
                Chọn 2 sản phẩm yêu thích và tạo nên một không gian phối hợp hài hòa theo phong cách Lavish Heritage.
              </p>
            </div>
          </div>
        </div>

        <div className="container">

          {/* ══════════════════════════════════
              PRODUCT SELECTOR SECTION
          ══════════════════════════════════ */}
          <div className="bp-selector-section">
            <div className="bp-selector-grid">
              {/* Product 1 */}
              <ProductSelector
                label="SẢN PHẨM 1"
                selected={product1}
                onSelect={setProduct1}
                onClear={() => setProduct1(null)}
                exclude={product2}
              />

              {/* Center connector */}
              <div className="bp-connector">
                <div className="bp-connector-line" />
                <div className="bp-connector-circle">
                  <Plus size={24} />
                </div>
                <div className="bp-connector-arrow">→</div>
                <div className="bp-connector-line" />
              </div>

              {/* Product 2 */}
              <ProductSelector
                label="SẢN PHẨM 2"
                selected={product2}
                onSelect={setProduct2}
                onClear={() => setProduct2(null)}
                exclude={product1}
              />
            </div>

            {/* Generate button */}
            <div className="bp-generate-wrap">
              <div className="bp-generate-hint">Bước 3: Hệ thống tạo ảnh phối cảnh</div>
              <button
                className={`bp-generate-btn ${generating ? 'loading' : ''}`}
                onClick={handleGenerate}
                disabled={!product1 || !product2 || generating}
              >
                {generating ? (
                  <><span className="bp-spinner" /> Đang tạo ảnh kết hợp...</>
                ) : (
                  <><Sparkles size={20} /> TẠO ẢNH KẾT HỢP</>
                )}
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════
              GENERATED IMAGE SECTION
          ══════════════════════════════════ */}
          <div className={`bp-result-section ${generated ? 'visible' : ''}`}>
            <div className="bp-result-title-row">
              <div className="bp-ornament-line" />
              <h2 className="bp-result-title">ẢNH KẾT HỢP ĐƯỢC TẠO</h2>
              <div className="bp-ornament-line" />
            </div>

            <div className="bp-result-wrap">
              {/* AI badge */}
              <div className="bp-ai-badge">
                <span>✨</span> KẾT QUẢ AI<br />
                <small>PHỐI CẢNH TẠO TỰ ĐỘNG</small>
              </div>

              {/* Combined image */}
              <div className="bp-result-img">
                {generated ? (
                  <img
                    src="/images/noi_that_04_hang1_cot4.png"
                    alt="Ảnh kết hợp"
                    className="bp-result-photo"
                  />
                ) : (
                  <div className="bp-result-placeholder">
                    <div className="bp-result-placeholder-icon">🖼️</div>
                    <p>Chọn 2 sản phẩm và nhấn<br />"Tạo ảnh kết hợp" để xem kết quả</p>
                  </div>
                )}

                {/* Overlay product tags */}
                {generated && product1 && (
                  <div className="bp-img-tag left">
                    <img src={product1.image} alt={product1.name} />
                    <span>{product1.name}</span>
                  </div>
                )}
                {generated && product2 && (
                  <div className="bp-img-tag right">
                    <img src={product2.image} alt={product2.name} />
                    <span>{product2.name}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {generated && (
                <div className="bp-result-actions">
                  <button className="bp-btn-save">
                    <Download size={18} /> LƯU ẢNH
                  </button>
                  <button className="bp-btn-add-both" onClick={handleAddBoth}>
                    <ShoppingCart size={18} />
                    THÊM CẢ HAI VÀO GIỎ
                    {totalPrice > 0 && (
                      <span className="bp-total-price">{formatCurrency(totalPrice)}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════
              HOW IT WORKS
          ══════════════════════════════════ */}
          <div className="bp-steps-section">
            <div className="bp-steps-grid">
              {STEPS.map((step, i) => (
                <div key={i} className="bp-step" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="bp-step-icon">{step.icon}</div>
                  <div className="bp-step-label">{step.label}</div>
                  <div className="bp-step-desc">{step.desc}</div>
                  {i < STEPS.length - 1 && <div className="bp-step-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════
              BUNDLE SUGGESTIONS
          ══════════════════════════════════ */}
          <div className="bp-suggestions-section">
            <div className="bp-ornament-row">
              <div className="bp-ornament-line" />
              <span className="bp-ornament-text">✦ GỢI Ý KẾT HỢP KHÁC ✦</span>
              <div className="bp-ornament-line" />
            </div>

            <div className="bp-sugg-slider">
              <button
                className="bp-sugg-nav"
                onClick={() => setSuggPage(p => Math.max(0, p - 1))}
                disabled={suggPage === 0}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="bp-sugg-grid">
                {BUNDLE_SUGGESTIONS.map((bundle, idx) => (
                  <div key={bundle.id} className="bp-sugg-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    {/* Combined preview */}
                    <div className="bp-sugg-imgs">
                      <div className="bp-sugg-img">
                        <img src={bundle.product1.image} alt={bundle.product1.name} />
                      </div>
                      <div className="bp-sugg-plus">+</div>
                      <div className="bp-sugg-img">
                        <img src={bundle.product2.image} alt={bundle.product2.name} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bp-sugg-info">
                      <div className="bp-sugg-names">
                        <span>{bundle.product1.name}</span>
                        <span className="bp-sugg-sep">+</span>
                        <span>{bundle.product2.name}</span>
                      </div>
                      <div className="bp-sugg-prices">
                        <span>{formatCurrency(bundle.product1.price)}</span>
                        <span className="bp-sugg-sep">+</span>
                        <span>{formatCurrency(bundle.product2.price)}</span>
                      </div>
                    </div>

                    <button
                      className="bp-sugg-try-btn"
                      onClick={() => {
                        setProduct1(bundle.product1);
                        setProduct2(bundle.product2);
                        setGenerated(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      THỬ KẾT HỢP
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="bp-sugg-nav"
                onClick={() => setSuggPage(p => p + 1)}
                disabled={(suggPage + 1) * SUGG_PER_PAGE >= BUNDLE_SUGGESTIONS.length}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ── CTA Banner ── */}
          <div className="bp-cta">
            <div className="bp-cta-left">
              <div className="bp-cta-icon"><Phone size={28} /></div>
              <div>
                <div className="bp-cta-title">CẦN TƯ VẤN KẾT HỢP SẢN PHẨM?</div>
                <div className="bp-cta-sub">Đội ngũ chuyên gia của Lavish Heritage luôn sẵn hỗ trợ bạn.</div>
              </div>
            </div>
            <a href="tel:02838228888" className="bp-cta-btn">
              LIÊN HỆ NGAY →
            </a>
          </div>

        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default BundlePage;
