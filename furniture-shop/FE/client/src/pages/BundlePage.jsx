import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, X, ShoppingCart, Download, ChevronLeft, ChevronRight,
  Phone, ArrowRight, Sparkles
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import { productApi } from '../apis/product.api';
import './BundlePage.css';

const STEPS = [
  { icon: '🪑', label: '1. Chọn Sản Phẩm 1', desc: 'Lựa chọn sản phẩm đầu tiên bạn yêu thích' },
  { icon: '💡', label: '2. Chọn Sản Phẩm 2', desc: 'Chọn sản phẩm thứ hai để kết hợp' },
  { icon: '✨', label: '3. Tạo Ảnh Kết Hợp', desc: 'Hệ thống AI tạo phối cảnh hài hòa cho bạn' },
  { icon: '🛒', label: '4. Lưu Hoặc Mua Ngay', desc: 'Lưu ảnh hoặc thêm cả hai vào giỏ hàng' },
];

/* ── Dropdown chọn sản phẩm ── */
const ProductSelector = ({ label, selected, onSelect, onClear, exclude, products }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = products.filter(p =>
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
            <img src={getImageUrl(selected.image)} alt={selected.name} />
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
                    <img src={getImageUrl(p.image)} alt={p.name} />
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

/* ── Lấy tên file từ path, dùng để tìm ảnh images_nen ── */
const getBaseFileName = (imagePath) => {
  if (!imagePath) return '';
  return imagePath.split('/').pop(); // /images/sofa-heritage-royale.png → sofa-heritage-royale.png
};

/* ── Main Page ── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BundlePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [combinedImageUrl, setCombinedImageUrl] = useState(null);
  const [generateStatus, setGenerateStatus] = useState('');
  const [suggPage, setSuggPage] = useState(0);

  // Fetch danh sách sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await productApi.getAll();
        if (res?.success && Array.isArray(res.data?.products)) {
          const mapped = res.data.products.map(p => ({
            id: p.id,
            name: p.name,
            subtitle: p.description || '',
            price: p.price || 0,
            image: p.image || '',
            category: p.category || '',
          }));
          setAllProducts(mapped);
          // Chọn sẵn 2 sản phẩm đầu tiên
          if (mapped.length > 0) setProduct1(mapped[0]);
          if (mapped.length > 1) setProduct2(mapped[1]);
        }
      } catch (err) {
        console.error('[BundlePage] Lỗi fetch sản phẩm:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  /* ── Ghép 2 sản phẩm vào cùng 1 khung phòng nội thất ── */
  const generateCanvasImage = useCallback((p1, p2) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const W = 1200, H = 650;
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Load ảnh với fallback
      const loadImg = (src, fallback) => new Promise((res) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => res(img);
        img.onerror = () => {
          if (fallback && fallback !== src) {
            const img2 = new Image();
            img2.crossOrigin = 'anonymous';
            img2.onload = () => res(img2);
            img2.onerror = () => res(null);
            img2.src = fallback;
          } else {
            res(null);
          }
        };
        img.src = src;
      });

      const bgImages = [
        '/images/noi_that_cao_cap_boi_canh_01.png',
        '/images/noi_that_cao_cap_boi_canh_02.png',
        '/images/noi_that_cao_cap_boi_canh_03.png',
        '/images/noi_that_cao_cap_boi_canh_05.png',
      ];
      const bgSrc = bgImages[Math.floor(Math.random() * bgImages.length)];

      // Ảnh images_nen (trong suốt) ưu tiên hơn, fallback về ảnh gốc
      const src1 = p1.image;
      const src2 = p2.image;
      const fb1 = p1.imageFallback ? getImageUrl(p1.imageFallback) : getImageUrl(p1.image);
      const fb2 = p2.imageFallback ? getImageUrl(p2.imageFallback) : getImageUrl(p2.image);

      Promise.all([loadImg(bgSrc, null), loadImg(src1, fb1), loadImg(src2, fb2)])
        .then(([bgImg, img1, img2]) => {

          // 1. Vẽ nền phòng full canvas (cover)
          if (bgImg) {
            const scale = Math.max(W / bgImg.width, H / bgImg.height);
            const bw = bgImg.width * scale, bh = bgImg.height * scale;
            ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
          } else {
            const bg = ctx.createLinearGradient(0, 0, W, H);
            bg.addColorStop(0, '#1a1008');
            bg.addColorStop(1, '#2e1e0e');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);
          }

          // 2. Overlay nhẹ để sản phẩm nổi bật trên nền
          ctx.fillStyle = 'rgba(10, 5, 0, 0.22)';
          ctx.fillRect(0, 0, W, H);

          // 3. Hàm vẽ sản phẩm với bóng đổ tự nhiên (không viền/khung)
          const drawProduct = (img, cx, bottomY, maxW, maxH) => {
            if (!img) return;
            const scale = Math.min(maxW / img.width, maxH / img.height);
            const sw = img.width * scale;
            const sh = img.height * scale;
            const sx = cx - sw / 2;
            const sy = bottomY - sh;

            // Bóng đổ mềm
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.50)';
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 8;
            ctx.shadowOffsetY = 18;
            ctx.drawImage(img, sx, sy, sw, sh);
            ctx.restore();

            // Bóng phản chiếu mờ trên sàn
            ctx.save();
            ctx.globalAlpha = 0.10;
            ctx.translate(0, bottomY * 2);
            ctx.scale(1, -0.25);
            ctx.drawImage(img, sx, sy, sw, sh);
            ctx.restore();
          };

          // SP1 lớn bên trái, SP2 nhỏ hơn bên phải — cùng đường sàn
          const bottomLine = H * 0.92;
          drawProduct(img1, W * 0.33, bottomLine, W * 0.46, H * 0.80);
          drawProduct(img2, W * 0.73, bottomLine - H * 0.04, W * 0.30, H * 0.56);

          // 4. Watermark góc dưới phải
          ctx.save();
          ctx.globalAlpha = 0.50;
          ctx.fillStyle = '#c9973a';
          ctx.font = '600 12px serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText('✦ LAVISH HERITAGE', W - 18, H - 14);
          ctx.restore();

          resolve(canvas.toDataURL('image/png'));
        })
        .catch(reject);
    });
  }, []);

  /* ── Tạo ảnh: gọi BE AI (gửi productId), fallback Canvas dùng ảnh images_nen ── */
  const handleGenerate = async () => {
    if (!product1 || !product2) {
      alert('Vui lòng chọn đủ 2 sản phẩm!');
      return;
    }
    setGenerating(true);
    setGenerated(false);
    setCombinedImageUrl(null);
    setGenerateStatus('🤖 Đang tạo ảnh AI... (20-40 giây)');

    // Gọi BE: gửi productId để BE tự lấy thông tin từ DB
    try {
      const res = await fetch(`${API_BASE}/ai/bundle-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId1: product1.id,
          productId2: product2.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.imageUrl) {
        setCombinedImageUrl(data.imageUrl);
        setGenerated(true);
        setGenerateStatus('✨ AI đã tạo ảnh thành công!');
        setGenerating(false);
        return;
      }
      console.warn('[AI] fallback:', data.message);
      setGenerateStatus('⚠️ AI chưa sẵn sàng — đang ghép ảnh thủ công...');
    } catch (e) {
      console.warn('[AI] error, fallback canvas:', e.message);
      setGenerateStatus('⚠️ Không kết nối AI — đang ghép ảnh thủ công...');
    }

    // Fallback Canvas: ưu tiên dùng ảnh images_nen (trong suốt) nếu có
    try {
      const p1WithNen = {
        ...product1,
        image: `/images_nen/${getBaseFileName(product1.image)}` ,
        imageFallback: product1.image,
      };
      const p2WithNen = {
        ...product2,
        image: `/images_nen/${getBaseFileName(product2.image)}`,
        imageFallback: product2.image,
      };
      const url = await generateCanvasImage(p1WithNen, p2WithNen);
      setCombinedImageUrl(url);
      setGenerated(true);
      setGenerateStatus('🖼️ Ảnh ghép hoàn thành');
    } catch (e) {
      alert('Không thể tạo ảnh. Vui lòng thử lại.');
      setGenerateStatus('');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveImage = () => {
    if (!combinedImageUrl) return;
    const a = document.createElement('a');
    a.href = combinedImageUrl;
    a.download = `ket-hop-${(product1?.name || 'sp1')}-${(product2?.name || 'sp2')}.png`
      .replace(/\s+/g, '-');
    a.click();
  };

  const handleAddBoth = () => {
    if (!product1 || !product2) return;
    alert(`Đã thêm vào giỏ hàng:\n• ${product1.name}\n• ${product2.name}`);
  };

  const totalPrice = (product1?.price || 0) + (product2?.price || 0);

  const SUGG_PER_PAGE = 3;

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
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Đang tải danh sách sản phẩm...
              </div>
            ) : (
            <div className="bp-selector-grid">
              {/* Product 1 */}
              <ProductSelector
                label="SẢN PHẨM 1"
                selected={product1}
                onSelect={setProduct1}
                onClear={() => setProduct1(null)}
                exclude={product2}
                products={allProducts}
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
                products={allProducts}
              />
            </div>
            )}

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
              {generateStatus && (
                <div className="bp-generate-status">{generateStatus}</div>
              )}
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
                {generated && combinedImageUrl ? (
                  <img
                    src={combinedImageUrl}
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
                    <img src={getImageUrl(product1.image)} alt={product1.name} />
                    <span>{product1.name}</span>
                  </div>
                )}
                {generated && product2 && (
                  <div className="bp-img-tag right">
                    <img src={getImageUrl(product2.image)} alt={product2.name} />
                    <span>{product2.name}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {generated && (
                <div className="bp-result-actions">
                  <button className="bp-btn-save" onClick={handleSaveImage}>
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
                {allProducts.length >= 2 &&
                  (() => {
                    // Tạo gợi ý động từ các cặp sản phẩm thực tế
                    const suggestions = [];
                    for (let i = 0; i < allProducts.length - 1 && suggestions.length < 6; i += 2) {
                      suggestions.push({ id: i, product1: allProducts[i], product2: allProducts[i + 1] });
                    }
                    const paginated = suggestions.slice(suggPage * SUGG_PER_PAGE, (suggPage + 1) * SUGG_PER_PAGE);
                    return paginated.map((bundle, idx) => (
                      <div key={bundle.id} className="bp-sugg-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="bp-sugg-imgs">
                          <div className="bp-sugg-img">
                            <img src={getImageUrl(bundle.product1.image)} alt={bundle.product1.name} />
                          </div>
                          <div className="bp-sugg-plus">+</div>
                          <div className="bp-sugg-img">
                            <img src={getImageUrl(bundle.product2.image)} alt={bundle.product2.name} />
                          </div>
                        </div>
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
                    ));
                  })()
                }
              </div>

              <button
                className="bp-sugg-nav"
                onClick={() => setSuggPage(p => p + 1)}
                disabled={(suggPage + 1) * SUGG_PER_PAGE >= Math.floor(allProducts.length / 2)}
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
