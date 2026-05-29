import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DauTrang = () => {
  const [scrolled, setScrolled]       = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  const { isLoggedIn, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  // Lấy chữ cái đầu tên để hiển thị avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : '?'

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
          <Link to="/products">SẢN PHẨM</Link>
          <Link to="/compare">SO SÁNH SẢN PHẨM</Link>
          <a href="#combine">KẾT HỢP SẢN PHẨM</a>
          <a href="#personalize">CÁ NHÂN HÓA KHÔNG GIAN</a>
        </nav>

        <div className="header-actions">
          <button className="icon" aria-label="Tìm kiếm">🔍</button>

          {/* User button */}
          {isLoggedIn ? (
            <div className="header-user-wrap" ref={menuRef}>
              <button
                className="header-avatar-btn"
                onClick={() => setShowUserMenu(v => !v)}
                aria-label="Tài khoản"
              >
                {user?.avatar
                  ? <img src={user.avatar} alt={user.fullName} className="header-avatar-img" />
                  : <span className="header-avatar-initials">{initials}</span>
                }
              </button>

              {showUserMenu && (
                <div className="header-user-menu">
                  <div className="hum-header">
                    <div className="hum-avatar">
                      {user?.avatar
                        ? <img src={user.avatar} alt={user.fullName} />
                        : <span>{initials}</span>
                      }
                    </div>
                    <div>
                      <div className="hum-name">{user?.fullName}</div>
                      <div className="hum-email">{user?.email}</div>
                      {isAdmin && <div className="hum-role">Quản trị viên</div>}
                    </div>
                  </div>

                  <div className="hum-divider" />

                  <Link to="/profile" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    👤 Thông tin tài khoản
                  </Link>
                  <Link to="/orders" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    📦 Đơn hàng của tôi
                  </Link>
                  <Link to="/favorites" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    ❤️ Sản phẩm yêu thích
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="hum-item admin" onClick={() => setShowUserMenu(false)}>
                      ⚙️ Quản trị hệ thống
                    </Link>
                  )}

                  <div className="hum-divider" />

                  <button className="hum-item logout" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon header-login-btn" aria-label="Đăng nhập">
              👤
            </Link>
          )}

          <button className="icon" aria-label="Giỏ hàng">🛒</button>
        </div>
      </div>
    </header>
  )
}

export default DauTrang
