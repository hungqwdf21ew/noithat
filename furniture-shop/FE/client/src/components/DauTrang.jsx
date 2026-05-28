import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const DauTrang = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`lh-header${scrolled ? ' scrolled' : ''}`} id="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src="/images/anhlogo.png" alt="Lavish Heritage Logo" className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">LAVISH HERITAGE</div>
            <div className="brand-sub">Timeless Luxury · Crafted for Generations</div>
          </div>
        </Link>

        <nav className="main-nav" id="main-navigation">
          <Link to="/">TRANG CHỦ</Link>
          <Link to="/collections">BỘ SƯU TẬP</Link>
          <a href="#products">SẢN PHẨM</a>
          <a href="#compare">SO SÁNH SẢN PHẨM</a>
          <a href="#combine">KẾT HỢP SẢN PHẨM</a>
          <a href="#personalize">CÁ NHÂN HÓA KHÔNG GIAN</a>
        </nav>

        <div className="header-actions">
          <button className="icon" aria-label="Tìm kiếm">🔍</button>
          <button className="icon" aria-label="Tài khoản">👤</button>
          <button className="icon" aria-label="Giỏ hàng">🛒</button>
        </div>
      </div>
    </header>
  )
}

export default DauTrang
