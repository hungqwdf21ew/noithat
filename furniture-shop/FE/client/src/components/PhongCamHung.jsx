import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useAnimations'

const rooms = [
  {
    id: 1,
    title: 'Phòng Khách',
    desc: 'Đẳng cấp gia chủ',
    price: 'Từ 165.000.000 đ',
    tag: 'BEST SELLER',
    img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 2,
    title: 'Phòng Ngủ',
    desc: 'Riêng tư và đầy đẳng cấp',
    price: 'Từ 98.000.000 đ',
    tag: 'MỚI',
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 3,
    title: 'Phòng Ăn',
    desc: 'Gắn kết gia đình',
    price: 'Từ 85.500.000 đ',
    tag: 'ƯU ĐÃI',
    img: 'https://images.unsplash.com/photo-1617806118233-18e1c0945591?auto=format&fit=crop&q=80&w=1000'
  }
]

const PhongCamHung = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className="rooms-grid stagger-children" ref={ref}>
      {rooms.map((r, i) => (
        <Link
          to={`/products?room=${encodeURIComponent(r.title)}`}
          className={`room-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={r.id}
          style={{
            backgroundImage: `url(${r.img})`,
            transitionDelay: `${i * 0.15}s`,
            display: 'block',
            textDecoration: 'none'
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
        </Link>
      ))}
    </div>
  )
}


export default PhongCamHung
