import { useScrollReveal } from '../hooks/useAnimations'

const LienHeShowroom = () => {
  const [ref, isVisible] = useScrollReveal()

  // Hàm xử lý gửi form Liên Hệ Tư Vấn
  const handleContactSubmit = (e) => {
    e.preventDefault() // Ngăn chặn tải lại trang
    // Tại đây, bạn sẽ gọi API gửi dữ liệu đi
    alert('Cảm ơn bạn! Yêu cầu tư vấn của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm nhất.')
    e.target.reset() // Xóa trống form sau khi gửi thành công
  }

  // Hàm xử lý gửi form Đặt Lịch Showroom
  const handleBookingSubmit = (e) => {
    e.preventDefault()
    alert('Đặt lịch thành công! Chúng tôi đã gửi email xác nhận cho bạn.')
    e.target.reset()
  }

  return (
    <section className="contact-showroom container" id="contact" ref={ref}>
      {/* Tiêu đề */}
      <div className={`section-title animate-on-scroll${isVisible ? ' visible' : ''}`}>
        <span className="eyebrow">✦ Chúng Tôi Lắng Nghe Bạn</span>
        <h2>Liên Hệ & Đặt Lịch Showroom</h2>
        <p>Hãy để đội ngũ chuyên gia của chúng tôi giúp bạn tạo nên không gian sống trong mơ</p>
      </div>

      <div className="contact-grid stagger-children">
        {/* Form tư vấn */}
        <div
          className={`contact-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0s' }}
        >
          <h3>Form Liên Hệ Tư Vấn</h3>
          <form onSubmit={handleContactSubmit}>
            <div className="form-row">
              <input placeholder="Họ và tên" id="contact-name" required />
              <input placeholder="Số điện thoại" id="contact-phone" required />
            </div>
            <div className="form-row">
              <input placeholder="Email" id="contact-email" type="email" required />
              <input placeholder="Phòng / bộ sưu tập quan tâm" id="contact-interest" />
            </div>
            <textarea placeholder="Nội dung cần tư vấn..." id="contact-message" rows="4" required />
            <label className="checkbox">
              <input type="checkbox" id="contact-agree" required />
              Đồng ý nhận tư vấn &amp; thông tin ưu đãi từ Lavish Heritage
            </label>
            {/* ĐÃ SỬA: Đổi type="button" thành type="submit" */}
            <button className="btn primary" type="submit" id="btn-send-contact" style={{ width: '100%' }}>
              Gửi Yêu Cầu →
            </button>
          </form>
        </div>

        {/* Đặt lịch showroom */}
        <div
          className={`contact-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.15s' }}
        >
          <h3>Đặt Lịch Hẹn Showroom</h3>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-row">
              <input placeholder="Họ và tên" id="booking-name" required />
              <input placeholder="Số điện thoại" id="booking-phone" required />
            </div>
            <div className="form-row">
              <input placeholder="Email" id="booking-email" type="email" required />
              <input placeholder="Chọn showroom" id="booking-showroom" required />
            </div>
            <div className="form-row">
              <input placeholder="Ngày hẹn" type="date" id="booking-date" required />
              <input placeholder="Giờ hẹn" type="time" id="booking-time" required />
            </div>
            <div className="form-row">
              <input placeholder="Dịch vụ quan tâm" id="booking-service" />
              <input placeholder="Ghi chú (nếu có)" id="booking-note" />
            </div>
            {/* ĐÃ SỬA: Đổi type="button" thành type="submit" */}
            <button className="btn primary" type="submit" id="btn-book-showroom" style={{ width: '100%' }}>
              Đặt Lịch Ngay →
            </button>
          </form>
        </div>

        {/* Thông tin showroom */}
        <div
          className={`contact-card info animate-on-scroll${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <h3>Thông Tin Showroom</h3>
          <div className="showroom-img" style={{ backgroundImage: `url(/images/anhbanghekh.png)` }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', fontSize: 16, marginTop: 1 }}>📍</span>
              <div>
                <p style={{ margin: 0 }}><strong>Showroom Chính</strong></p>
                <p style={{ margin: '2px 0 0' }}>45 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: 'var(--gold)', fontSize: 16 }}>📞</span>
              <p style={{ margin: 0 }}>Hotline: <strong>(+84) 28 3822 8888</strong></p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: 'var(--gold)', fontSize: 16 }}>🕐</span>
              <p style={{ margin: 0 }}>Giờ mở cửa: <strong>8:30 – 20:30</strong></p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: 'var(--gold)', fontSize: 16 }}>✉️</span>
              <p style={{ margin: 0 }}>info@lavishheritage.vn</p>
            </div>
          </div>

          {/* Dải dịch vụ nhỏ */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--border-light)'
            }}
          >
            {['Tư vấn miễn phí', 'Thiết kế 3D', 'Lắp đặt tận nhà', 'Bảo hành 10 năm'].map(s => (
              <span
                key={s}
                style={{
                  background: 'var(--bg-section)',
                  border: '1px solid var(--gold-border)',
                  color: 'var(--gold)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 20,
                  letterSpacing: '0.3px'
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LienHeShowroom