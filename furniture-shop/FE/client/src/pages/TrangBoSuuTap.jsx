import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useScrollReveal } from '../hooks/useAnimations';
import collectionApi from '../apis/collection.api';
import { getImageUrl } from '../helpers/image.helper';
import './collections.css';

/* ── DATA CHUẨN ĐÃ ĐƯỢC PHÂN TAG CHÍNH XÁC ─────────────────── */
const FILTERS = ['Tất cả', 'Cổ điển', 'Tủ & Đèn', 'Phòng khách', 'Phòng ngủ', 'Decor', 'Luxury'];

const COLLECTIONS = [
  {
    id: 1,
    title: 'Sofa Tân Cổ Điển Hoàng Gia',
    subtitle: 'Tâm điểm của sự sang trọng',
    desc: 'Bộ sofa phòng khách với các chi tiết chạm trổ thủ công tỉ mỉ, bọc da cao cấp mang lại vẻ quyền uy cho không gian.',
    img: '/images/bst1.png',
    tags: ['Phòng khách', 'Cổ điển', 'Luxury'],
    size: 'large',
  },
  {
    id: 2,
    title: 'Giường Ngủ Imperial',
    subtitle: 'Không gian tĩnh lặng đẳng cấp',
    desc: 'Chiếc giường ngủ mang phong cách quý tộc châu Âu, kết hợp đầu giường bọc nhung êm ái cho giấc ngủ trọn vẹn.',
    img: '/images/bst2.png',
    tags: ['Phòng ngủ', 'Cổ điển', 'Luxury'],
    size: 'normal',
  },
  {
    id: 3,
    title: 'Tủ Rượu & Kính Trưng Bày',
    subtitle: 'Lưu giữ hương vị thời gian',
    desc: 'Thiết kế kính cường lực kết hợp viền gỗ nguyên khối, tôn vinh những chai vang thượng hạng của gia chủ.',
    img: '/images/bst3.png',
    tags: ['Tủ & Đèn', 'Phòng khách'],
    size: 'normal',
  },
  {
    id: 4,
    title: 'Đèn Chùm Pha Lê Baccarat',
    subtitle: 'Ánh sáng lộng lẫy xa hoa',
    desc: 'Kiệt tác chiếu sáng với hàng ngàn viên pha lê lấp lánh, tạo điểm nhấn rực rỡ cho trần nhà phòng khách.',
    img: '/images/bst4.png',
    tags: ['Tủ & Đèn', 'Decor', 'Luxury'],
    size: 'normal',
  },
  {
    id: 5,
    title: 'Bàn Trà Mặt Đá Khổng Tước',
    subtitle: 'Giao thoa giữa tự nhiên và nghệ thuật',
    desc: 'Mặt bàn chế tác từ đá tự nhiên nguyên phiến, chân đồng đúc tinh xảo dành riêng cho không gian phòng khách.',
    img: '/images/bst5.png',
    tags: ['Phòng khách', 'Luxury'],
    size: 'normal',
  },
  {
    id: 6,
    title: 'Bàn Trang Điểm Louis',
    subtitle: 'Góc làm đẹp duyên dáng',
    desc: 'Đường cong uyển chuyển đậm chất Pháp, là món đồ nội thất không thể thiếu trong phòng ngủ của các quý cô.',
    img: '/images/bst6.png',
    tags: ['Phòng ngủ', 'Cổ điển'],
    size: 'normal',
  },
  {
    id: 7,
    title: 'Tranh Tráng Gương Phục Hưng',
    subtitle: 'Thổi hồn vào bức tường trống',
    desc: 'Những tác phẩm hội họa kinh điển được phục dựng sắc nét, viền khung vàng gold mang đậm chất nghệ thuật.',
    img: '/images/bst7.png',
    tags: ['Decor', 'Cổ điển'],
    size: 'normal',
  },
  {
    id: 8,
    title: 'Đồng Hồ Quả Lắc Cổ',
    subtitle: 'Thước đo của di sản',
    desc: 'Sự kết hợp hoàn hảo giữa cơ khí thủ công và nghệ thuật chạm gỗ, âm vang mang dấu ấn của thời gian.',
    img: '/images/bst8.png',
    tags: ['Decor', 'Phòng khách', 'Cổ điển'],
    size: 'normal',
  },
];

const ROOMS = [
  {
    id: 1,
    title: 'PHÒNG KHÁCH',
    sub: 'Sang trọng — Đẳng cấp — Tinh tế',
    img: '/images/bst11.png',
  },
  {
    id: 2,
    title: 'PHÒNG NGỦ',
    sub: 'Ấm áp — Tĩnh lặng — Đẳng cấp',
    img: '/images/bst12.png',
  },
  {
    id: 3,
    title: 'PHÒNG ĂN',
    sub: 'Hoa lệ — Tinh tế — Hoàng gia',
    img: '/images/bst9.png',
  },
];

const matchFilter = (item, f) => f === 'Tất cả' || item.tags.includes(f);

/* ── COMPONENT ────────────────────────────────────────────── */
const TrangBoSuuTap = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [gridRef,  gridVisible]  = useScrollReveal();
  const [roomsRef, roomsVisible] = useScrollReveal();
  
  // Dùng COLLECTIONS làm dữ liệu gốc ban đầu
  const [collections, setCollections] = useState(COLLECTIONS); 

  useEffect(() => {
    /* TẠM THỜI TẮT GỌI API ĐỂ TRÁNH DỮ LIỆU BACKEND GÁN SAI TAG 
      LÀM GÃY GIAO DIỆN. KHI NÀO BACKEND SỬA XONG DATA THÌ BẠN MỞ LẠI.
    */
    
    // const fetchCollections = async () => {
    //   try {
    //     const res = await collectionApi.getAll();
    //     if (res && res.success && res.data.length > 0) {
    //       const mapped = res.data.map((col, idx) => {
    //         let safeTags = [];
    //         if (Array.isArray(col.tags)) {
    //           safeTags = col.tags; 
    //         } else if (typeof col.tags === 'string' && col.tags.trim() !== '') {
    //           safeTags = col.tags.split(',').map(t => t.trim()); 
    //         } else {
    //           safeTags = COLLECTIONS[idx] ? COLLECTIONS[idx].tags : ['Tất cả', 'Cổ điển'];
    //         }
    //         return {
    //           id: col.id || col.MaBoSuuTap,
    //           title: col.title || col.TenBoSuuTap,
    //           subtitle: col.subtitle || 'Kiệt tác không gian sống quý tộc',
    //           desc: col.desc || col.MoTa,
    //           img: getImageUrl(col.img || col.HinhAnh),
    //           tags: safeTags, 
    //           size: idx === 0 ? 'large' : 'normal'
    //         };
    //       });
    //       setCollections(mapped);
    //     }
    //   } catch (err) {
    //     console.error('Lỗi khi tải bộ sưu tập:', err);
    //   }
    // };
    // fetchCollections();
    
  }, []);

  const displayed = useMemo(
    () => collections.filter(c => matchFilter(c, activeFilter)),
    [collections, activeFilter]
  );

  return (
    <div className="lavish-root">
      <DauTrang />
      <main className="bst-page">
        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="bst-hero">
          <div className="bst-hero-bg"
            style={{ backgroundImage: 'url(/images/bst13.png)' }} />
          <div className="bst-hero-veil" />
          <div className="bst-hero-inner container">
            <nav className="bst-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Bộ sưu tập</span>
            </nav>
            <h1>BỘ SƯU TẬP</h1>
            <div className="bst-hero-rule"><span /><span className="bst-hero-diamond" /><span /></div>
            <p>Trân trọng những bộ sưu tập nội thất tinh hoa, tôn vinh giá trị di sản và nghệ thuật sống đẳng cấp.</p>
          </div>
        </section>

        {/* ══ SECTION HEADING ═══════════════════════════════ */}
        <div className="bst-heading">
          <div className="bst-heading-rule"><span /><span>✦ BỘ SƯU TẬP NỔI BẬT ✦</span><span /></div>
        </div>

        {/* ══ FILTERS ═══════════════════════════════════════ */}
        <div className="bst-filters container">
          {FILTERS.map(f => (
            <button key={f}
              className={`bst-filter-btn${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* ══ GRID ══════════════════════════════════════════ */}
        <section className={`bst-grid container${gridVisible ? ' revealed' : ''}`} ref={gridRef}>
          {displayed.length === 0 && (
            <p className="bst-empty">Không tìm thấy bộ sưu tập nào.</p>
          )}

          {/* Card lớn đầu tiên */}
          {displayed.filter(c => c.size === 'large').map((item, i) => (
            <Link to="/products" key={item.id}
              className="bst-card bst-card--large"
              style={{ '--i': i }}>
              <div className="bst-card-img">
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="bst-card-veil" />
              </div>
              <div className="bst-card-body">
                <div className="bst-card-logo">
                  <span className="bst-logo-mark">LH</span>
                </div>
                <span className="bst-card-eyebrow">{item.tags[0]}</span>
                <h2 className="bst-card-title">{item.title}</h2>
                <p className="bst-card-sub">{item.subtitle}</p>
                <p className="bst-card-desc">{item.desc}</p>
                <div className="bst-card-cta">
                  Khám phá bộ sưu tập <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}

          {/* Cards nhỏ dạng 2 cột */}
          <div className="bst-grid-small">
            {displayed.filter(c => c.size !== 'large').map((item, i) => (
              <Link to="/products" key={item.id}
                className="bst-card bst-card--small"
                style={{ '--i': i + 1 }}>
                <div className="bst-card-img">
                  <img src={item.img} alt={item.title} loading="lazy" />
                  <div className="bst-card-veil" />
                </div>
                <div className="bst-card-body">
                  <span className="bst-card-eyebrow">{item.tags[0]}</span>
                  <h3 className="bst-card-title">{item.title}</h3>
                  <p className="bst-card-sub">{item.subtitle}</p>
                  <div className="bst-card-cta">
                    Khám phá bộ sưu tập <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ QUOTE ═════════════════════════════════════════ */}
        <section className="bst-quote">
          <div className="bst-quote-inner container">
            <span className="bst-quote-open">"</span>
            <blockquote>
              Nội thất không chỉ là vật thể,<br />
              mà là câu chuyện về phong cách,<br />
              gu thẩm mỹ và di sản.
            </blockquote>
            <span className="bst-quote-close">"</span>
            <div className="bst-quote-rule"><span /><span className="bst-hero-diamond" /><span /></div>
          </div>
        </section>

        {/* ══ ROOMS ═════════════════════════════════════════ */}
        <section className="bst-rooms">
          <div className="bst-heading bst-heading--dark">
            <div className="bst-heading-rule bst-heading-rule--gold">
              <span /><span>✦ CẢM HỨNG KHÔNG GIAN ✦</span><span />
            </div>
          </div>
          <div className="bst-rooms-grid container" ref={roomsRef}>
            {ROOMS.map((room, i) => (
              <Link to="/products" key={room.id}
                className={`bst-room-card${roomsVisible ? ' visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="bst-room-img">
                  <img src={room.img} alt={room.title} loading="lazy" />
                  <div className="bst-room-veil" />
                </div>
                <div className="bst-room-body">
                  <div className="bst-room-num">0{i + 1}</div>
                  <h3>{room.title}</h3>
                  <p>{room.sub}</p>
                  <span className="bst-room-link">Xem →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════ */}
        <section className="bst-cta">
          <div className="bst-cta-frame" />
          <div className="container bst-cta-inner">
            <div className="bst-cta-icon"><Headphones size={24} /></div>
            <div className="bst-cta-text">
              <p className="bst-cta-eyebrow">✦ TƯ VẤN MIỄN PHÍ ✦</p>
              <h3>CẦN TƯ VẤN CHO KHÔNG GIAN CỦA BẠN?</h3>
              <p>Đội ngũ chuyên gia tại Lavish Heritage luôn sẵn lòng đồng hành cùng bạn.</p>
            </div>
            <Link to="/#contact" className="col-cta-btn">
              LIÊN HỆ TƯ VẤN <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </main>
      <ChanTrang />
    </div>
  );
};

export default TrangBoSuuTap;