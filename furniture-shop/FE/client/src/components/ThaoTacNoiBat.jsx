import React from 'react'
import { useScrollReveal } from '../hooks/useAnimations'

const actions = [
  {
    id: 1,
    icon: '⚖️',
    title: 'So Sánh Sản Phẩm',
    desc: 'Dễ dàng đặt hai sản phẩm cạnh nhau để chọn ra món đồ hoàn hảo nhất cho không gian của bạn.',
    btn: 'Bắt Đầu So Sánh →'
  },
  {
    id: 2,
    icon: '🧩',
    title: 'Kết Hợp Nội Thất',
    desc: 'Phối hợp hoàn hảo các bộ sưu tập để tạo nên không gian sống đẳng cấp mang dấu ấn châu Âu.',
    btn: 'Khám Phá Ngay →'
  },
  {
    id: 3,
    icon: '🏠',
    title: 'Cá Nhân Hóa Không Gian',
    desc: 'Đội ngũ chuyên gia tư vấn riêng giúp bạn thiết kế không gian sống theo gu thẩm mỹ độc đáo.',
    btn: 'Tư Vấn Miễn Phí →'
  }
]

const ThaoTacNoiBat = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <section className="feature-actions container stagger-children" ref={ref} id="compare">
      {actions.map((a, i) => (
        <div
          className={`action-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={a.id}
          style={{ transitionDelay: `${i * 0.15}s` }}
        >
          <div className="action-bg" />
          <div className="action-body">
            <div className="action-icon">{a.icon}</div>
            <h3>{a.title}</h3>
            <p className="muted">{a.desc}</p>
            <button className="btn outline">{a.btn}</button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ThaoTacNoiBat
