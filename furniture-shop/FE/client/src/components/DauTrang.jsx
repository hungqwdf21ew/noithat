import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'
import {
  IconSearch,
  IconHeart,
  IconUser,
  IconCart,
  IconProfile,
  IconOrders,
  IconSettings,
  IconLogout,
} from './icons/HeaderIcons'

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/collections', label: 'Bộ sưu tập' },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/compare', label: 'So sánh' },
  { to: '/bundle', label: 'Kết hợp' },
  { to: '/design-room', label: 'Thiết kế phòng' },
]

const DauTrang = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const menuRef = useRef(null)
  const searchRef = useRef(null)
  const { isLoggedIn, user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const { favoriteCount } = useFavorites()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.searchQuery.value
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      setShowSearch(false)
    }
  }

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((w) => w[0])
        .slice(-2)
        .join('')
        .toUpperCase()
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

        <nav className="main-nav glass-nav" id="main-navigation" aria-label="Menu chính">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-search-wrap" ref={searchRef}>
            <button
              type="button"
              className="header-icon-btn"
              aria-label="Tìm kiếm"
              aria-expanded={showSearch}
              onClick={() => setShowSearch((v) => !v)}
            >
              <IconSearch />
            </button>

            {showSearch && (
              <div className="header-search-panel glass-panel">
                <form onSubmit={handleSearchSubmit} className="header-search-form">
                  <input
                    name="searchQuery"
                    type="search"
                    placeholder="Tìm sản phẩm, bộ sưu tập..."
                    className="header-search-input"
                    autoFocus
                  />
                  <button type="submit" className="btn primary header-search-submit">
                    Tìm
                  </button>
                </form>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="header-user-wrap" ref={menuRef}>
              <button
                type="button"
                className="header-avatar-btn"
                onClick={() => setShowUserMenu((v) => !v)}
                aria-label="Tài khoản"
                aria-expanded={showUserMenu}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="header-avatar-img" />
                ) : (
                  <span className="header-avatar-initials">{initials}</span>
                )}
              </button>

              {showUserMenu && (
                <div className="header-user-menu glass-panel">
                  <div className="hum-header">
                    <div className="hum-avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div>
                      <div className="hum-name">{user?.fullName}</div>
                      <div className="hum-email">{user?.email}</div>
                      {isAdmin && <div className="hum-role">Quản trị viên</div>}
                    </div>
                  </div>

                  <div className="hum-divider" />

                  <Link to="/profile" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    <IconProfile />
                    Thông tin tài khoản
                  </Link>
                  <Link to="/orders" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    <IconOrders />
                    Đơn hàng của tôi
                  </Link>
                  <Link to="/favorites" className="hum-item" onClick={() => setShowUserMenu(false)}>
                    <IconHeart />
                    Sản phẩm yêu thích
                    {favoriteCount > 0 ? ` (${favoriteCount})` : ''}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="hum-item admin" onClick={() => setShowUserMenu(false)}>
                      <IconSettings />
                      Quản trị hệ thống
                    </Link>
                  )}

                  <div className="hum-divider" />

                  <button type="button" className="hum-item logout" onClick={handleLogout}>
                    <IconLogout />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/favorites" className="header-icon-btn header-fav-btn" aria-label="Yêu thích">
                <IconHeart />
                {favoriteCount > 0 && (
                  <span className="header-cart-badge">
                    {favoriteCount > 99 ? '99+' : favoriteCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="header-icon-btn header-login-btn" aria-label="Đăng nhập">
                <IconUser />
              </Link>
            </>
          )}

          <Link to="/cart" className="header-icon-btn header-cart-btn" aria-label="Giỏ hàng">
            <IconCart />
            {cartCount > 0 && (
              <span className="header-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default DauTrang
