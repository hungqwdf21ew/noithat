import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useAnimations'

const allCollections = [
  { id: 1, title: 'Grand Palace', desc: 'Sang trọng và quyền uy', price: 'Từ 125.000.000 đ', img: '/images/anhbanandai.png', tag: 'Bestseller', category: 'Phòng Ăn' },
  { id: 2, title: 'Louis Heritage', desc: 'Tinh tế, hoài cổ, đẳng cấp', price: 'Từ 98.000.000 đ', img: '/images/anhghesofa.png', tag: 'Mới nhất', category: 'Phòng Khách' },
  { id: 3, title: 'Imperial Majesty', desc: 'Uy nghiêm và kiêu hãnh', price: 'Từ 115.000.000 đ', img: '/images/anhghebandenkh.png', tag: 'Cao cấp', category: 'Phòng Khách' },
  { id: 4, title: 'Royal Moments', desc: 'Dấu ấn hoàng gia', price: 'Từ 78.500.000 đ', img: '/images/anhbobanghe.png', tag: 'Ưu đãi', category: 'Phòng Khách' },
  { id: 5, title: 'Queen Sleep', desc: 'Giấc mơ hoàng gia', price: 'Từ 85.000.000 đ', img: '/images/anhgiuonghaiden.png', tag: 'Cao cấp', category: 'Phòng Ngủ' },
  { id: 6, title: 'Classic Feast', desc: 'Gắn kết gia đình', price: 'Từ 65.000.000 đ', img: '/images/anhbanan.png', tag: 'Ưu đãi', category: 'Phòng Ăn' }
]

const DanhSachBoSuuTap = ({ filter }) => {
  const [ref, isVisible] = useScrollReveal()
  const displayed = filter === 'Tất Cả' ? allCollections : allCollections.filter(c => c.category === filter)

  return (
    <div className="collections-page-grid stagger-children" ref={ref}>
      {displayed.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Hiện chưa có bộ sưu tập nào trong danh mục này.
        </div>
      )}
      {displayed.map((c, i) => (
        <div
          className={`collection-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={c.id}
          style={{ transitionDelay: `${(i % 3) * 0.12}s` }}
        >
          <Link to={`/product/${c.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div className="collection-media" style={{ backgroundImage: `url(${c.img})` }}>
              <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(253, 248, 240, 0.95)', border: '1px solid rgba(201, 151, 58, 0.3)', color: '#c9973a', fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 20, zIndex: 3, backdropFilter: 'blur(8px)' }}>
                {c.tag}
              </span>
            </div>
            <div className="collection-body">
              <h3>{c.title}</h3>
              <p className="muted">{c.desc}</p>
              <div className="from">{c.price}</div>
              <button className="btn outline" style={{ marginTop: 16, width: '100%', fontSize: 12, padding: '8px 16px', cursor: 'pointer' }}>Xem Chi Tiết</button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default DanhSachBoSuuTap
