import React from 'react'

const collections = [
  { id: 1, title: 'GRAND PALACE', desc: 'Sang trọng và quyền uy', price: 'Từ 125.000.000 đ', img: '/images/anhbanandai.png' },
  { id: 2, title: 'LOUIS HERITAGE', desc: 'Tinh tế, hoài cổ', price: 'Từ 98.000.000 đ', img: '/images/anhghesofa.png' },
  { id: 3, title: 'IMPERIAL MAJESTY', desc: 'Uy nghiêm và lộng lẫy', price: 'Từ 115.000.000 đ', img: '/images/anhghebandenkh.png' },
  { id: 4, title: 'ROYAL MOMENTS', desc: 'Dấu ấn hoàng gia', price: 'Từ 78.500.000 đ', img: '/images/anhbobanghe.png' }
]

const FeaturedCollections = () => {
  return (
    <div className="collections-grid">
      {collections.map((c) => (
        <div className="collection-card" key={c.id}>
          <div className="collection-media" style={{backgroundImage:`url(${c.img})`}} />
          <div className="collection-body">
            <h3>{c.title}</h3>
            <p className="muted">{c.desc}</p>
            <div className="from">{c.price}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedCollections
