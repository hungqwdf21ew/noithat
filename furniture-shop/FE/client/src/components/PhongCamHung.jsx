import React from 'react'
import { useScrollReveal } from '../hooks/useAnimations'

const rooms = [
  {
    id: 1,
    title: 'Phòng Khách',
    desc: 'Đẳng cấp gia chủ',
    price: 'Từ 165.000.000 đ',
    tag: 'BEST SELLER',
    img: '/images/anhbanghekh.png'
  },
  {
    id: 2,
    title: 'Phòng Ngủ',
    desc: 'Riêng tư và đầy đẳng cấp',
    price: 'Từ 98.000.000 đ',
    tag: 'MỚI',
    img: '/images/anhgiuonghaiden.png'
  },
  {
    id: 3,
    title: 'Phòng Ăn',
    desc: 'Gắn kết gia đình',
    price: 'Từ 85.500.000 đ',
    tag: 'ƯU ĐÃI',
    img: '/images/anhbanan.png'
  }
]

const PhongCamHung = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className="rooms-grid stagger-children" ref={ref}>
      {rooms.map((r, i) => (
        <div
          className={`room-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={r.id}
          style={{
            backgroundImage: `url(${r.img})`,
            transitionDelay: `${i * 0.15}s`
          }}
        >
          <div className="room-tag">{r.tag}</div>
          <div className="room-overlay">
            <div className="room-info">
              <h3>{r.title}</h3>
              <p className="muted">{r.desc}</p>
              <div className="from">{r.price}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PhongCamHung
