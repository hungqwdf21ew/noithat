import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowRight } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useScrollReveal } from '../hooks/useAnimations';
import './collections.css';
import '../index.css';

const FILTERS = [
  'Tất cả',
  'Cổ điển',
  'Tân cổ điển',
  'Phòng khách',
  'Phòng ngủ',
  'Phòng ăn',
  'Decor',
  'Luxury',
];

const COLLECTIONS = [
  {
    id: 1,
    layout: 'hero-wave',
    title: 'Heritage Royale',
    desc: 'Tinh hoa cổ điển châu Âu — nơi mỗi chi tiết chạm khắc kể một câu chuyện về quyền quý và phong cách sống đẳng cấp.',
    img: '/images/anhghesofa.png',
    tags: ['Cổ điển', 'Phòng khách', 'Luxury'],
    link: '/products',
  },
  {
    id: 2,
    layout: 'vertical',
    title: 'Imperial Majesty',
    desc: 'Không gian ngủ hoàng gia với điểm nhấn sang trọng, tinh tế và riêng tư tuyệt đối.',
    img: '/images/anhgiuonghaiden.png',
    tags: ['Luxury', 'Phòng ngủ'],
    link: '/products',
  },
  {
    id: 3,
    layout: 'wave',
    title: 'Grand Palace Dining',
    desc: 'Bữa tiệc gia đình trở thành nghi lễ — bàn ăn hoàng gia cho không gian sum họp đẳng cấp.',
    img: '/images/anhbanandai.png',
    tags: ['Tân cổ điển', 'Phòng ăn'],
    link: '/products',
  },
  {
    id: 4,
    layout: 'horizontal',
    title: 'Royal Moments',
    desc: 'Khoảnh khắc hoàng gia trong phòng khách.',
    img: '/images/anhbobanghe.png',
    tags: ['Decor', 'Phòng khách'],
    link: '/products',
  },
  {
    id: 5,
    layout: 'horizontal',
    title: 'Louis Heritage',
    desc: 'Tinh tế, hoài cổ, đẳng cấp vượt thời gian.',
    img: '/images/anhghebandenkh.png',
    tags: ['Cổ điển', 'Phòng khách'],
    link: '/products',
  },
  {
    id: 6,
    layout: 'quote',
    quote: 'Nội thất không chỉ là vật dụng — đó là ngôn ngữ của không gian, kể câu chuyện về chủ nhân và phong cách sống.',
    author: 'Lavish Heritage',
    tags: [],
  },
];

const ROOMS = [
  {
    id: 1,
    title: 'Phòng Khách',
    desc: 'Đẳng cấp gia chủ',
    img: '/images/anhbanghekh.png',
    link: '/products',
  },
  {
    id: 2,
    title: 'Phòng Ngủ',
    desc: 'Riêng tư và đầy đẳng cấp',
    img: '/images/anhgiuong.png',
    link: '/products',
  },
  {
    id: 3,
    title: 'Phòng Ăn',
    desc: 'Gắn kết gia đình',
    img: '/images/anhbanan.png',
    link: '/products',
  },
];

const matchesFilter = (item, filter) => {
  if (filter === 'Tất cả') return true;
  return item.tags?.includes(filter);
};

const CollectionCard = ({ item }) => {
  if (item.layout === 'quote') {
    return (
      <article className="col-card col-card-quote">
        <div className="col-quote-mark">"</div>
        <p>{item.quote}</p>
        <span>— {item.author}</span>
      </article>
    );
  }

  const inner = (
    <>
      {item.layout === 'hero-wave' && (
        <>
          <div className="col-card-media" style={{ backgroundImage: `url(${item.img})` }} />
          <div className="col-card-wave-body">
            <div className="col-card-logo">✦</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="col-card-link">
              Khám phá bộ sưu tập <ArrowRight size={14} />
            </span>
          </div>
        </>
      )}

      {item.layout === 'vertical' && (
        <>
          <div className="col-card-media col-card-media-tall" style={{ backgroundImage: `url(${item.img})` }} />
          <div className="col-card-body">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="col-card-link">
              Khám phá bộ sưu tập <ArrowRight size={14} />
            </span>
          </div>
        </>
      )}

      {item.layout === 'wave' && (
        <>
          <div className="col-card-media col-card-media-md" style={{ backgroundImage: `url(${item.img})` }} />
          <div className="col-card-wave-body col-card-wave-sm">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="col-card-link">
              Khám phá bộ sưu tập <ArrowRight size={14} />
            </span>
          </div>
        </>
      )}

      {item.layout === 'horizontal' && (
        <div className="col-card-horizontal">
          <div className="col-card-media-h" style={{ backgroundImage: `url(${item.img})` }} />
          <div className="col-card-body-h">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="col-card-link">
              Khám phá <ArrowRight size={14} />
            </span>
          </div>
        </div>
      )}
    </>
  );

  const className = `col-card col-card-${item.layout}`;

  return item.link ? (
    <Link to={item.link} className={className}>
      {inner}
    </Link>
  ) : (
    <article className={className}>{inner}</article>
  );
};

const TrangBoSuuTap = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [gridRef, gridVisible] = useScrollReveal();
  const [roomsRef, roomsVisible] = useScrollReveal();

  const displayed = useMemo(
    () => COLLECTIONS.filter((c) => {
      if (c.layout === 'quote') return activeFilter === 'Tất cả';
      return matchesFilter(c, activeFilter);
    }),
    [activeFilter]
  );

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="collections-page">
        {/* Hero */}
        <section className="col-hero">
          <div className="col-hero-bg" />
          <div className="col-hero-content container">
            <nav className="col-breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Bộ sưu tập</span>
            </nav>
            <h1>Bộ Sưu Tập</h1>
            <p>
              Khám phá những bộ sưu tập nội thất cao cấp được thiết kế riêng,
              mang đậm tinh thần hoàng gia châu Âu và phong cách sống tinh hoa.
            </p>
          </div>
        </section>

        {/* Featured collections */}
        <section className="col-section container">
          <div className="col-section-title">
            <span className="col-ornament">✦ ✦ ✦</span>
            <h2>Bộ Sưu Tập Nổi Bật</h2>
            <span className="col-ornament">✦ ✦ ✦</span>
          </div>

          <div className="col-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`col-filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {displayed.length === 0 ? (
            <div className="col-empty">
              Chưa có bộ sưu tập trong danh mục này.
            </div>
          ) : (
            <div
              className={`col-masonry stagger-children${gridVisible ? ' visible' : ''}`}
              ref={gridRef}
            >
              {displayed.map((item, i) => (
                <div
                  key={item.id}
                  className={`col-masonry-item col-item-${item.layout} animate-on-scroll${gridVisible ? ' visible' : ''}`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <CollectionCard item={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Space inspiration */}
        <section className="col-section col-inspiration container">
          <div className="col-section-title">
            <span className="col-ornament">✦ ✦ ✦</span>
            <h2>Cảm Hứng Không Gian</h2>
            <span className="col-ornament">✦ ✦ ✦</span>
          </div>

          <div
            className={`col-rooms-grid stagger-children${roomsVisible ? ' visible' : ''}`}
            ref={roomsRef}
          >
            {ROOMS.map((room, i) => (
              <Link
                key={room.id}
                to={room.link}
                className={`col-room-card animate-on-scroll${roomsVisible ? ' visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="col-room-img" style={{ backgroundImage: `url(${room.img})` }} />
                <div className="col-room-body">
                  <h3>{room.title}</h3>
                  <p>{room.desc}</p>
                  <span className="col-card-link">
                    Xem thêm <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="col-cta">
          <div className="container col-cta-inner">
            <div className="col-cta-text">
              <Headphones size={22} />
              <span>Bạn cần tư vấn chọn bộ sưu tập phù hợp?</span>
            </div>
            <Link to="/#contact" className="col-cta-btn">
              Liên hệ tư vấn <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <ChanTrang />
    </div>
  );
};

export default TrangBoSuuTap;
