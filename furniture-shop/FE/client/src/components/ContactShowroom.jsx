import React from 'react'

const ContactShowroom = () => {
  return (
    <section className="contact-showroom container">
      <h2>LIÊN HỆ TƯ VẤN & ĐẶT LỊCH SHOWROOM</h2>
      <div className="contact-grid">
        <div className="contact-card">
          <h3>FORM LIÊN HỆ TƯ VẤN</h3>
          <form>
            <input placeholder="Họ và tên" />
            <input placeholder="Số điện thoại" />
            <input placeholder="Email" />
            <input placeholder="Phòng/bộ sưu tập quan tâm" />
            <textarea placeholder="Nội dung cần tư vấn" />
            <label className="checkbox"><input type="checkbox" /> Tôi đồng ý nhận tư vấn</label>
            <button className="btn primary" type="button">GỬI YÊU CẦU</button>
          </form>
        </div>

        <div className="contact-card">
          <h3>ĐẶT LỊCH HẸN SHOWROOM</h3>
          <form>
            <input placeholder="Họ và tên" />
            <input placeholder="Số điện thoại" />
            <input placeholder="Email" />
            <input placeholder="Chọn showroom" />
            <input placeholder="Ngày hẹn" type="date" />
            <input placeholder="Giờ hẹn" type="time" />
            <input placeholder="Dịch vụ quan tâm" />
            <textarea placeholder="Ghi chú" />
            <button className="btn primary" type="button">ĐẶT LỊCH NGAY</button>
          </form>
        </div>

        <div className="contact-card info">
          <h3>THÔNG TIN SHOWROOM</h3>
          <div className="showroom-img" style={{backgroundImage:`url(/images/anhbanghekh.png)`}} />
          <p><strong>Showroom chính:</strong> 45 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh</p>
          <p><strong>Giờ mở cửa:</strong> 8:30 - 20:30</p>
          <p><strong>Hotline:</strong> (+84) 28 3822 8888</p>
        </div>
      </div>
    </section>
  )
}

export default ContactShowroom
