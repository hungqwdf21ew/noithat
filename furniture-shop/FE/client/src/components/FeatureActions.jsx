import React from 'react'

const actions = [
  { id:1, title: 'SO SÁNH SẢN PHẨM', desc: 'Dễ dàng lựa chọn sản phẩm phù hợp nhất', btn: 'BẮT ĐẦU SO SÁNH →' },
  { id:2, title: 'KẾT HỢP SẢN PHẨM', desc: 'Phối hợp hoàn hảo cho không gian sống đẳng cấp', btn: 'KHÁM PHÁ NGAY →' },
  { id:3, title: 'CÁ NHÂN HÓA KHÔNG GIAN', desc: 'Thiết kế riêng theo gu thẩm mỹ của bạn', btn: 'TƯ VẤN MIỄN PHÍ →' }
]

const FeatureActions = () => {
  return (
    <section className="feature-actions container">
      {actions.map(a => (
        <div className="action-card" key={a.id}>
          <div className="action-bg" />
          <div className="action-body">
            <h3>{a.title}</h3>
            <p className="muted">{a.desc}</p>
            <button className="btn outline">{a.btn}</button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default FeatureActions
