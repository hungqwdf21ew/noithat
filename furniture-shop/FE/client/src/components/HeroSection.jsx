import React from 'react'

const productsRight = [
  {
    id: 1,
    title: 'GHẾ BÀNH LOUIS XV',
    price: '79.000.000 ₫',
    img: '/images/anhghebanh.png'
  },
  {
    id: 2,
    title: 'BÀN ĂN GRAND PALACE',
    price: '125.000.000 ₫',
    img: '/images/anhbanandai.png'
  },
  {
    id: 3,
    title: 'ĐÈN & SOFA IMPERIAL',
    price: '24.000.000 ₫',
    img: '/images/anhghebandenkh.png'
  },
  {
    id: 4,
    title: 'BỘ GHẾ SOFA DÀI',
    price: '95.000.000 ₫',
    img: '/images/anhsofadai.png'
  }
]

const HeroSection = () => {
  return (
    <section className="hero-section-large">
      <div className="container hero-grid">
        <div className="hero-left">
          <div className="hero-bg" style={{
            backgroundImage: `url(/images/anhbanghekh.png)`
          }}>
            <div className="hero-overlay">
              <div className="eyebrow">NGHỆ THUẬT SỐNG</div>
              <h1 className="hero-head">ĐỊNH HÌNH ĐẲNG CẤP</h1>
              <p className="hero-desc">Tinh hoa thiết kế châu Âu, kết hợp cùng vật liệu thượng hạng và chế tác thủ công - không gian vị thế của bạn.</p>
              <div className="hero-actions">
                <button className="btn primary">KHÁM PHÁ BỘ SƯU TẬP →</button>
              </div>
              <div className="hero-dots">● ● ●</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {productsRight.map((p) => (
            <div key={p.id} className="mini-card" style={{backgroundImage: `url(${p.img})`}}>
              <div className="mini-body">
                <div className="mini-title">{p.title}</div>
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

export default HeroSection
