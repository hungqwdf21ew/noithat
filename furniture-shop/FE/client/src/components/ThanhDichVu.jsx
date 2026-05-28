import React from 'react'
import { useScrollReveal } from '../hooks/useAnimations'

const services = [
  {
    id: 1,
    icon: '✦',
    title: 'Thiết Kế Độc Quyền',
    subtitle: 'Theo yêu cầu riêng của bạn'
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Phong Cách Riêng',
    subtitle: 'Kết hợp nghệ thuật & cá tính'
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Bảo Hành Dài Hạn',
    subtitle: 'Lên đến 10 năm chính hãng'
  },
  {
    id: 4,
    icon: '🚚',
    title: 'Giao Hàng & Lắp Đặt',
    subtitle: 'Toàn quốc & quốc tế'
  }
]

const ThanhDichVu = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <section className="service-bar container stagger-children" ref={ref}>
      {services.map((s, i) => (
        <div
          className={`service-item animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={s.id}
          style={{ transitionDelay: `${i * 0.1}s` }}
        >
          <div className="service-icon">{s.icon}</div>
          <div className="service-text">
            <div className="service-title">{s.title}</div>
            <div className="service-sub">{s.subtitle}</div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default ThanhDichVu
