import React from 'react'

const reviews = [
  { id:1, name:'Nguyễn Minh Anh', text:'Không gian đẹp tỉ mỉ và sang trọng. Sản phẩm thượng hạng, đội ngũ tận tâm.', avatar:'' },
  { id:2, name:'Trần Gia Hiếu', text:'Tư vấn chuyên nghiệp, sản phẩm đúng như mô tả. Rất hài lòng.', avatar:'' },
  { id:3, name:'Lê Hoàng Nam', text:'Sản phẩm tinh xảo, dịch vụ chu đáo. Sẽ giới thiệu bạn bè.', avatar:'' }
]

const Testimonials = () => {
  return (
    <section className="testimonials container">
      <h2>ĐÁNH GIÁ KHÁCH HÀNG</h2>
      <div className="test-grid">
        {reviews.map(r => (
          <div className="test-card" key={r.id}>
            <div className="quote">“</div>
            <p className="test-text">{r.text}</p>
            <div className="test-meta">
              <div className="avatar">{r.name.split(' ')[0][0]}</div>
              <div>
                <div className="test-name">{r.name}</div>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-number">4.9/5</div>
          <div className="stat-desc">Đánh giá từ 2.200+ khách hàng</div>
        </div>
        <div className="stat">
          <div className="stat-number">1.200+</div>
          <div className="stat-desc">Khách hàng thân thiết</div>
        </div>
        <div className="stat">
          <div className="stat-number">98%</div>
          <div className="stat-desc">Đề xuất & tin tưởng</div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
