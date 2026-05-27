import React from 'react'

const rooms = [
  { id:1, title:'PHÒNG KHÁCH', desc:'Đẳng cấp gia chủ', price:'Từ 165.000.000 đ', img:'/images/anhbanghekh.png' },
  { id:2, title:'PHÒNG NGỦ', desc:'Riêng tư và đầy đẳng cấp', price:'Từ 98.000.000 đ', img:'/images/anhgiuonghaiden.png' },
  { id:3, title:'PHÒNG ĂN', desc:'Gắn kết gia đình', price:'Từ 85.500.000 đ', img:'/images/anhbanan.png' }
]

const InspirationRooms = () => {
  return (
    <div className="rooms-grid">
      {rooms.map(r => (
        <div className="room-card" key={r.id} style={{backgroundImage:`url(${r.img})`}}>
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

export default InspirationRooms
