import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, Plus, Minus, RotateCcw, ShoppingCart,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Move
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { formatCurrency } from '../utils/currency.util';
import './DesignRoomPage.css';

/* ── Dữ liệu mẫu ── */
const ROOM_PRESETS = [
  { id: 1, name: 'Phòng Ngủ Hiện Đại',    style: 'Modern',         image: '/images/noi_that_01_hang1_cot1.png' },
  { id: 2, name: 'Phòng Ngủ Cổ Điển Pháp', style: 'French Classic', image: '/images/noi_that_02_hang1_cot2.png' },
  { id: 3, name: 'Phòng Khách Tân Cổ Điển', style: 'Neo Classic',   image: '/images/noi_that_03_hang1_cot3.png' },
  { id: 4, name: 'Phòng Khách Hiện Đại Sang Trọng', style: 'Modern Luxury', image: '/images/noi_that_04_hang1_cot4.png' },
  { id: 5, name: 'Phòng Ăn',              style: 'Luxury',          image: '/images/noi_that_05_hang1_cot5.png' },
  { id: 6, name: 'Góc Làm Việc',          style: 'Indochine',       image: '/images/noi_that_06_hang1_cot6.png' },
];

const ROOM_TABS = ['Tất cả', 'Phòng khách', 'Phòng ngủ', 'Phòng ăn', 'Góc làm việc', 'Vệ sinh', 'Tủ & Kệ đầu', 'Cổ điển Thâm', 'Indochine', 'Luxury'];

const FURNITURE_CATEGORIES = [
  {
    name: 'PHÒNG KHÁCH (30)',
    items: [
      { id: 1, name: 'Phòng Khách Tân Cổ Điển', sub: 'Sofa Cổ / Bàn', price: 45000000, image: '/images/anhghesofa.png' },
      { id: 2, name: 'Phòng Ngủ (18)', sub: '', price: 0, isCategory: true },
    ]
  },
  {
    name: 'PHÒNG NGỦ (18)',
    items: [
      { id: 3, name: 'Giường Ngọc Bảo Đa Giường', sub: '', price: 98000000, image: '/images/anhgiuong.png' },
      { id: 4, name: 'Tập Đèn Giường Cổ Điển Pháp Tủ Đỡ', sub: '', price: 28000000, image: '/images/anhgiuonghaiden.png' },
    ]
  },
  {
    name: 'PHÒNG ĂN (34)',
    items: [
      { id: 5, name: 'Bàn Ăn Cổ Điển Gỗ Tự Nhiên Bàn Ăn', sub: '', price: 125000000, image: '/images/anhbanan.png' },
      { id: 6, name: 'Đèn Chùm Pha Lê Crystal Đèn Trang Trí', sub: '', price: 18900000, image: '/images/anhbanandai.png' },
    ]
  },
  {
    name: 'THẢM (12)',
    items: [
      { id: 7, name: 'Thảm Cổ Điển Hoa Văn Thảm', sub: '', price: 8500000, image: '/images/noi_that_07_hang1_cot7.png' },
    ]
  },
  {
    name: 'PHỤ KIỆN TRANG TRÍ (51)',
    items: [
      { id: 8, name: 'Bình Hoa Trang Trí Decorative Vase Tủ Decor', sub: '', price: 3200000, image: '/images/noi_that_08_hang2_cot1.png' },
    ]
  },
];

const SAMPLE_ROOMS = [
  { id: 1, name: 'Phòng Ngủ Hiện Đại',    style: 'Modern',         image: '/images/noi_that_01_hang1_cot1.png' },
  { id: 2, name: 'Phòng Ngủ Cổ Điển Pháp', style: 'French Classic', image: '/images/noi_that_02_hang1_cot2.png' },
  { id: 3, name: 'Phòng Khách Tân Cổ Điển', style: 'Neo Classic',   image: '/images/noi_that_03_hang1_cot3.png' },
  { id: 4, name: 'Phòng Khách Sang Trọng', style: 'Modern Luxury',  image: '/images/noi_that_04_hang1_cot4.png' },
  { id: 5, name: 'Phòng Ăn Hoa Hiện Đại', style: 'Modern Luxury',   image: '/images/noi_that_05_hang1_cot5.png' },
  { id: 6, name: 'Góc Làm Việc Indochine', style: 'Indochine',      image: '/images/noi_that_06_hang1_cot6.png' },
];

const DesignRoomPage = () => {
  const fileInputRef = useRef(null);
  const canvasRef    = useRef(null);

  const [uploadedImage, setUploadedImage]   = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [activeRoomTab, setActiveRoomTab]   = useState('Tất cả');
  const [placedItems, setPlacedItems]       = useState([]);
  const [selectedItem, setSelectedItem]     = useState(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [dragOver, setDragOver]             = useState(false);
  const [samplePage, setSamplePage]         = useState(0);
  const SAMPLES_PER_PAGE = 3;

  /* ── Upload ảnh ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setSelectedPreset(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setSelectedPreset(null);
    };
    reader.readAsDataURL(file);
  }, []);

  /* ── Chọn preset phòng ── */
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setUploadedImage(null);
  };

  /* ── Thêm nội thất vào canvas ── */
  const handleAddFurniture = (item) => {
    const newItem = {
      ...item,
      instanceId: Date.now(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      scale: 1,
      rotation: 0,
    };
    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItem(newItem.instanceId);
  };

  /* ── Xóa item ── */
  const handleRemoveItem = (instanceId) => {
    setPlacedItems(prev => prev.filter(i => i.instanceId !== instanceId));
    if (selectedItem === instanceId) setSelectedItem(null);
  };

  /* ── Thêm tất cả vào giỏ ── */
  const handleAddAllToCart = () => {
    if (placedItems.length === 0) {
      alert('Chưa có sản phẩm nào trong không gian!');
      return;
    }
    alert(`Đã thêm ${placedItems.length} sản phẩm vào giỏ hàng!`);
  };

  const currentBg = uploadedImage || selectedPreset?.image || null;
  const totalPrice = placedItems.reduce((s, i) => s + (i.price || 0), 0);

  const visibleSamples = SAMPLE_ROOMS.slice(
    samplePage * SAMPLES_PER_PAGE,
    samplePage * SAMPLES_PER_PAGE + SAMPLES_PER_PAGE
  );

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="drp-main">

        {/* ── HERO ── */}
        <div className="drp-hero">
          <div className="drp-hero-overlay" />
          <div className="drp-hero-content container">
            <div className="drp-hero-eyebrow">✦ Trải Nghiệm Độc Quyền</div>
            <h1 className="drp-hero-title">CÁ NHÂN HÓA KHÔNG GIAN</h1>
            <p className="drp-hero-sub">Tải ảnh phòng của bạn hoặc chọn mẫu có sẵn, sau đó thêm nội thất để xem trước không gian sống trong mơ</p>
          </div>
        </div>

        <div className="container">

          {/* ══════════════════════════════════
              SECTION A+B: Upload + Preset
          ══════════════════════════════════ */}
          <div className="drp-setup-grid">

            {/* A. Tải ảnh */}
            <div className="drp-upload-panel">
              <div className="drp-panel-label">A. TẢI ẢNH PHÒNG CỦA BẠN</div>
              <div
                className={`drp-dropzone ${dragOver ? 'drag-over' : ''} ${uploadedImage ? 'has-image' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploadedImage && fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <>
                    <img src={uploadedImage} alt="Phòng của bạn" className="drp-preview-img" />
                    <button
                      className="drp-remove-img"
                      onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                    >×</button>
                  </>
                ) : (
                  <div className="drp-dropzone-inner">
                    <div className="drp-upload-icon">
                      <Upload size={36} />
                    </div>
                    <p>Kéo và thả ảnh vào đây<br />hoặc nhấp để chọn ảnh</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button className="drp-upload-btn" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} /> TẢI ẢNH LÊN
              </button>
              <p className="drp-upload-hint">Hỗ trợ JPG, PNG.</p>
            </div>

            {/* Divider "hoặc" */}
            <div className="drp-or-divider">
              <div className="drp-or-line" />
              <div className="drp-or-circle">hoặc</div>
              <div className="drp-or-line" />
            </div>

            {/* B. Chọn mẫu có sẵn */}
            <div className="drp-preset-panel">
              <div className="drp-panel-label">B. CHỌN MẪU CÓ SẴN</div>
              <div className="drp-preset-grid">
                {ROOM_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    className={`drp-preset-card ${selectedPreset?.id === preset.id ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <div className="drp-preset-img">
                      <img src={preset.image} alt={preset.name} />
                      {selectedPreset?.id === preset.id && (
                        <div className="drp-preset-check">✓</div>
                      )}
                    </div>
                    <div className="drp-preset-name">{preset.name}</div>
                    <div className="drp-preset-style">{preset.style}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              SECTION: TRẢI NGHIỆM NỘI THẤT
          ══════════════════════════════════ */}
          <div className="drp-experience-section">
            <h2 className="drp-section-title">TRẢI NGHIỆM PHỐI NỘI THẤT</h2>

            {/* Room tabs */}
            <div className="drp-room-tabs">
              {ROOM_TABS.map(tab => (
                <button
                  key={tab}
                  className={`drp-room-tab ${activeRoomTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveRoomTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="drp-workspace">

              {/* Left: Furniture list */}
              <div className="drp-furniture-list">
                {FURNITURE_CATEGORIES.map((cat, ci) => (
                  <div key={ci} className="drp-fcat">
                    <div className="drp-fcat-title">{cat.name}</div>
                    {cat.items.map(item => (
                      <div key={item.id} className="drp-fitem">
                        <div className="drp-fitem-img">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="drp-fitem-info">
                          <div className="drp-fitem-name">{item.name}</div>
                          {item.price > 0 && (
                            <div className="drp-fitem-price">{formatCurrency(item.price)}</div>
                          )}
                        </div>
                        <button
                          className="drp-fitem-add"
                          onClick={() => handleAddFurniture(item)}
                          title="Thêm vào không gian"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Right: Canvas */}
              <div className="drp-canvas-wrap">
                {/* Canvas area */}
                <div
                  className="drp-canvas"
                  style={{
                    backgroundImage: currentBg ? `url(${currentBg})` : 'none',
                  }}
                >
                  {!currentBg && (
                    <div className="drp-canvas-empty">
                      <div className="drp-canvas-empty-icon">🏠</div>
                      <p>Tải ảnh phòng hoặc chọn mẫu có sẵn<br />để bắt đầu phối nội thất</p>
                    </div>
                  )}

                  {/* Placed furniture items */}
                  {placedItems.map(item => (
                    <div
                      key={item.instanceId}
                      className={`drp-placed-item ${selectedItem === item.instanceId ? 'selected' : ''}`}
                      style={{
                        left: item.x,
                        top:  item.y,
                        transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                      }}
                      onClick={() => setSelectedItem(item.instanceId)}
                    >
                      <img src={item.image} alt={item.name} />
                      {selectedItem === item.instanceId && (
                        <button
                          className="drp-item-remove"
                          onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.instanceId); }}
                        >×</button>
                      )}
                    </div>
                  ))}

                  {/* Canvas hint */}
                  {currentBg && placedItems.length === 0 && (
                    <div className="drp-canvas-hint">
                      💡 Nhấn <strong>+</strong> bên trái để thêm nội thất vào không gian
                    </div>
                  )}

                  {/* Canvas toolbar */}
                  {currentBg && (
                    <div className="drp-canvas-toolbar">
                      <button className="drp-tool-btn" title="Phóng to"><ZoomIn size={16} /></button>
                      <button className="drp-tool-btn" title="Thu nhỏ"><ZoomOut size={16} /></button>
                      <button className="drp-tool-btn" title="Di chuyển"><Move size={16} /></button>
                      <button className="drp-tool-btn" title="Đặt lại" onClick={() => setPlacedItems([])}><RotateCcw size={16} /></button>
                    </div>
                  )}
                </div>

                {/* Placed items summary */}
                {placedItems.length > 0 && (
                  <div className="drp-placed-summary">
                    <div className="drp-placed-list">
                      {placedItems.map(item => (
                        <div key={item.instanceId} className="drp-placed-tag">
                          <img src={item.image} alt={item.name} />
                          <span>{item.name}</span>
                          <button onClick={() => handleRemoveItem(item.instanceId)}>×</button>
                        </div>
                      ))}
                    </div>
                    <div className="drp-placed-total">
                      Tổng: <strong>{formatCurrency(totalPrice)}</strong>
                    </div>
                  </div>
                )}

                {/* Add all to cart */}
                <button
                  className="drp-add-all-btn"
                  onClick={handleAddAllToCart}
                  disabled={placedItems.length === 0}
                >
                  <ShoppingCart size={20} />
                  THÊM TẤT CẢ VÀO GIỎ
                  {placedItems.length > 0 && (
                    <span className="drp-cart-count">{placedItems.length}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
              SECTION: MẪU KHÔNG GIAN CÓ SẴN
          ══════════════════════════════════ */}
          <div className="drp-samples-section">
            <h2 className="drp-section-title">MẪU KHÔNG GIAN CÓ SẴN</h2>

            <div className="drp-samples-slider">
              <button
                className="drp-slider-nav prev"
                onClick={() => setSamplePage(p => Math.max(0, p - 1))}
                disabled={samplePage === 0}
              >
                <ChevronLeft size={22} />
              </button>

              <div className="drp-samples-grid">
                {SAMPLE_ROOMS.map((room, idx) => (
                  <div
                    key={room.id}
                    className="drp-sample-card"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    onClick={() => handleSelectPreset(room)}
                  >
                    <div className="drp-sample-img">
                      <img src={room.image} alt={room.name} />
                      <div className="drp-sample-overlay">
                        <button className="drp-sample-use">Dùng mẫu này</button>
                      </div>
                    </div>
                    <div className="drp-sample-info">
                      <div className="drp-sample-name">{room.name}</div>
                      <div className="drp-sample-style">{room.style}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="drp-slider-nav next"
                onClick={() => setSamplePage(p => p + 1)}
                disabled={(samplePage + 1) * SAMPLES_PER_PAGE >= SAMPLE_ROOMS.length}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default DesignRoomPage;
