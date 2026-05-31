import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconChevronLeft, IconChevronRight } from './icons/HeaderIcons'

const slides = [
  {
    id: 1,
    tag: 'Nghệ thuật sống',
    heading: 'Định hình đẳng cấp',
    desc: 'Tinh hoa thiết kế châu Âu, vật liệu thượng hạng và chế tác thủ công — khẳng định không gian của bạn.',
    btn: 'Khám phá bộ sưu tập',
    path: '/collections',
    bg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 2,
    tag: 'Bộ sưu tập mới',
    heading: 'Hoàng gia cổ điển',
    desc: 'Nội thất lấy cảm hứng từ cung điện châu Âu — mỗi chi tiết là một tác phẩm nghệ thuật.',
    btn: 'Xem sản phẩm',
    path: '/products',
    bg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 3,
    tag: 'Ưu đãi đặc biệt',
    heading: 'Không gian đẳng cấp',
    desc: 'Ưu đãi lên đến 20% cho bộ sưu tập cao cấp. Tận hưởng không gian sống hoàn hảo.',
    btn: 'Nhận ưu đãi ngay',
    path: '/register',
    bg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 4,
    tag: 'Thiết kế độc quyền',
    heading: 'Truyền cảm hứng mỗi ngày',
    desc: 'Sáng tạo phòng khách, phòng ngủ và không gian tiếp khách theo phong cách riêng của bạn.',
    btn: 'Cá nhân hóa không gian',
    path: '/design-room',
    bg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000',
  },
  {
    id: 5,
    tag: 'Lavish Heritage',
    heading: 'Di sản vượt thời gian',
    desc: 'Timeless Luxury — Crafted for Generations. Khám phá showroom và trải nghiệm trực tiếp.',
    btn: 'Liên hệ showroom',
    path: '/#contact',
    bg: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=2000',
  },
]

const AUTOPLAY_MS = 5500

const PhanAnhBia = () => {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef(null)
  const total = slides.length

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning || index === current) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 900)
    },
    [current, isTransitioning]
  )

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % total)
  }, [current, total, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + total) % total)
  }, [current, total, goToSlide])

  useEffect(() => {
    if (isPaused) return
    timeoutRef.current = setTimeout(nextSlide, AUTOPLAY_MS)
    return () => clearTimeout(timeoutRef.current)
  }, [current, isPaused, nextSlide])

  const slide = slides[current]

  return (
    <section
      className="hero-banner-section"
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banner quảng cáo"
    >
      <div className="hero-banner-inner">
        <div className="hero-banner-slider">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`hero-banner-slide${i === current ? ' active' : ''}${i < current ? ' prev' : ''}`}
              style={{ backgroundImage: `url(${s.bg})` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={i !== current}
            >
              <div className="hero-banner-glass-overlay" />
              <div className="hero-banner-content">
                <p className="hero-banner-tag">{s.tag}</p>
                <h1 className="hero-banner-title">{s.heading}</h1>
                <p className="hero-banner-desc">{s.desc}</p>
                <div className="hero-banner-actions">
                  <Link to={s.path} className="btn primary hero-banner-cta">
                    {s.btn}
                  </Link>
                  <Link to="/products" className="btn outline-light hero-banner-cta-secondary">
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="hero-banner-arrow hero-banner-arrow-left"
            onClick={prevSlide}
            aria-label="Ảnh trước"
          >
            <IconChevronLeft />
          </button>
          <button
            type="button"
            className="hero-banner-arrow hero-banner-arrow-right"
            onClick={nextSlide}
            aria-label="Ảnh tiếp theo"
          >
            <IconChevronRight />
          </button>

          <div className="hero-banner-footer">
            <div className="hero-banner-dots" role="tablist" aria-label="Chọn slide">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  className={`hero-banner-dot${i === current ? ' active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                >
                  {i === current && (
                    <span
                      className="hero-banner-dot-progress"
                      key={`prog-${current}`}
                      style={{
                        animationDuration: `${AUTOPLAY_MS}ms`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="hero-banner-counter" aria-live="polite">
              <span className="hero-banner-counter-current">
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className="hero-banner-counter-sep">/</span>
              <span className="hero-banner-counter-total">
                {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="hero-banner-caption glass-caption" aria-hidden="true">
            <span className="hero-banner-caption-label">{slide.tag}</span>
            <span className="hero-banner-caption-title">{slide.heading}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhanAnhBia
