import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, ShoppingCart, Share2, Truck, Shield, Headphones,
  Star, ChevronLeft, ChevronRight, Minus, Plus, Scale, ZoomIn,
  Send, Edit2, CheckCircle, AlertCircle
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/currency.util';
import productApi from '../apis/product.api';
import { getImageUrl } from '../helpers/image.helper';
import { getToken } from '../helpers/storage.helper';
import './ProductDetailPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RELATED = [
  { id: 1,  name: 'Ghế Bành Heritage Royale', price: 29800000, image: '/images/anhghesofa.png' },
  { id: 3,  name: 'Ghế Bành Imperial',        price: 25800000, image: '/images/anhghebandenkh.png' },
  { id: 4,  name: 'Ghế Bành Grand Palace',    price: 26500000, image: '/images/anhbanghekh.png' },
  { id: 5,  name: 'Ghế Bành Royal Majesty',   price: 27300000, image: '/images/anhbobanghe.png' },
];

const getUrlOnly = (imgStr) => {
  if (!imgStr) return '';
  return imgStr.split('?color=')[0];
};

const getColorOnly = (imgStr) => {
  if (!imgStr) return '';
  const parts = imgStr.split('?color=');
  return parts[1] ? decodeURIComponent(parts[1]) : '';
};

const COLOR_MAP = {
  'xám': '#808080',
  'nâu': '#8B4513',
  'đen': '#1a1a1a',
  'trắng': '#FFFFFF',
  'vàng': '#DAA520',
  'xanh': '#4682B4',
  'đỏ': '#8B0000',
  'kem': '#FFFDD0',
  'gỗ': '#C19A6B',
  'mặc định': '#d4c5a9'
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg]         = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState('desc');
  const [showModal, setShowModal]         = useState(false);
  const [cartMsg, setCartMsg]             = useState('');

  // Review states
  const [reviews,        setReviews]        = useState([]);
  const [avgRating,      setAvgRating]      = useState(0);
  const [totalReviews,   setTotalReviews]   = useState(0);
  const [canReview,      setCanReview]      = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing,      setIsEditing]      = useState(false);
  const [reviewForm,     setReviewForm]     = useState({ soSao: 5, noiDung: '' });
  const [reviewMsg,      setReviewMsg]      = useState({ type: '', text: '' });
  const [submitting,     setSubmitting]     = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productApi.getById(id);
        if (res.success) {
          const raw = res.data;
          
          // Phân tách màu sắc nếu được ngăn cách bởi dấu phẩy
          const rawColors = raw.color ? raw.color.split(',').map(c => c.trim()) : ['Mặc định'];
          
          // Thu thập thêm màu sắc từ các ảnh gallery đã được gán màu
          const galleryColors = [];
          if (raw.gallery && Array.isArray(raw.gallery)) {
            raw.gallery.forEach(img => {
              const imgColor = getColorOnly(img);
              if (imgColor && !galleryColors.includes(imgColor)) {
                galleryColors.push(imgColor);
              }
            });
          }

          // Gộp chung các màu sắc độc bản (không trùng lặp)
          const allColors = [...rawColors];
          galleryColors.forEach(gc => {
            if (!allColors.some(ac => ac.toLowerCase() === gc.toLowerCase())) {
              allColors.push(gc);
            }
          });

          // Ánh xạ sang cấu trúc màu sắc có mã HEX tương ứng
          const mappedColors = allColors.map(c => {
            const lower = c.toLowerCase();
            let hex = '#d4c5a9'; // default
            for (const [key, value] of Object.entries(COLOR_MAP)) {
              if (lower.includes(key)) {
                hex = value;
                break;
              }
            }
            return { name: c, hex };
          });

          const mapped = {
            id: raw.id,
            name: raw.name,
            subtitle: raw.material || 'Tối giản & Đẳng cấp',
            price: raw.price,
            badge: raw.status === 'OUT_OF_STOCK' ? 'HẾT HÀNG' : '',
            category: raw.category,
            style: 'Hiện đại',
            material: raw.material || 'Gỗ / Vải cao cấp',
            image: getImageUrl(raw.image),
            images: [getImageUrl(raw.image), ...(raw.gallery || []).map(img => getImageUrl(img))],
            sku: raw.sku || `SP-${raw.id}`,
            rating: 5,
            reviewCount: 12,
            description: raw.description || 'Mô tả sản phẩm đang được cập nhật.',
            dimensions: raw.size || 'N/A',
            colors: mappedColors,
            features: [raw.material || 'Chất liệu cao cấp', raw.size || 'Kích thước tiêu chuẩn'],
            specs: {
              'Kích thước': raw.size || 'N/A',
              'Chất liệu': raw.material || 'N/A',
              'Màu sắc': raw.color || 'N/A',
              'Trạng thái': raw.status === 'ACTIVE' ? 'Sẵn hàng' : 'Hết hàng'
            }
          };
          setProduct(mapped);
          setSelectedColor(mapped.colors[0]);
        } else {
          setError(res.message || 'Không tìm thấy sản phẩm.');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Không thể kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  /* ── Load reviews + check eligibility ── */
  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/product/${id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setAvgRating(data.data.avgRating);
        setTotalReviews(data.data.totalReviews);
      }
    } catch (e) {
      console.error('[reviews] load error:', e.message);
    }
  }, [id]);

  const checkEligibility = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch(`${API_BASE}/reviews/check/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setCanReview(data.data.canReview);
        setExistingReview(data.data.existingReview);
        if (data.data.existingReview) {
          setReviewForm({
            soSao:   data.data.existingReview.SoSao,
            noiDung: data.data.existingReview.NoiDung || '',
          });
        }
      }
    } catch (e) {
      console.error('[reviews] check error:', e.message);
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    loadReviews();
    checkEligibility();
  }, [loadReviews, checkEligibility]);

  /* ── Submit đánh giá (tạo mới hoặc sửa) ── */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.soSao) return;
    setSubmitting(true);
    setReviewMsg({ type: '', text: '' });

    try {
      const isUpdate = !!existingReview;
      const url = isUpdate
        ? `${API_BASE}/reviews/${existingReview.MaDanhGia}`
        : `${API_BASE}/reviews`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          productId: Number(id),
          soSao:     reviewForm.soSao,
          noiDung:   reviewForm.noiDung,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReviewMsg({ type: 'success', text: data.message });
        setIsEditing(false);
        await checkEligibility();
        await loadReviews();
      } else {
        setReviewMsg({ type: 'error', text: data.message });
      }
    } catch (e) {
      setReviewMsg({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      subtitle: product.subtitle,
    });
  };

  const productFavorited = product ? isFavorite(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      sku: product.sku,
      selectedColor: selectedColor?.name || 'Mặc định',
      quantity,
    });
    setCartMsg('Đã thêm vào giỏ hàng!');
    setTimeout(() => setCartMsg(''), 2500);
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#120d08',
        color: '#d4af37',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #332211',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2>ĐANG TẢI CHI TIẾT SẢN PHẨM...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#120d08', color: '#d4af37', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ marginBottom: '12px' }}>Không Tìm Thấy Sản Phẩm</h2>
            <p style={{ color: '#a68f70', marginBottom: '20px' }}>{error || 'Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.'}</p>
            <Link to="/products" className="cmp-btn-gold" style={{ display: 'inline-flex', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', background: '#c9973a', color: '#fff', fontWeight: 'bold' }}>
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  const prevImg = () => setActiveImg(i => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % product.images.length);

  const TABS = [
    { key: 'desc',     label: 'MÔ TẢ SẢN PHẨM' },
    { key: 'specs',    label: 'CHI TIẾT KỸ THUẬT' },
    { key: 'care',     label: 'HƯỚNG DẪN BẢO QUẢN' },
    { key: 'reviews',  label: `ĐÁNH GIÁ (${totalReviews})` },
  ];

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="pdp-main">
        <div className="container">

          {/* ── Breadcrumb ── */}
          <nav className="pdp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/collections">Bộ sưu tập</Link>
            <span>/</span>
            <Link to="/products">Ghế bành</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          {/* ══════════════════════════════════
              PRODUCT SECTION
          ══════════════════════════════════ */}
          <div className="pdp-grid">

            {/* ── LEFT: Gallery ── */}
            <div className="pdp-gallery">
              {/* Main image */}
              <div className="pdp-main-img-wrap">
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="pdp-main-img"
                />
                {/* Zoom button */}
                <button className="pdp-zoom-btn" onClick={() => setShowModal(true)}>
                  <ZoomIn size={18} />
                </button>
                {/* Nav arrows */}
                <button className="pdp-img-nav prev" onClick={prevImg}>
                  <ChevronLeft size={22} />
                </button>
                <button className="pdp-img-nav next" onClick={nextImg}>
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="pdp-thumbs">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImg(i);
                      const imgColor = getColorOnly(img);
                      if (imgColor) {
                        const matchedColorObj = product.colors.find(c => c.name.toLowerCase() === imgColor.toLowerCase());
                        if (matchedColorObj) {
                          setSelectedColor(matchedColorObj);
                          return;
                        }
                      }
                      if (product.colors && product.colors[i]) {
                        setSelectedColor(product.colors[i]);
                      }
                    }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="pdp-info">
              <h1 className="pdp-name">{product.name}</h1>

              {/* SKU + Rating */}
              <div className="pdp-meta">
                <span className="pdp-sku">Mã sản phẩm: {product.sku}</span>
                <div className="pdp-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15}
                      fill={i < product.rating ? '#c9973a' : 'none'}
                      stroke={i < product.rating ? '#c9973a' : '#ccc'}
                    />
                  ))}
                  <span className="pdp-review-count">({product.reviewCount} đánh giá)</span>
                </div>
              </div>

              {/* Price */}
              <div className="pdp-price">{formatCurrency(product.price)}</div>

              {/* Short desc */}
              <p className="pdp-subtitle">{product.subtitle}</p>
              <p className="pdp-desc">{product.description}</p>

              <div className="pdp-divider" />

              {/* Dimensions */}
              <div className="pdp-spec-row">
                <span className="pdp-spec-label">KÍCH THƯỚC:</span>
                <span className="pdp-spec-val">{product.dimensions}</span>
              </div>

              {/* Material */}
              <div className="pdp-spec-row">
                <span className="pdp-spec-label">CHẤT LIỆU:</span>
                <span className="pdp-spec-val">{product.material}</span>
              </div>

              {/* Colors */}
              <div className="pdp-option-row">
                <span className="pdp-spec-label">MÀU SẮC:</span>
                <div className="pdp-colors">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`pdp-color-btn ${selectedColor.name === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={() => {
                        setSelectedColor(c);
                        const idx = product.images.findIndex(img => {
                          const imgColor = getColorOnly(img);
                          return imgColor && imgColor.toLowerCase() === c.name.toLowerCase();
                        });
                        if (idx !== -1) {
                          setActiveImg(idx);
                        } else if (i < product.images.length) {
                          setActiveImg(i);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="pdp-option-row">
                <span className="pdp-spec-label">SỐ LƯỢNG:</span>
                <div className="pdp-qty">
                  <button className="pdp-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="pdp-qty-val">{quantity}</span>
                  <button className="pdp-qty-btn" onClick={() => setQuantity(q => q + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="pdp-divider" />

              {/* Action buttons row 1 */}
              <div className="pdp-actions-row1">
                <Link to={`/compare?add=${product.id}`} className="pdp-btn-outline">
                  <Scale size={16} /> SO SÁNH SẢN PHẨM
                </Link>
                <button
                  type="button"
                  className={`pdp-btn-outline ${productFavorited ? 'active-fav' : ''}`}
                  onClick={handleToggleFavorite}
                >
                  <Heart size={16} fill={productFavorited ? 'currentColor' : 'none'} />
                  {productFavorited ? 'ĐÃ YÊU THÍCH' : 'THÊM VÀO YÊU'}
                </button>
              </div>

              {/* Kết hợp sản phẩm */}
              <button className="pdp-btn-combine">
                🪑 KẾT HỢP SẢN PHẨM
              </button>

              {/* Add to cart */}
              {cartMsg && <p className="pdp-cart-msg">{cartMsg}</p>}
              <button type="button" className="pdp-btn-cart" onClick={handleAddToCart}>
                <ShoppingCart size={18} /> THÊM VÀO GIỎ HÀNG
              </button>

              {/* Secondary actions */}
              <div className="pdp-secondary-actions">
                <button type="button" className={`pdp-sec-btn ${productFavorited ? 'active-fav' : ''}`} onClick={handleToggleFavorite}>
                  <Heart size={14} fill={productFavorited ? 'currentColor' : 'none'} /> {productFavorited ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                </button>
                <button className="pdp-sec-btn">
                  <Scale size={14} /> So sánh sản phẩm
                </button>
                <button className="pdp-sec-btn">
                  <Share2 size={14} /> Chia sẻ
                </button>
              </div>

              {/* Service badges */}
              <div className="pdp-services">
                <div className="pdp-service">
                  <Truck size={20} />
                  <div>
                    <strong>NHẬN PHÍ VẬN CHUYỂN</strong>
                    <span>Áp dụng cho đơn hàng từ 10.000.000 đ</span>
                  </div>
                </div>
                <div className="pdp-service">
                  <Shield size={20} />
                  <div>
                    <strong>BẢO HÀNH DÀI HẠN</strong>
                    <span>Bảo hành 5 năm về khung &amp; kết cấu</span>
                  </div>
                </div>
                <div className="pdp-service">
                  <Headphones size={20} />
                  <div>
                    <strong>HỖ TRỢ 24/7</strong>
                    <span>Đội ngũ tư vấn viên sẵn sàng hỗ trợ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              TABS
          ══════════════════════════════════ */}
          <div className="pdp-tabs-section">
            <div className="pdp-tabs-header">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`pdp-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pdp-tab-body">
              {activeTab === 'desc' && (
                <div className="pdp-tab-desc">
                  <div className="pdp-tab-desc-left">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <ul>
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pdp-tab-desc-right">
                    <img src={product.images[1] || product.images[0]} alt={product.name} />
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="pdp-tab-specs">
                  <table>
                    <tbody>
                      {Object.entries(product.specs).map(([k, v]) => (
                        <tr key={k}>
                          <td className="spec-key">{k}</td>
                          <td className="spec-val">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="pdp-tab-care">
                  <h3>Hướng dẫn bảo quản</h3>
                  <ul>
                    <li>Lau chùi bằng khăn mềm ẩm, tránh dùng hóa chất tẩy rửa mạnh.</li>
                    <li>Tránh đặt sản phẩm dưới ánh nắng trực tiếp trong thời gian dài.</li>
                    <li>Định kỳ 6 tháng nên dùng dầu dưỡng gỗ chuyên dụng để bảo vệ bề mặt.</li>
                    <li>Không để vật nặng lên tay vịn hoặc phần chạm khắc trang trí.</li>
                    <li>Vệ sinh nệm bọc bằng máy hút bụi nhẹ, tránh giặt ướt trực tiếp.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="pdp-tab-reviews">
                  {/* Tổng quan điểm */}
                  <div className="review-summary">
                    <div className="review-score">
                      <span className="score-big">{avgRating || '—'}</span>
                      <div className="score-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20}
                            fill={i < Math.round(avgRating) ? '#c9973a' : 'none'}
                            stroke={i < Math.round(avgRating) ? '#c9973a' : '#ccc'}
                          />
                        ))}
                      </div>
                      <span className="score-count">{totalReviews} đánh giá</span>
                    </div>
                  </div>

                  {/* Form đánh giá */}
                  {!isLoggedIn ? (
                    <div className="review-login-prompt">
                      <AlertCircle size={18} />
                      <span>Vui lòng <Link to="/login">đăng nhập</Link> để đánh giá sản phẩm.</span>
                    </div>
                  ) : !canReview && !existingReview ? (
                    <div className="review-no-purchase">
                      <AlertCircle size={18} />
                      <span>Bạn cần mua và nhận sản phẩm này trước khi đánh giá.</span>
                    </div>
                  ) : existingReview && !isEditing ? (
                    <div className="review-existing">
                      <div className="review-existing-header">
                        <CheckCircle size={16} color="#2d7a3a" />
                        <span>Đánh giá của bạn</span>
                        <span className={`review-status-badge ${existingReview.TrangThai}`}>
                          {existingReview.TrangThai === 'CHO_DUYET' ? 'Chờ duyệt'
                            : existingReview.TrangThai === 'DA_DUYET' ? 'Đã duyệt'
                            : 'Đã ẩn'}
                        </span>
                      </div>
                      <div className="review-existing-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16}
                            fill={i < existingReview.SoSao ? '#c9973a' : 'none'}
                            stroke={i < existingReview.SoSao ? '#c9973a' : '#ccc'}
                          />
                        ))}
                      </div>
                      {existingReview.NoiDung && <p className="review-existing-text">{existingReview.NoiDung}</p>}
                      <button className="review-edit-btn" onClick={() => setIsEditing(true)}>
                        <Edit2 size={14} /> Sửa đánh giá
                      </button>
                    </div>
                  ) : (canReview || isEditing) && (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                      <h4>{isEditing ? 'Sửa đánh giá của bạn' : 'Viết đánh giá'}</h4>

                      {/* Chọn số sao */}
                      <div className="review-star-select">
                        <span>Đánh giá:</span>
                        <div className="review-stars-input">
                          {[1,2,3,4,5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm(f => ({ ...f, soSao: star }))}
                            >
                              <Star size={28}
                                fill={star <= reviewForm.soSao ? '#c9973a' : 'none'}
                                stroke={star <= reviewForm.soSao ? '#c9973a' : '#ccc'}
                              />
                            </button>
                          ))}
                          <span className="review-star-label">
                            {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][reviewForm.soSao]}
                          </span>
                        </div>
                      </div>

                      {/* Nội dung */}
                      <textarea
                        className="review-textarea"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        value={reviewForm.noiDung}
                        onChange={e => setReviewForm(f => ({ ...f, noiDung: e.target.value }))}
                        rows={4}
                        maxLength={1000}
                      />
                      <div className="review-char-count">{reviewForm.noiDung.length}/1000</div>

                      {reviewMsg.text && (
                        <div className={`review-msg ${reviewMsg.type}`}>
                          {reviewMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                          {reviewMsg.text}
                        </div>
                      )}

                      <div className="review-form-actions">
                        {isEditing && (
                          <button type="button" className="review-cancel-btn" onClick={() => { setIsEditing(false); setReviewMsg({ type: '', text: '' }); }}>
                            Hủy
                          </button>
                        )}
                        <button type="submit" className="review-submit-btn" disabled={submitting}>
                          <Send size={15} />
                          {submitting ? 'Đang gửi...' : isEditing ? 'Cập nhật' : 'Gửi đánh giá'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Danh sách đánh giá */}
                  <div className="review-list">
                    {reviews.length === 0 ? (
                      <p className="review-empty">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                    ) : reviews.map(r => (
                      <div key={r.MaDanhGia} className="review-item">
                        <div className="review-item-header">
                          <div className="review-avatar">{r.TenNguoiDung?.[0] || 'U'}</div>
                          <div className="review-item-meta">
                            <strong>{r.TenNguoiDung}</strong>
                            <div className="review-item-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={13}
                                  fill={i < r.SoSao ? '#c9973a' : 'none'}
                                  stroke={i < r.SoSao ? '#c9973a' : '#ccc'}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="review-item-date">
                            {new Date(r.NgayTao).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {r.NoiDung && <p className="review-item-text">{r.NoiDung}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════
              RELATED PRODUCTS
          ══════════════════════════════════ */}
          <div className="pdp-related">
            <h2 className="pdp-related-title">SẢN PHẨM LIÊN QUAN</h2>
            <div className="pdp-related-grid">
              {RELATED.map(r => (
                <div key={r.id} className="pdp-rel-card">
                  <div className="pdp-rel-img">
                    <img src={getImageUrl(r.image)} alt={r.name} />
                    <div className="pdp-rel-overlay">
                      <Link to={`/products/${r.id}`} className="pdp-rel-view">Xem chi tiết</Link>
                    </div>
                  </div>
                  <div className="pdp-rel-body">
                    <h4>{r.name}</h4>
                    <div className="pdp-rel-price">{formatCurrency(r.price)}</div>
                    <div className="pdp-rel-actions">
                      <button
                        type="button"
                        className={`pdp-rel-fav ${isFavorite(r.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite({ id: r.id, name: r.name, price: r.price, image: r.image })}
                      >
                        <Heart size={15} fill={isFavorite(r.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button className="pdp-rel-cart">
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <ChanTrang />

      {/* ── Zoom Modal ── */}
      {showModal && (
        <div className="pdp-modal" onClick={() => setShowModal(false)}>
          <div className="pdp-modal-inner" onClick={e => e.stopPropagation()}>
            <img src={product.images[activeImg]} alt={product.name} />
            <button className="pdp-modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
