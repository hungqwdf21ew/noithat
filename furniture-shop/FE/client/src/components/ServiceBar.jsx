import React from 'react'

const services = [
  { id: 1, title: 'THIẾT KẾ ĐỘC QUYỀN', subtitle: 'Theo yêu cầu riêng' },
  { id: 2, title: 'THIẾT KẾ ĐỘC QUYỀN', subtitle: 'Thiết kế theo phong cách riêng' },
  { id: 3, title: 'BẢO HÀNH DÀI HẠN', subtitle: 'Lên đến 10 năm' },
  { id: 4, title: 'GIAO HÀNG & LẮP ĐẶT', subtitle: 'Toàn quốc & quốc tế' }
]

const ServiceBar = () => {
  return (
    <section className="service-bar container">
      {services.map((s) => (
        <div className="service-item" key={s.id}>
          <div className="service-icon">★</div>
          <div className="service-text">
            <div className="service-title">{s.title}</div>
            <div className="service-sub">{s.subtitle}</div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ServiceBar
