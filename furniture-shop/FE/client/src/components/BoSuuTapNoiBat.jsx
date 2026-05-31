import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useAnimations'

const collections = [
  {
    id: 1,
    title: 'Grand Palace',
    desc: 'Sang trọng và quyền uy',
    price: 'Từ 125.000.000 đ',
    img: 'https://images.unsplash.com/photo-1595514535316-70e28f237efb?auto=format&fit=crop&q=80&w=800',
    tag: 'Bestseller'
  },
  {
    id: 2,
    title: 'Louis Heritage',
    desc: 'Tinh tế, hoài cổ, đẳng cấp',
    price: 'Từ 98.000.000 đ',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    tag: 'Mới nhất'
  },
  {
    id: 3,
    title: 'Imperial Majesty',
    desc: 'Uy nghiêm và kiêu hãnh',
    price: 'Từ 115.000.000 đ',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    tag: 'Cao cấp'
  },
  {
    id: 4,
    title: 'Royal Moments',
    desc: 'Dấu ấn hoàng gia',
    price: 'Từ 78.500.000 đ',
    img: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=800',
    tag: 'Ưu đãi'
  }
]

const BoSuuTapNoiBat = () => {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div className="collections-grid stagger-children" ref={ref}>
      {collections.map((c, i) => (
        <div
          className={`collection-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={c.id}
          style={{ transitionDelay: `${i * 0.12}s` }}
        >
          <Link to={`/product/${c.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div
              className="collection-media"
              style={{ backgroundImage: `url(${c.img})` }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  background: 'rgba(253, 248, 240, 0.95)',
                  border: '1px solid rgba(201, 151, 58, 0.3)',
                  color: '#c9973a',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  padding: '4px 11px',
                  borderRadius: 20,
                  zIndex: 3,
                  backdropFilter: 'blur(8px)'
                }}
              >
                {c.tag}
              </span>
            </div>
            <div className="collection-body">
              <h3>{c.title}</h3>
              <p className="muted">{c.desc}</p>
              <div className="from">{c.price}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BoSuuTapNoiBat
