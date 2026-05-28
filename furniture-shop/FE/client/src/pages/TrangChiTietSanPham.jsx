import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'
import './product.css'

// Giả lập dữ liệu sản phẩm
const productData = {
  id: '1',
  title: 'Sofa Hoàng Gia Imperial',
  sku: 'LH-SOFA-001',
  price: '115.000.000 đ',
  rating: 5,
  desc: 'Tác phẩm nghệ thuật đích thực dành cho không gian phòng khách đẳng cấp. Lấy cảm hứng từ cung điện Versailles, mỗi đường nét chạm trổ đều được thực hiện thủ công bởi các nghệ nhân hơn 20 năm kinh nghiệm.',
  images: [
    '/images/anhghebandenkh.png',
    '/images/anhghesofa.png',
    '/images/anhbanghekh.png',
    '/images/anhbobanghe.png'
  ],
  colors: [
    { name: 'Nâu Óc Chó', hex: '#5c3a21' },
    { name: 'Vàng Hoàng Gia', hex: '#d4af37' },
    { name: 'Đen Huyền Bí', hex: '#1a1a1a' }
  ],
  sizes: ['Tiêu chuẩn (220cm)', 'Lớn (280cm)', 'Đặc biệt (Góc L)'],
  details: {
    materials: 'Khung gỗ Gõ Đỏ nhập khẩu nguyên khối, sơn Inchem 6 lớp tĩnh điện. Bọc da bò thật 100% nhập khẩu từ Ý, đệm mút K43 chống xẹp lún.',
    dimensions: '220cm (Dài) x 95cm (Rộng) x 115cm (Cao)',
    warranty: 'Bảo hành khung gỗ 10 năm, bảo hành da 3 năm. Bảo trì trọn đời.'
  }
}

const TrangChiTietSanPham = () => {
  const { id } = useParams() // Lấy ID từ URL (để sau này fetch data thật)
  const [activeImg, setActiveImg] = useState(productData.images[0])
  const [activeColor, setActiveColor] = useState(productData.colors[0].name)
  const [activeSize, setActiveSize] = useState(productData.sizes[0])
  const [activeTab, setActiveTab] = useState('desc')

  // Cuộn lên đầu trang khi vào trang
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="lavish-root">
      <DauTrang />
      
      <main className="product-page">
        <div className="container">
          
          <div className="breadcrumb">
            <Link to="/">Trang Chủ</Link> <span>/</span>
            <Link to="/collections">Bộ Sưu Tập</Link> <span>/</span>
            <span>{productData.title}</span>
          </div>

          <div className="product-grid">
            {/* Cột trái: Thư viện ảnh */}
            <div className="product-gallery">
              <div 
                className="main-image" 
                style={{ backgroundImage: `url(${activeImg})` }} 
              />
              <div className="thumbnail-list">
                {productData.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumb-item ${activeImg === img ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => setActiveImg(img)}
                  />
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin & Tùy chọn */}
            <div className="product-info">
              <h1>{productData.title}</h1>
              <div className="product-sku">Mã sản phẩm: {productData.sku} | Đánh giá: {'★'.repeat(productData.rating)}</div>
              
              <div className="product-price">{productData.price}</div>
              <p className="product-desc">{productData.desc}</p>

              {/* Tùy chọn màu gỗ/da */}
              <div className="option-group">
                <div className="option-label">Màu Sắc / Chất Liệu: {activeColor}</div>
                <div className="color-options">
                  {productData.colors.map(c => (
                    <div 
                      key={c.name}
                      className={`color-circle ${activeColor === c.name ? 'active' : ''}`}
                      onClick={() => setActiveColor(c.name)}
                      title={c.name}
                    >
                      <div className="color-circle-inner" style={{ backgroundColor: c.hex }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tùy chọn kích thước */}
              <div className="option-group">
                <div className="option-label">Kích Thước:</div>
                <div className="size-options">
                  {productData.sizes.map(s => (
                    <button 
                      key={s}
                      className={`size-btn ${activeSize === s ? 'active' : ''}`}
                      onClick={() => setActiveSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="product-actions">
                <button className="btn outline">Thêm Vào Giỏ Hàng</button>
                <button className="btn primary">Tư Vấn & Đặt Hàng →</button>
                <button className="wishlist-btn" title="Thêm vào yêu thích">♥</button>
              </div>
              
              {/* Box thông báo nhỏ */}
              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-light)', border: '1px solid var(--border-light)', borderRadius: 10, fontSize: 13, color: 'var(--text-mid)', display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🚚</span>
                <div>
                  <strong>Miễn phí vận chuyển & Lắp đặt tận nơi</strong>
                  <div style={{ marginTop: 4 }}>Khu vực nội thành Hà Nội & TP. Hồ Chí Minh. Có chuyên gia kỹ thuật giám sát 1:1.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết & Thông số (Tabs) */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                Câu Chuyện Thiết Kế
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Thông Số & Chất Liệu
              </button>
              <button 
                className={`tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
                onClick={() => setActiveTab('warranty')}
              >
                Chính Sách Bảo Hành
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'desc' && (
                <div>
                  <p>Lấy cảm hứng từ những cung điện tráng lệ bậc nhất Châu Âu, bộ sofa <strong>{productData.title}</strong> là biểu tượng của sự uy quyền và vị thế của gia chủ. Mỗi đường cong, mỗi họa tiết chạm trổ trên phần khung gỗ đều là kết quả của hàng trăm giờ lao động miệt mài từ những nghệ nhân mộc tài hoa nhất.</p>
                  <p>Phần tựa lưng cao đính khuy nệm (tufting) đặc trưng kết hợp cùng viền đinh đồng mang lại vẻ đẹp cổ điển, vượt thời gian. Không gian phòng khách của bạn sẽ thực sự hóa thành một không gian hoàng gia lộng lẫy.</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <ul>
                  <li><strong>Chất liệu chính:</strong> {productData.details.materials}</li>
                  <li><strong>Kích thước tổng thể:</strong> {productData.details.dimensions}</li>
                  <li><strong>Phong cách:</strong> Cổ điển / Tân Cổ Điển Châu Âu</li>
                  <li><strong>Xuất xứ:</strong> Sản xuất tại Việt Nam theo tiêu chuẩn Châu Âu.</li>
                </ul>
              )}
              {activeTab === 'warranty' && (
                <div>
                  <p><strong>Bảo hành chính hãng:</strong> {productData.details.warranty}</p>
                  <ul>
                    <li>Bảo dưỡng định kỳ miễn phí 6 tháng/lần trong vòng 2 năm đầu tiên.</li>
                    <li>Đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất.</li>
                    <li>Hỗ trợ bọc lại da, làm mới sơn với chi phí ưu đãi trọn đời.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>

      <ChanTrang />
    </div>
  )
}

export default TrangChiTietSanPham
