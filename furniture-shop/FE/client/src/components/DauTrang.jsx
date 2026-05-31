import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'

const DauTrang = () => {
  const [scrolled, setScrolled]       = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false) // Thêm state cho thanh tìm kiếm
  const menuRef = useRef(null)
  const searchRef = useRef(null) // Ref cho thanh tìm kiếm
  const { isLoggedIn, user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const { favoriteCount } = useFavorites()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Đóng menu và thanh tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
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

  // Xử lý tìm kiếm (mẫu)
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.searchQuery.value
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      setShowSearch(false)
    }
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
          <Link to="/bundle">KẾT HỢP SẢN PHẨM</Link>
          <Link to="/design-room">CÁ NHÂN HÓA KHÔNG GIAN</Link>
        </nav>

        <div className="header-actions">
          {/* Nút Tìm kiếm */}
          <div style={{ position: 'relative' }} ref={searchRef}>
            <button 
              className="icon" 
              aria-label="Tìm kiếm"
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍
            </button>
            
            {/* Box tìm kiếm hiện ra khi click */}
            {showSearch && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '10px',
                background: '#fff',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                gap: '8px'
              }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    name="searchQuery"
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      outline: 'none',
                      width: '200px'
                    }}
                    autoFocus
                  />
                  <button type="submit" className="btn primary" style={{ padding: '8px 16px', minWidth: 'auto' }}>
                    Tìm
                  </button>
                </form>
              </div>
            )}
          </div>

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
                    ❤️ Sản phẩm yêu thích{favoriteCount > 0 ? ` (${favoriteCount})` : ''}
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
            <>
              <Link to="/favorites" className="icon header-fav-btn" aria-label="Yêu thích">
                ❤️
                {favoriteCount > 0 && (
                  <span className="header-cart-badge">{favoriteCount > 99 ? '99+' : favoriteCount}</span>
                )}
              </Link>
              <Link to="/login" className="icon header-login-btn" aria-label="Đăng nhập">
                👤
              </Link>
            </>
          )}

          <Link to="/cart" className="icon header-cart-btn" aria-label="Giỏ hàng">
            🛒
            {cartCount > 0 && <span className="header-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default DauTrang