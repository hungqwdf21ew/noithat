import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Phone } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useScrollReveal } from '../hooks/useAnimations';
import './collections.css';

/* ── DATA ─────────────────────────────────────────────────── */
const FILTERS = ['Tất cả', 'Cổ điển', 'Tủ & Đèn', 'Phòng khách', 'Phòng ngủ', 'Decor', 'Luxury'];

const COLLECTIONS = [
  {
    id: 1,
    title: 'Heritage Royale',
    subtitle: 'Vẻ đẹp vương giả thời gian',
    desc: 'Bộ sưu tập tiêu biểu của Lavish Heritage với những đường nét chạm khắc tinh xảo, chất liệu cao cấp và phong cách châu Âu thế kỷ 18 đem đến không gian giàu giá trị di sản.',
    img: '/images/noi_that_cao_cap_boi_canh_01.png',
    tags: ['Cổ điển', 'Phòng khách', 'Luxury'],
    size: 'large',
  },
  {
    id: 2,
    title: 'Imperial Majesty',
    subtitle: 'Không gian nghỉ ngơi đẳng cấp quý tộc',
    desc: 'Sang trọng và đậm chất hoàng gia.',
    img: '/images/01_giuong_ngu_go_cao_cap.png',
    tags: ['Phòng ngủ', 'Cổ điển'],
    size: 'normal',
  },
  {
    id: 3,
    title: 'Grand Palace Dining',
    subtitle: 'Nghệ thuật ẩm thực đẳng cấp hoàng gia',
    desc: 'Thiết kế lộng lẫy, tỉ mỉ từng đường nét, tạo nên không gian ăn uống sang trọng và đẳng cấp.',
    img: '/images/anhbanandai.png',
    tags: ['Phòng khách', 'Cổ điển'],
    size: 'normal',
  },
  {
    id: 4,
    title: 'Royal Moments',
    subtitle: 'Điểm nhấn trang trí thượng lưu',
    desc: 'Những món decor tinh tuyển, chắt lọc từ nghệ thuật trang trí nội thất cổ điển châu Âu.',
    img: '/images/03_den_dung_kinh_va_da.png',
    tags: ['Decor', 'Luxury'],
    size: 'normal',
  },
  {
    id: 5,
    title: 'Louis Heritage',
    subtitle: 'Cổ điển Pháp — Vẻ đẹp trường tồn',
    desc: 'Cảm hứng từ phong cách Louis XV với đường cong mềm mại, chạm khắc tinh xảo và màu sắc ấm áp.',
    img: '/images/07_go_oc_cho_xanh_luc_bao_khong_chu.png',
    tags: ['Cổ điển', 'Luxury'],
    size: 'normal',
  },
  {
    id: 6,
    title: 'Velvet Noir',
    subtitle: 'Bí ẩn & Quyến rũ',
    desc: 'Tông màu tối huyền bí kết hợp nhung cao cấp và đồng thau.',
    img: '/images/noi_that_cao_cap_boi_canh_03.png',
    tags: ['Phòng khách', 'Luxury'],
    size: 'normal',
  },
  {
    id: 7,
    title: 'Cabinet Royale',
    subtitle: 'Tủ kính & Đá cẩm thạch',
    desc: 'Bộ tủ kính cao cấp với khung đồng thau và mặt đá cẩm thạch.',
    img: '/images/05_tu_kinh_da_cao_cap.png',
    tags: ['Tủ & Đèn', 'Cổ điển'],
    size: 'normal',
  },
  {
    id: 8,
    title: "Lumière d'Or",
    subtitle: 'Ánh sáng vàng son',
    desc: 'Bộ sưu tập đèn trang trí lấy cảm hứng từ đèn chùm cung điện Versailles.',
    img: '/images/05_den_dung_hien_dai.png',
    tags: ['Tủ & Đèn', 'Decor'],
    size: 'normal',
  },
];

const ROOMS = [
  {
    id: 1, title: 'PHÒNG KHÁCH',
    sub: 'Sang trọng — Đẳng cấp — Tinh tế',
    img: '/images/noi_that_cao_cap_boi_canh_01.png',
  },
  {
    id: 2, title: 'PHÒNG NGỦ',
    sub: 'Ấm áp — Tĩnh lặng — Đẳng cấp',
    img: '/images/01_giuong_ngu_go_cao_cap.png',
  },
  {
    id: 3, title: 'PHÒNG ĂN',
    sub: 'Hoa lệ — Tinh tế — Hoàng gia',
    img: '/images/anhbanandai.png',
  },
];

const matchFilter = (item, f) => f === 'Tất cả' || item.tags.includes(f);

/* ── COMPONENT ────────────────────────────────────────────── */
const TrangBoSuuTap = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [gridRef,  gridVisible]  = useScrollReveal();
  const [roomsRef, roomsVisible] = useScrollReveal();

  const displayed = useMemo(
    () => COLLECTIONS.filter(c => matchFilter(c, activeFilter)),
    [activeFilter]
  );

  return (
    <div className="lavish-root">
      <DauTrang />
      <main className="bst-page">

        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="bst-hero">
          <div className="bst-hero-bg"
            style={{ backgroundImage: 'url(/images/noi_that_cao_cap_boi_canh_04.png)' }} />
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
            <Link to="/#contact" className="bst-cta-btn">
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
