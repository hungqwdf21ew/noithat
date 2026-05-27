import React from 'react'
import './hero.css'

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-inner container">
        <div className="hero-left">
          <h1 className="hero-title">Nghệ thuật sống - Định hình đẳng cấp</h1>
          <p className="hero-sub">Bộ sưu tập nội thất cao cấp, tinh tế và sang trọng</p>
          <div className="hero-cta">
            <button className="btn primary">Khám phá bộ sưu tập</button>
            <button className="btn outline">Xem sản phẩm</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image" />
        </div>
      </div>
    </section>
  )
}

export default Hero
