import { Link } from 'react-router-dom'

const QuangCaoDauTrang = () => {
  return (
    <div className="top-promo-bar" role="region" aria-label="Ưu đãi">
      <div className="top-promo-bar-inner">
        <span className="top-promo-accent" aria-hidden="true" />
        <p className="top-promo-text">
          Đăng ký tài khoản hôm nay — <strong>giảm 20%</strong> cho đơn hàng đầu tiên
        </p>
        <Link to="/register" className="top-promo-link">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  )
}

export default QuangCaoDauTrang
