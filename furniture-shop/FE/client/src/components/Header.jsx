import React from 'react'

const Header = () => {
  return (
    <header className="lh-header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/images/anhlogo.png" alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">LAVISH HERITAGE</div>
            <div className="brand-sub">Luxury Furniture</div>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#">TRANG CHỦ</a>
          <a href="#">BỘ SƯU TẬP</a>
          <a href="#">SẢN PHẨM</a>
          <a href="#">SO SÁNH SẢN PHẨM</a>
          <a href="#">KẾT HỢP SẢN PHẨM</a>
          <a href="#">CÁ NHÂN HÓA KHÔNG GIAN</a>
        </nav>

        <div className="header-actions">
          <button className="icon">🔍</button>
          <button className="icon">👤</button>
          <button className="icon">🛒</button>
        </div>
      </div>
    </header>
  )
}

export default Header
