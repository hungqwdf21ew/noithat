import React from 'react'
import './noibat.css'

const products = [
  { id: 1, title: 'Grand Palace', price: '125.000.000 ₫' },
  { id: 2, title: 'Louis Heritage', price: '98.000.000 ₫' },
  { id: 3, title: 'Imperial Majesty', price: '115.000.000 ₫' },
  { id: 4, title: 'Royal Moments', price: '78.500.000 ₫' }
]

const LuoiNoiBat = () => {
  return (
    <div className="grid">
      {products.map((p) => (
        <div key={p.id} className="card">
          <div className="card-media" />
          <div className="card-body">
            <h3>{p.title}</h3>
            <div className="price">{p.price}</div>
            <button className="btn small">Xem chi tiết</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LuoiNoiBat
