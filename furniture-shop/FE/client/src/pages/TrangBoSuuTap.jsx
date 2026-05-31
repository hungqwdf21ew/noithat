import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowRight, Play, Sparkles } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useScrollReveal } from '../hooks/useAnimations';
import './collections.css';
import '../index.css';

const FILTERS = [
  'Tất cả',
  'Phòng khách',
  'Phòng ngủ',
  'Hiện đại',
  'Cổ điển',
  'Decor',
];

const BENTO_COLLECTIONS = [
  {
    id: 1,
    size: 'bento-large', // 2x2
    title: 'Minimalist Elegance',
    subtitle: 'Sự tĩnh lặng của không gian',
    img: '/images/bst1.png',
    tags: ['Phòng khách', 'Hiện đại'],
    link: '/products',
  },
  {
    id: 2,
    size: 'bento-tall', // 1x2
    title: 'Royal Oak',
    subtitle: 'Sắc xanh lục bảo & Gỗ óc chó',
    img: '/images/bst2.png',
    tags: ['Cổ điển', 'Phòng khách'],
    link: '/products',
  },
  {
    id: 3,
    size: 'bento-wide', // 2x1
    title: 'Glass & Stone',
    subtitle: 'Nét chạm khắc từ thiên nhiên',
    img: '/images/bst3.png',
    tags: ['Phòng khách', 'Hiện đại'],
    link: '/products',
  },
  {
    id: 4,
    size: 'bento-small', // 1x1
    title: 'Cozy Terracotta',
    subtitle: 'Ấm áp & Gần gũi',
    img: '/images/bst4.png',
    tags: ['Decor'],
    link: '/products',
  },
  {
    id: 5,
    size: 'bento-small', // 1x1
    title: 'Navy Gold',
    subtitle: 'Quyền uy bóng tối',
    img: '/images/bst5.png',
    tags: ['Cổ điển', 'Phòng khách'],
    link: '/products',
  },
  {
    id: 6,
    size: 'bento-wide', // 2x1
    title: 'Luxe Bedroom',
    subtitle: 'Giấc ngủ của bậc đế vương',
    img: '/images/bst6.png',
    tags: ['Phòng ngủ', 'Cổ điển'],
    link: '/products',
  },
  {
    id: 7,
    size: 'bento-tall', // 1x2
    title: 'Coastal Sage',
    subtitle: 'Hơi thở đại dương',
    img: '/images/bst7.png',
    tags: ['Phòng khách', 'Hiện đại'],
    link: '/products',
  },
  {
    id: 8,
    size: 'bento-large', // 2x2
    title: 'Black Marble',
    subtitle: 'Kỷ nguyên đương đại',
    img: '/images/bst8.png',
    tags: ['Phòng khách', 'Hiện đại'],
    link: '/products',
  },
  {
    id: 9,
    size: 'bento-small', // 1x1
    title: 'Modern Light',
    subtitle: 'Nghệ thuật chiếu sáng',
    img: '/images/bst9.png',
    tags: ['Decor', 'Hiện đại'],
    link: '/products',
  },
  {
    id: 10,
    size: 'bento-small', // 1x1
    title: 'Reading Nook',
    subtitle: 'Góc thư giãn êm ái',
    img: '/images/bst10.png',
    tags: ['Phòng ngủ', 'Decor'],
    link: '/products',
  }
];

const ROOMS = [
  {
    id: 1,
    title: 'Phòng Khách',
    desc: 'Nơi khởi nguồn của những câu chuyện, với sofa da cao cấp, bàn trà mặt kính cường lực và hệ thống ánh sáng chuẩn hoàng gia.',
    img: '/images/bst11.png',
    link: '/products',
  },
  {
    id: 2,
    title: 'Phòng Ngủ',
    desc: 'Không gian riêng tư tuyệt đối, tĩnh lặng và sang trọng với giường bọc nỉ tuyết và rèm cản sáng cao cấp.',
    img: '/images/bst12.png',
    link: '/products',
  },
];

const matchesFilter = (item, filter) => {
  if (filter === 'Tất cả') return true;
  return item.tags?.includes(filter);
};

const TrangBoSuuTap = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [gridRef, gridVisible] = useScrollReveal();
  const [roomsRef, roomsVisible] = useScrollReveal();

  const displayed = useMemo(
    () => BENTO_COLLECTIONS.filter((c) => matchesFilter(c, activeFilter)),
    [activeFilter]
  );

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="collections-page">
        {/* Creative Editorial Hero */}
        <section className="col-editorial-hero">
          <div className="col-hero-background" style={{ backgroundImage: 'url(/images/bst13.png)' }}></div>
          <div className="col-hero-overlay"></div>
          
          <div className="col-hero-content container">
            <div className="col-hero-badge animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Sparkles size={14} /> NEW COLLECTION 2026
            </div>
            
            <h1 className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Nghệ Thuật <br/><span className="text-gold">Sắp Đặt Không Gian</span>
            </h1>
            
            <p className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              Khám phá ngôn ngữ của sự tĩnh lặng và xa xỉ qua các bộ sưu tập nội thất phiên bản giới hạn. 
              Mỗi món đồ là một tác phẩm điêu khắc nghệ thuật đương đại.
            </p>

            <div className="col-hero-actions animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <button className="btn-explore" onClick={() => {
                document.getElementById('bento-grid').scrollIntoView({ behavior: 'smooth' });
              }}>
                Khám phá ngay <ArrowRight size={18} />
              </button>
              <button className="btn-play-video">
                <span className="play-icon-wrapper"><Play fill="currentColor" size={14} /></span> Xem Video 
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section id="bento-grid" className="bento-section container">
          <div className="col-section-header">
            <h2>Kiệt Tác <span className="text-light">Thiết Kế</span></h2>
            
            <div className="bento-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`bento-filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div 
            className={`bento-grid-container ${gridVisible ? 'animate-grid' : ''}`} 
            ref={gridRef}
          >
            {displayed.length === 0 ? (
              <div className="bento-empty">
                <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
              </div>
            ) : (
              displayed.map((item, index) => (
                <Link 
                  to={item.link} 
                  key={item.id} 
                  className={`bento-item ${item.size}`}
                  style={{ '--animation-order': index }}
                >
                  <div className="bento-item-bg" style={{ backgroundImage: `url(${item.img})` }}></div>
                  <div className="bento-item-overlay"></div>
                  <div className="bento-item-content">
                    <span className="bento-badge">{item.tags[0]}</span>
                    <div className="bento-text">
                      <h3>{item.title}</h3>
                      <p>{item.subtitle}</p>
                    </div>
                    <div className="bento-arrow">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Parallax Room Inspiration */}
        <section className="parallax-rooms-section">
          <div className="parallax-header container">
            <h2>Cảm Hứng <br/><span className="text-light">Không Gian</span></h2>
          </div>
          
          <div className="parallax-rooms-list" ref={roomsRef}>
            {ROOMS.map((room, i) => (
              <div key={room.id} className={`parallax-room ${roomsVisible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.2}s` }}>
                <div className="parallax-room-image">
                  <div className="image-wrapper">
                    <img src={room.img} alt={room.title} />
                  </div>
                </div>
                <div className="parallax-room-content">
                  <div className="room-number">0{i + 1}</div>
                  <h3>{room.title}</h3>
                  <p>{room.desc}</p>
                  <Link to={room.link} className="room-explore-link">
                    Xem sản phẩm trong phòng <span className="line"></span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="col-cta">
          <div className="container col-cta-inner">
            <div className="col-cta-text">
              <Headphones size={28} className="text-gold" />
              <div>
                <h4>Cần tư vấn thiết kế nội thất?</h4>
                <p>Chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và kiến tạo không gian sống mơ ước cho bạn.</p>
              </div>
            </div>
            <Link to="/#contact" className="col-cta-btn">
              Đặt Lịch Hẹn Ngay <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <ChanTrang />
    </div>
  );
};

export default TrangBoSuuTap;
