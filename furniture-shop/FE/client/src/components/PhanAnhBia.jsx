import React, { useState, useEffect, useCallback, useRef } from 'react'

const slides = [
  {
    id: 1,
    eyebrow: '✦ NGHỆ THUẬT SỐNG',
    heading: 'ĐỊNH HÌNH\nĐẲNG CẤP',
    desc: 'Tinh hoa thiết kế châu Âu, kết hợp cùng vật liệu thượng hạng và chế tác thủ công – khẳng định vị thế của bạn.',
    btn: 'KHÁM PHÁ BỘ SƯU TẬP →',
    bg: '/images/anhbanghekh.png',
    products: [
      { id: 1, title: 'GHẾ BÀNH LOUIS XV', subtitle: 'Signature Collection', price: '79.800.000 ₫', img: '/images/anhghebanh.png' },
      { id: 2, title: 'BÀN ĂN GRAND PALACE', subtitle: 'Không gian tiệc tùng', price: '125.000.000 ₫', img: '/images/anhbanandai.png' },
      { id: 3, title: 'ĐÈN BÀN IMPERIAL', subtitle: 'Chi tiết mạ vàng 24K', price: '24.800.000 ₫', img: '/images/anhghebandenkh.png' },
      { id: 4, title: 'BỘ SOFA HOÀNG GIA', subtitle: 'Bọc da cao cấp Ý', price: '95.000.000 ₫', img: '/images/anhsofadai.png' },
    ]
  },
  {
    id: 2,
    eyebrow: '✦ BỘ SƯU TẬP MỚI',
    heading: 'HOÀNG GIA\nCỔ ĐIỂN',
    desc: 'Khám phá bộ sưu tập nội thất cổ điển lấy cảm hứng từ cung điện hoàng gia châu Âu, mỗi sản phẩm là một tác phẩm nghệ thuật.',
    btn: 'XEM BỘ SƯU TẬP →',
    bg: '/images/anhghesofa.png',
    products: [
      { id: 1, title: 'GIƯỜNG NGỦ HOÀNG GIA', subtitle: 'Royal Bedroom', price: '185.000.000 ₫', img: '/images/anhgiuong.png' },
      { id: 2, title: 'BỘ BÀN GHẾ SANG TRỌNG', subtitle: 'Grand Collection', price: '145.000.000 ₫', img: '/images/anhbobanghe.png' },
      { id: 3, title: 'GIƯỜNG ĐÈN TINH TẾ', subtitle: 'Classic Heritage', price: '168.000.000 ₫', img: '/images/anhgiuonghaiden.png' },
      { id: 4, title: 'BÀN ĂN CỔ ĐIỂN', subtitle: 'Dining Masterpiece', price: '112.000.000 ₫', img: '/images/anhbanan.png' },
    ]
  },
  {
    id: 3,
    eyebrow: '✦ ƯU ĐÃI ĐẶC BIỆT',
    heading: 'KHÔNG GIAN\nĐẲNG CẤP',
    desc: 'Ưu đãi lên đến 20% cho các bộ sưu tập nội thất cao cấp. Tận hưởng không gian sống hoàn hảo với mức giá ưu đãi.',
    btn: 'NHẬN ƯU ĐÃI NGAY →',
    bg: '/images/anhgiuong.png',
    products: [
      { id: 1, title: 'SOFA DA Ý', subtitle: 'Premium Italian', price: '95.000.000 ₫', img: '/images/anhsofadai.png' },
      { id: 2, title: 'GHẾ BÀNH LOUIS XV', subtitle: 'Signature Edition', price: '79.800.000 ₫', img: '/images/anhghebanh.png' },
      { id: 3, title: 'BÀN ĂN GRAND PALACE', subtitle: 'Exclusive Design', price: '125.000.000 ₫', img: '/images/anhbanandai.png' },
      { id: 4, title: 'BỘ PHÒNG KHÁCH', subtitle: 'Living Room Set', price: '210.000.000 ₫', img: '/images/anhbanghekh.png' },
    ]
  }
]

const AUTOPLAY_INTERVAL = 5000

const PhanAnhBia = () => {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef(null)
  const progressRef = useRef(null)

  const total = slides.length

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === current) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [current, isTransitioning])

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % total)
  }, [current, total, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + total) % total)
  }, [current, total, goToSlide])

  // Autoplay
  useEffect(() => {
    if (isPaused) return
    timeoutRef.current = setTimeout(nextSlide, AUTOPLAY_INTERVAL)
    return () => clearTimeout(timeoutRef.current)
  }, [current, isPaused, nextSlide])

  const slide = slides[current]

  return (
    <section
      className="hero-section-large"
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container hero-grid">
        {/* LEFT — Main banner with slide transitions */}
        <div className="hero-left">
          <div className="hero-slider">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className={`hero-slide${i === current ? ' active' : ''}${
                  i < current ? ' prev' : ''
                }`}
                style={{ backgroundImage: `url(${s.bg})` }}
              >
                <div className="hero-slide-overlay">
                  <div className="hero-slide-content">
                    <div className="eyebrow" key={`ey-${s.id}-${current}`}>{s.eyebrow}</div>
                    <h1 className="hero-head" key={`hd-${s.id}-${current}`}>
                      {s.heading.split('\n').map((line, idx) => (
                        <span key={idx}>{line}<br /></span>
                      ))}
                    </h1>
                    <p className="hero-desc" key={`dc-${s.id}-${current}`}>{s.desc}</p>
                    <div className="hero-actions" key={`ac-${s.id}-${current}`}>
                      <button className="btn primary">{s.btn}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation arrows */}
            <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Slide trước">
              ‹
            </button>
            <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Slide sau">
              ›
            </button>

            {/* Dots */}
            <div className="hero-dots-row">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  className={`hero-dot${i === current ? ' active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Đi đến slide ${i + 1}`}
                >
                  {i === current && (
                    <span
                      className="hero-dot-progress"
                      key={`prog-${current}`}
                      style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms`, animationPlayState: isPaused ? 'paused' : 'running' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Slide counter */}
            <div className="hero-counter">
              <span className="hero-counter-current">{String(current + 1).padStart(2, '0')}</span>
              <span className="hero-counter-sep">/</span>
              <span className="hero-counter-total">{String(total).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Product mini-cards */}
        <div className="hero-right">
          {slide.products.map((p, i) => (
            <div
              key={`${slide.id}-${p.id}`}
              className="mini-card"
              style={{
                backgroundImage: `url(${p.img})`,
                animationDelay: `${i * 0.1}s`
              }}
            >
              <div className="mini-body">
                <div className="mini-title">{p.title}</div>
                <div className="mini-subtitle">{p.subtitle}</div>
                {p.price && <div className="mini-price">{p.price}</div>}
                <a className="mini-link" href="#">XEM CHI TIẾT →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhanAnhBia
