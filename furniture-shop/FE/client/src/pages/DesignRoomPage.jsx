import { useState, useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import {
  Upload, Plus, RotateCcw, ShoppingCart,
  ChevronLeft, ChevronRight, Download, Save,
  Trash2, ArrowUp, ArrowDown, ZoomIn, ZoomOut
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import './DesignRoomPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ══════════════════════════════════════════
   1. HELPER FUNCTIONS
══════════════════════════════════════════ */
// Ảnh thumbnail (có nền) — dùng để hiển thị trong danh sách
const getThumbnail = (imagePath) => getImageUrl(imagePath);

// Ảnh tách nền (PNG trong suốt) — dùng khi đặt lên canvas
// Quy tắc: cùng tên file, chỉ đổi thư mục sang /images_nen/
// Nếu chưa có ảnh tách nền thì fallback về thumbnail
const getTransparent = (imagePath) => {
  if (!imagePath) return '/images/anhghesofa.png';
  // Nếu là đường dẫn /uploads/products/sofa_01.png
  // → thử /uploads/products_nen/sofa_01.png
  if (imagePath.startsWith('/uploads/products/')) {
    return imagePath.replace('/uploads/products/', '/uploads/products_nen/');
  }
  // Nếu là /images/sofa_01.png → thử /images_nen/sofa_01.png
  if (imagePath.startsWith('/images/')) {
    return imagePath.replace('/images/', '/images_nen/');
  }
  return imagePath;
};

/* ══════════════════════════════════════════
   2. DỮ LIỆU MẪU (phòng preset)
   Ảnh lấy từ /images_PHONG/ — 5 ảnh có sẵn, xoay vòng nếu thiếu
══════════════════════════════════════════ */
const ROOM_PRESETS = [
  { id: 1,  name: 'Phòng Khách Sang Trọng',     style: 'Luxury Classic',  image: '/images_PHONG/PhongKhachSangTrong.png' },
  { id: 2,  name: 'Phòng Khách Tân Cổ Điển',    style: 'Neo Classic',     image: '/images_PHONG/PhongKhachTanCoDien.png' },
  { id: 3,  name: 'Phòng Ngủ Hiện Đại',         style: 'Modern',          image: '/images_PHONG/PhongNguHienDai.png'     },
  { id: 4,  name: 'Phòng Ngủ Cổ Điển',          style: 'Classic',         image: '/images_PHONG/PhongNguCoDien.png'      },
  { id: 5,  name: 'Phòng Ăn Cao Cấp',           style: 'Luxury',          image: '/images_PHONG/PhongAnCaoCap.png'       },
  { id: 6,  name: 'Phòng Khách Hiện Đại',       style: 'Modern Luxury',   image: '/images_PHONG/PhongKhachSangTrong.png' },
  { id: 7,  name: 'Phòng Ngủ Sang Trọng',       style: 'Royal',           image: '/images_PHONG/PhongNguCoDien.png'      },
  { id: 8,  name: 'Phòng Ăn Cổ Điển',           style: 'French Classic',  image: '/images_PHONG/PhongAnCaoCap.png'       },
  { id: 9,  name: 'Phòng Khách Tối Giản',       style: 'Minimalist',      image: '/images_PHONG/PhongKhachTanCoDien.png' },
  { id: 10, name: 'Phòng Ngủ Japandi',          style: 'Japandi',         image: '/images_PHONG/PhongNguHienDai.png'     },
  { id: 11, name: 'Không Gian Đọc Sách',        style: 'Classic',         image: '/images_PHONG/PhongNguCoDien.png'      },
  { id: 12, name: 'Phòng Khách Luxury',         style: 'Luxury',          image: '/images_PHONG/PhongKhachSangTrong.png' },
];

const SAMPLE_ROOMS = ROOM_PRESETS;

const ROOM_TABS = ['Tất cả', 'Phòng khách', 'Phòng ngủ', 'Phòng ăn', 'Góc làm việc', 'Luxury'];

/* ══════════════════════════════════════════
   3. COMPONENT CHÍNH
══════════════════════════════════════════ */
const DesignRoomPage = () => {
  const fileInputRef  = useRef(null);
  const canvasElRef   = useRef(null);   // <canvas> DOM element
  const fabricRef     = useRef(null);   // fabric.Canvas instance

  const [activeRoomTab,  setActiveRoomTab]  = useState('Tất cả');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [samplePage,     setSamplePage]     = useState(0);
  const [hasBackground,  setHasBackground]  = useState(false);
  const [placedCount,    setPlacedCount]    = useState(0);
  const [totalPrice,     setTotalPrice]     = useState(0);
  const [saving,         setSaving]         = useState(false);
  const [saveMsg,        setSaveMsg]        = useState('');
  const [projectName,    setProjectName]    = useState('Thiết kế của tôi');
  const [zoom,           setZoom]           = useState(1);

  // Sản phẩm từ API
  const [furnitureCategories, setFurnitureCategories] = useState([]);
  const [loadingProducts,     setLoadingProducts]     = useState(true);

  const SAMPLES_PER_PAGE = 3;
  const CANVAS_W = 820;
  const CANVAS_H = 500;

  /* ── Fetch sản phẩm từ API, nhóm theo danh mục ── */
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) return;
        const products = data.data.products;

        // Nhóm theo tên danh mục
        const grouped = {};
        products.forEach(p => {
          const cat = p.category || 'Khác';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            id:        p.id,
            name:      p.name,
            price:     p.price,
            imagePath: p.image,   // đường dẫn từ DB, vd: /uploads/products/sofa_01.png
            maSanPham: p.id,
          });
        });

        setFurnitureCategories(
          Object.entries(grouped).map(([name, items]) => ({ name: name.toUpperCase(), items }))
        );
      })
      .catch(e => console.error('[DesignRoom] fetch products:', e))
      .finally(() => setLoadingProducts(false));
  }, []);

  /* ── Khởi tạo Fabric Canvas ── */
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width:               CANVAS_W,
      height:              CANVAS_H,
      backgroundColor:     '#f5f0e8',
      preserveObjectStacking: true,
      selection:           true,
    });
    fabricRef.current = canvas;

    // Cập nhật tổng giá khi thêm/xóa object
    const updateStats = () => {
      const objs = canvas.getObjects().filter(o => o._furniturePrice);
      setPlacedCount(objs.length);
      setTotalPrice(objs.reduce((s, o) => s + (o._furniturePrice || 0), 0));
    };
    canvas.on('object:added',   updateStats);
    canvas.on('object:removed', updateStats);

    return () => {
      canvas.off('object:added');
      canvas.off('object:removed');
      canvas.dispose();
    };
  }, []);

  /* ── Đặt ảnh nền vào Canvas ── */
  const setCanvasBackground = useCallback((imgSrc) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    fabric.Image.fromURL(imgSrc, (img) => {
      const scaleX = CANVAS_W / img.width;
      const scaleY = CANVAS_H / img.height;
      const scale  = Math.max(scaleX, scaleY);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: scale,
        scaleY: scale,
        originX: 'left',
        originY: 'top',
      });
      setHasBackground(true);
    }, { crossOrigin: 'anonymous' });
  }, []);

  /* ── Upload ảnh phòng ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCanvasBackground(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCanvasBackground(ev.target.result);
    reader.readAsDataURL(file);
  }, [setCanvasBackground]);

  /* ── Chọn preset ── */
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCanvasBackground(preset.image);
  };

  /* ── Thêm nội thất vào Canvas (Fabric.js) ── */
  const handleAddFurniture = useCallback((item) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Dùng ảnh tách nền nếu có, fallback về thumbnail
    const imgSrc = getTransparent(item.imagePath);

    const tryLoad = (src, fallback) => {
      fabric.Image.fromURL(src, (img) => {
        if (!img || img.width === 0) {
          if (fallback) tryLoad(fallback, null);
          return;
        }
        const maxW = 200;
        const scale = maxW / img.width;
        img.set({
          left:   CANVAS_W / 2 - (img.width * scale) / 2 + (Math.random() - 0.5) * 80,
          top:    CANVAS_H / 2 - (img.height * scale) / 2 + (Math.random() - 0.5) * 60,
          scaleX: scale,
          scaleY: scale,
          cornerColor:        '#c9973a',
          cornerSize:         10,
          transparentCorners: false,
          borderColor:        '#c9973a',
          _furnitureName:  item.name,
          _furniturePrice: item.price,
          _furnitureFile:  src,
          _maSanPham:      item.maSanPham,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    };

    // Thử ảnh tách nền trước, fallback về thumbnail
    tryLoad(imgSrc, getThumbnail(item.imagePath));
  }, []);

  /* ── Toolbar: Xóa object đang chọn ── */
  const handleDeleteSelected = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (obj) { canvas.remove(obj); canvas.renderAll(); }
  };

  /* ── Toolbar: Đưa lên trước ── */
  const handleBringForward = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (obj) { obj.bringForward(); canvas.renderAll(); }
  };

  /* ── Toolbar: Đưa ra sau ── */
  const handleSendBackward = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (obj) { obj.sendBackwards(); canvas.renderAll(); }
  };

  /* ── Toolbar: Reset canvas ── */
  const handleReset = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach(o => canvas.remove(o));
    canvas.backgroundImage = null;
    canvas.backgroundColor = '#f5f0e8';
    canvas.renderAll();
    setHasBackground(false);
    setSelectedPreset(null);
  };

  /* ── Zoom ── */
  const handleZoom = (delta) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const newZoom = Math.min(3, Math.max(0.3, zoom + delta));
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  };

  /* ── Snapshot: Xuất ảnh ── */
  const handleSnapshot = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${projectName.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  /* ── Lưu thiết kế lên BE ── */
  const handleSaveDesign = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    setSaving(true);
    setSaveMsg('');

    try {
      // Lấy snapshot base64
      const hinhAnhBase64 = canvas.toDataURL({ format: 'png', quality: 0.8 });

      // Lấy tọa độ tất cả objects
      const items = canvas.getObjects()
        .filter(o => o._maSanPham)
        .map(o => ({
          maSanPham: o._maSanPham,
          soLuong:   1,
          viTriX:    Math.round(o.left),
          viTriY:    Math.round(o.top),
          tiLe:      parseFloat((o.scaleX).toFixed(3)),
          gocXoay:   Math.round(o.angle || 0),
        }));

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/design-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tenDuAn: projectName, hinhAnhBase64, items }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveMsg(`✅ Đã lưu! Mã dự án: #${data.data.maDuAn}`);
      } else {
        setSaveMsg(`❌ ${data.message}`);
      }
    } catch (e) {
      setSaveMsg('❌ Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Load thiết kế từ BE ── */
  const handleLoadDesign = async (id) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      const res  = await fetch(`${API_BASE}/design-room/${id}`);
      const data = await res.json();
      if (!data.success) return alert(data.message);

      const { duAn, items } = data.data;

      // Xóa canvas cũ
      canvas.getObjects().forEach(o => canvas.remove(o));

      // Đặt ảnh nền nếu có
      if (duAn.HinhAnhKhongGian) {
        const baseUrl = API_BASE.replace(/\/api\/?$/, '');
        setCanvasBackground(`${baseUrl}${duAn.HinhAnhKhongGian}`);
      }

      // Load từng sản phẩm theo tọa độ đã lưu
      for (const item of items) {
        await new Promise((resolve) => {
          const imgSrc = item.HinhAnhChinh || '/images/anhghesofa.png';
          fabric.Image.fromURL(imgSrc, (img) => {
            img.set({
              left:   item.ViTriX,
              top:    item.ViTriY,
              scaleX: item.TiLe,
              scaleY: item.TiLe,
              angle:  item.GocXoay,
              _furnitureName:  item.TenSanPham,
              _furniturePrice: item.GiaBan,
              _maSanPham:      item.MaSanPham,
              cornerColor:     '#c9973a',
              borderColor:     '#c9973a',
            });
            canvas.add(img);
            resolve();
          }, { crossOrigin: 'anonymous' });
        });
      }
      canvas.renderAll();
    } catch (e) {
      alert('Không thể tải thiết kế: ' + e.message);
    }
  };

  /* ── Filter furniture theo tab ── */
  const filteredCategories = furnitureCategories.filter(cat => {
    if (activeRoomTab === 'Tất cả') return true;
    const tab = activeRoomTab.toLowerCase();
    return cat.name.toLowerCase().includes(tab);
  });

  const visibleSamples = SAMPLE_ROOMS.slice(
    samplePage * SAMPLES_PER_PAGE,
    samplePage * SAMPLES_PER_PAGE + SAMPLES_PER_PAGE
  );

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
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
            <p className="drp-hero-sub">
              Tải ảnh phòng của bạn hoặc chọn mẫu có sẵn, kéo thả nội thất để xem trước không gian sống trong mơ
            </p>
          </div>
        </div>

        <div className="container">

          {/* ══ A+B: Upload + Preset ══ */}
          <div className="drp-setup-grid">

            {/* A. Upload */}
            <div className="drp-upload-panel">
              <div className="drp-panel-label">A. TẢI ẢNH PHÒNG CỦA BẠN</div>
              <div
                className="drp-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="drp-dropzone-inner">
                  <div className="drp-upload-icon"><Upload size={36} /></div>
                  <p>Kéo và thả ảnh vào đây<br />hoặc nhấp để chọn ảnh</p>
                </div>
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

            {/* Divider */}
            <div className="drp-or-divider">
              <div className="drp-or-line" />
              <div className="drp-or-circle">hoặc</div>
              <div className="drp-or-line" />
            </div>

            {/* B. Preset */}
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
                      {selectedPreset?.id === preset.id && <div className="drp-preset-check">✓</div>}
                    </div>
                    <div className="drp-preset-name">{preset.name}</div>
                    <div className="drp-preset-style">{preset.style}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ CANVAS WORKSPACE ══ */}
          <div className="drp-experience-section">
            <h2 className="drp-section-title">TRẢI NGHIỆM PHỐI NỘI THẤT</h2>

            {/* Room tabs */}
            <div className="drp-room-tabs">
              {ROOM_TABS.map(tab => (
                <button
                  key={tab}
                  className={`drp-room-tab ${activeRoomTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveRoomTab(tab)}
                >{tab}</button>
              ))}
            </div>

            <div className="drp-workspace">

              {/* Left: Danh sách nội thất */}
              <div className="drp-furniture-list">
                {loadingProducts ? (
                  <div className="drp-loading">Đang tải sản phẩm...</div>
                ) : filteredCategories.length === 0 ? (
                  <div className="drp-loading">Không có sản phẩm</div>
                ) : filteredCategories.map((cat, ci) => (
                  <div key={ci} className="drp-fcat">
                    <div className="drp-fcat-title">{cat.name}</div>
                    {cat.items.map(item => (
                      <div key={item.id} className="drp-fitem">
                        <div className="drp-fitem-img">
                          <img
                            src={getThumbnail(item.imagePath)}
                            alt={item.name}
                            onError={e => { e.target.src = '/images/anhghesofa.png'; }}
                          />
                        </div>
                        <div className="drp-fitem-info">
                          <div className="drp-fitem-name">{item.name}</div>
                          <div className="drp-fitem-price">{formatCurrency(item.price)}</div>
                        </div>
                        <button
                          className="drp-fitem-add"
                          onClick={() => handleAddFurniture(item)}
                          title="Thêm vào canvas"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Right: Fabric Canvas */}
              <div className="drp-canvas-wrap">

                {/* Toolbar trên */}
                <div className="drp-canvas-toolbar">
                  <button className="drp-tool-btn" title="Phóng to"    onClick={() => handleZoom(0.1)}><ZoomIn size={16} /></button>
                  <button className="drp-tool-btn" title="Thu nhỏ"     onClick={() => handleZoom(-0.1)}><ZoomOut size={16} /></button>
                  <div className="drp-tool-sep" />
                  <button className="drp-tool-btn" title="Lên trước"   onClick={handleBringForward}><ArrowUp size={16} /></button>
                  <button className="drp-tool-btn" title="Ra sau"      onClick={handleSendBackward}><ArrowDown size={16} /></button>
                  <button className="drp-tool-btn danger" title="Xóa đang chọn" onClick={handleDeleteSelected}><Trash2 size={16} /></button>
                  <div className="drp-tool-sep" />
                  <button className="drp-tool-btn" title="Làm mới"     onClick={handleReset}><RotateCcw size={16} /></button>
                  <button className="drp-tool-btn" title="Xuất ảnh"    onClick={handleSnapshot}><Download size={16} /></button>
                </div>

                {/* Canvas element */}
                <div className="drp-canvas-container">
                  <canvas ref={canvasElRef} />
                  {!hasBackground && (
                    <div className="drp-canvas-empty">
                      <div className="drp-canvas-empty-icon">🏠</div>
                      <p>Tải ảnh phòng hoặc chọn mẫu có sẵn<br />để bắt đầu phối nội thất</p>
                    </div>
                  )}
                </div>

                {/* Summary + Save */}
                <div className="drp-canvas-footer">
                  <div className="drp-placed-summary">
                    {placedCount > 0 ? (
                      <>
                        <span className="drp-placed-count">{placedCount} sản phẩm</span>
                        <span className="drp-placed-total">Tổng: <strong>{formatCurrency(totalPrice)}</strong></span>
                      </>
                    ) : (
                      <span className="drp-placed-hint">💡 Nhấn <strong>+</strong> để thêm nội thất</span>
                    )}
                  </div>

                  <div className="drp-save-row">
                    <input
                      className="drp-project-name"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="Tên dự án..."
                    />
                    <button
                      className="drp-save-btn"
                      onClick={handleSaveDesign}
                      disabled={saving}
                    >
                      <Save size={16} />
                      {saving ? 'Đang lưu...' : 'LƯU THIẾT KẾ'}
                    </button>
                    <button className="drp-add-all-btn" onClick={() => alert(`Đã thêm ${placedCount} sản phẩm vào giỏ!`)} disabled={placedCount === 0}>
                      <ShoppingCart size={16} /> THÊM VÀO GIỎ
                    </button>
                  </div>

                  {saveMsg && <div className="drp-save-msg">{saveMsg}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* ══ MẪU KHÔNG GIAN ══ */}
          <div className="drp-samples-section">
            <h2 className="drp-section-title">MẪU KHÔNG GIAN CÓ SẴN</h2>
            <div className="drp-samples-slider">
              <button
                className="drp-slider-nav prev"
                onClick={() => setSamplePage(p => Math.max(0, p - 1))}
                disabled={samplePage === 0}
              ><ChevronLeft size={22} /></button>

              <div className="drp-samples-grid">
                {visibleSamples.map((room, idx) => (
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
              ><ChevronRight size={22} /></button>
            </div>
          </div>

        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default DesignRoomPage;
