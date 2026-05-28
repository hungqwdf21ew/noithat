import React from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useAnimations'
import DauTrang from '../components/DauTrang'
import PhanAnhBia from '../components/PhanAnhBia'
import ThanhDichVu from '../components/ThanhDichVu'
import BoSuuTapNoiBat from '../components/BoSuuTapNoiBat'
import ThaoTacNoiBat from '../components/ThaoTacNoiBat'
import BannerKhuyenMai from '../components/BannerKhuyenMai'
import PhongCamHung from '../components/PhongCamHung'
import DanhGiaKhachHang from '../components/DanhGiaKhachHang'
import LienHeShowroom from '../components/LienHeShowroom'
import ChanTrang from '../components/ChanTrang'
import '../index.css'

const HomePage = () => {
  const [collectionsRef, collectionsVisible] = useScrollReveal()
  const [inspirationRef, inspirationVisible] = useScrollReveal()

  return (
    <div className="lavish-root">
      <DauTrang />

      <main>
        {/* Hero slider */}
        <PhanAnhBia />

        {/* Thanh dịch vụ */}
        <ThanhDichVu />

        {/* Bộ sưu tập nổi bật */}
        <section className="collections-section container" id="collections">
          <div
            className={`collections-header animate-on-scroll${collectionsVisible ? ' visible' : ''}`}
            ref={collectionsRef}
          >
            <h2>Bộ Sưu Tập Nổi Bật</h2>
            <Link className="link-all" to="/collections">Xem Tất Cả →</Link>
          </div>
          <BoSuuTapNoiBat />
        </section>

        {/* 3 thẻ tính năng: So sánh / Kết hợp / Cá nhân hóa */}
        <ThaoTacNoiBat />

        {/* Banner khuyến mãi */}
        <BannerKhuyenMai />

        {/* Phòng cảm hứng */}
        <section className="inspiration-section container" id="inspiration">
          <div
            className={`animate-on-scroll${inspirationVisible ? ' visible' : ''}`}
            ref={inspirationRef}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: '1px solid var(--border-light)'
            }}
          >
            <div>
              <div style={{
                color: 'var(--gold)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: 6
              }}>
                ✦ Không Gian Sống
              </div>
              <h2 style={{ margin: 0, fontSize: 30, letterSpacing: 2 }}>
                Không Gian Truyền Cảm Hứng
              </h2>
            </div>
            <a className="link-all" href="#">Xem Thêm Ý Tưởng →</a>
          </div>
          <PhongCamHung />
        </section>

        {/* Đánh giá khách hàng */}
        <DanhGiaKhachHang />

        {/* Liên hệ & showroom */}
        <LienHeShowroom />
      </main>

      <ChanTrang />
    </div>
  )
}

export default HomePage
