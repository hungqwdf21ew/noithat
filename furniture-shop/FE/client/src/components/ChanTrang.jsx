import React from 'react'
import { Link } from 'react-router-dom'

const ChanTrang = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Cột brand */}
        <div className="col">
          <div className="footer-brand">
            <div className="footer-crest">LH</div>
            <div className="footer-brand-name">LAVISH HERITAGE</div>
          </div>
          <p style={{ lineHeight: 1.75, marginBottom: 12 }}>
            Nơi hội tụ tinh hoa nghệ thuật nội thất châu Âu,
            dành riêng cho những chủ nhân đẳng cấp và tinh tế.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">in</a>
            <a href="#" aria-label="Pinterest">P</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>

          {/* Chứng nhận */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['ISO 9001', 'Bảo hành 10 năm', 'Giao hàng toàn quốc'].map(cert => (
              <span
                key={cert}
                style={{
                  border: '1px solid rgba(201,151,58,0.25)',
                  color: 'rgba(255,253,248,0.55)',
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 20,
                  letterSpacing: '0.3px'
                }}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Liên hệ */}
        <div className="col">
          <h4>Liên Hệ</h4>
          <p>📍 45 Nguyễn Huệ, Q.1, TP. HCM</p>
          <p>📞 (+84) 28 3822 8888</p>
          <p>✉️ info@lavishheritage.vn</p>
          <p>🌐 lavishheritage.vn</p>
          <p style={{ marginTop: 12, color: 'rgba(255,253,248,0.45)', fontSize: 12 }}>
            Thứ 2 – Chủ nhật: 8:30 – 20:30
          </p>
        </div>

        {/* Danh mục */}
        <div className="col">
          <h4>Danh Mục</h4>
          <Link to="/collections">Bộ sưu tập</Link>
          <a href="#">Phòng khách</a>
          <a href="#">Phòng ngủ</a>
          <a href="#">Phòng ăn</a>
          <a href="#">Văn phòng</a>
          <a href="#">So sánh sản phẩm</a>
          <a href="#">Cá nhân hóa không gian</a>
        </div>

        {/* Dịch vụ */}
        <div className="col">
          <h4>Dịch Vụ</h4>
          <a href="#">Tư vấn thiết kế</a>
          <a href="#">Đặt lịch showroom</a>
          <a href="#">Thiết kế 3D nội thất</a>
          <a href="#">Lắp đặt &amp; thi công</a>
          <a href="#">Bảo hành sản phẩm</a>
          <a href="#">Chính sách đổi trả</a>
        </div>

        {/* Chính sách */}
        <div className="col">
          <h4>Chính Sách</h4>
          <a href="#">Chính sách bảo hành</a>
          <a href="#">Chính sách đổi trả</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Chính sách vận chuyển</a>

          {/* Newsletter nhỏ */}
          <div style={{ marginTop: 20 }}>
            <p style={{ color: 'rgba(255,253,248,0.55)', fontSize: 12, marginBottom: 8 }}>
              Nhận ưu đãi độc quyền:
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(201,151,58,0.25)',
                  background: 'rgba(255,253,248,0.06)',
                  color: 'rgba(255,253,248,0.85)',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #c9973a, #e8c068)',
                  color: '#1e1208',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />
      <div className="copyright">
        © {new Date().getFullYear()} Lavish Heritage. All rights reserved.
        &nbsp;·&nbsp;
        <span style={{ color: 'rgba(201,151,58,0.55)' }}>Designed with ♥ in Vietnam</span>
      </div>
    </footer>
  )
}

export default ChanTrang
