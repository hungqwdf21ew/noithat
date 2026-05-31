import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useAnimations'

const BannerKhuyenMai = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className="container" style={{ marginBottom: 0 }}>
      <div
        className={`promo-banner animate-on-scroll${isVisible ? ' visible' : ''}`}
        ref={ref}
      >
        <div className="promo-content">
          <div className="eyebrow">✦ Ưu Đãi Đặc Biệt Tháng 6</div>
          <h2>
            Giảm Đến 20%<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Toàn Bộ Bộ Sưu Tập</em>
          </h2>
          <p>
            Cơ hội vàng để sở hữu những tác phẩm nội thất thượng hạng mang phong cách
            hoàng gia châu Âu với mức giá ưu đãi chưa từng có. Chương trình chỉ áp dụng
            đến hết ngày 30/06/2025.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            
            {/* ĐÃ SỬA: Thay button thành thẻ Link */}
            <Link to="/collections" className="btn primary">Xem Ưu Đãi Ngay →</Link>
            <Link to="/lien-he" className="btn outline-light">Đặt Lịch Tư Vấn</Link>
            
          </div>
          {/* Bộ đếm ngược dummy */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 24,
              alignItems: 'center'
            }}
          >
            <span style={{ color: 'rgba(255,253,248,0.5)', fontSize: 12, letterSpacing: 1 }}>
              KẾT THÚC SAU:
            </span>
            {[
              { val: '05', label: 'Ngày' },
              { val: '14', label: 'Giờ' },
              { val: '32', label: 'Phút' },
              { val: '09', label: 'Giây' }
            ].map((item, i) => (
              <div
                key={i}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    background: 'rgba(255,253,248,0.1)',
                    border: '1px solid rgba(201,151,58,0.3)',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontFamily: 'var(--serif)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--gold-light)',
                    minWidth: 44,
                    textAlign: 'center'
                  }}
                >
                  {item.val}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,253,248,0.4)', marginTop: 4, letterSpacing: 1 }}>
                  {item.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="promo-ornament" aria-hidden="true">LH</div>
      </div>
    </div>
  )
}

export default BannerKhuyenMai