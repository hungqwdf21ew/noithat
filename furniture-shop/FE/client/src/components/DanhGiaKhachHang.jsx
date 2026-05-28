import React from 'react'
import { useScrollReveal, useCountUp } from '../hooks/useAnimations'

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    role: 'Kiến trúc sư',
    text: 'Sản phẩm thực sự có giá trị xứng tầm. Chất liệu gỗ cao cấp, đường nét tinh xảo như một tác phẩm nghệ thuật. Tôi rất hài lòng và sẽ tiếp tục ủng hộ.',
    stars: 5
  },
  {
    id: 2,
    name: 'Trần Gia Hiếu',
    role: 'Doanh nhân',
    text: 'Từ tư vấn đến thi công, tất cả đều hoàn hảo và chuyên nghiệp. Đội ngũ tận tâm, thời gian giao hàng đúng hẹn. Đây là lần thứ hai tôi mua đồ tại đây.',
    stars: 5
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    role: 'Bác sĩ',
    text: 'Tôi yêu sự tận tâm đến từng chi tiết nhỏ nhất. Website trực quan, dễ chọn lựa. Sản phẩm đúng như mô tả, thậm chí còn đẹp hơn khi trực tiếp ngắm nhìn.',
    stars: 5
  }
]

const DanhGiaKhachHang = () => {
  const [cardsRef, cardsVisible] = useScrollReveal()
  const [statsRef, statsVisible] = useScrollReveal()

  const rating    = useCountUp(4.9,  1800, true, statsVisible)
  const customers = useCountUp(1200, 2000, true, statsVisible)
  const percent   = useCountUp(98,   1600, true, statsVisible)

  return (
    <section className="testimonials container">
      {/* Tiêu đề */}
      <div
        className={`section-title animate-on-scroll${cardsVisible ? ' visible' : ''}`}
        ref={cardsRef}
      >
        <span className="eyebrow">✦ Khách Hàng Nói Gì</span>
        <h2>Đánh Giá Chân Thực</h2>
        <p>Hơn 2.200 khách hàng tin tưởng và yêu thích Lavish Heritage</p>
      </div>

      {/* Cards đánh giá */}
      <div className="test-grid stagger-children">
        {reviews.map((r, i) => (
          <div
            className={`test-card animate-on-scroll${cardsVisible ? ' visible' : ''}`}
            key={r.id}
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            <div className="quote">"</div>
            <p className="test-text">{r.text}</p>
            <div className="test-meta">
              <div className="avatar">
                {r.name.charAt(r.name.lastIndexOf(' ') + 1)}
              </div>
              <div>
                <div className="test-name">{r.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1, fontStyle: 'italic' }}>
                  {r.role}
                </div>
                <div className="stars">{'★'.repeat(r.stars)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thống kê */}
      <div className="stats stagger-children" ref={statsRef}>
        <div
          className={`stat animate-on-scroll${statsVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <div className="stat-icon">⭐</div>
          <div className="stat-number">{rating.toFixed(1)}<span style={{ fontSize: 16 }}>/5</span></div>
          <div className="stat-desc">ĐIỂM ĐÁNH GIÁ TRUNG BÌNH</div>
        </div>
        <div
          className={`stat animate-on-scroll${statsVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          <div className="stat-icon">❤️</div>
          <div className="stat-number">
            {Math.floor(customers).toLocaleString()}
            <span style={{ fontSize: 18 }}>+</span>
          </div>
          <div className="stat-desc">KHÁCH HÀNG THÂN THIẾT</div>
        </div>
        <div
          className={`stat animate-on-scroll${statsVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.30s' }}
        >
          <div className="stat-icon">🏆</div>
          <div className="stat-number">{Math.floor(percent)}<span style={{ fontSize: 20 }}>%</span></div>
          <div className="stat-desc">ĐỀ XUẤT VÀ TIN TƯỞNG</div>
        </div>
        <div
          className={`stat animate-on-scroll${statsVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.45s' }}
        >
          <div className="stat-icon">🚀</div>
          <div className="stat-number">15<span style={{ fontSize: 18 }}>+</span></div>
          <div className="stat-desc">NĂM KINH NGHIỆM</div>
        </div>
      </div>
    </section>
  )
}

export default DanhGiaKhachHang
