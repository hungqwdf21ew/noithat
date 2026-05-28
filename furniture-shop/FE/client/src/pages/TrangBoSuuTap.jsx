import React, { useState } from 'react'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'
import ThanhBoLoc from '../components/ThanhBoLoc'
import DanhSachBoSuuTap from '../components/DanhSachBoSuuTap'
import './collections.css'
import '../index.css'

const TrangBoSuuTap = () => {
  const [activeFilter, setActiveFilter] = useState('Tất Cả')

  return (
    <div className="lavish-root">
      <DauTrang />
      
      <main>
        {/* Banner riêng cho trang bộ sưu tập */}
        <div className="collections-page-hero">
          <div className="content">
            <h1>Bộ Sưu Tập Nghệ Thuật</h1>
            <p>Tuyển tập những kiệt tác nội thất mang đậm dấu ấn hoàng gia Châu Âu, thiết kế độc quyền dành riêng cho không gian sống của giới tinh hoa.</p>
          </div>
        </div>

        <div className="container" style={{ padding: '20px 24px 60px' }}>
          <ThanhBoLoc activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <DanhSachBoSuuTap filter={activeFilter} />
        </div>
      </main>

      <ChanTrang />
    </div>
  )
}

export default TrangBoSuuTap
