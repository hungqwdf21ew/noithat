import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, CreditCard, MapPin, Receipt, Download, ArrowLeft } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import './OrderDetailPage.css';

// Mock data (In real app, fetch from API using ID)
const mockOrderDetails = {
  id: '#ORD-2026-001',
  date: '28-05-2026 14:30',
  status: 'DELIVERED', // PROCESSING, SHIPPED, DELIVERED
  paymentMethod: 'Thanh toán qua VNPAY',
  paymentStatus: 'Đã thanh toán',
  shippingAddress: {
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  },
  timeline: [
    { status: 'Đặt hàng thành công', date: '28-05-2026 14:30', completed: true },
    { status: 'Đang xử lý', date: '28-05-2026 15:00', completed: true },
    { status: 'Đang giao hàng', date: '29-05-2026 08:30', completed: true },
    { status: 'Giao hàng thành công', date: '30-05-2026 10:15', completed: true }
  ],
  items: [
    {
      name: 'Sofa Da Cao Cấp - Milano',
      quantity: 1,
      price: 10500000,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Bàn Trà Kính Cường Lực',
      quantity: 1,
      price: 2000000,
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=200&q=80'
    }
  ],
  summary: {
    subtotal: 12500000,
    shipping: 150000,
    discount: -150000,
    total: 12500000
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const order = mockOrderDetails; // Ideally: fetchOrderById(id)

  return (
    <div className="lavish-root">
      <DauTrang />
      
      <main className="order-detail-page">
        <div className="container">
          <div className="orders-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/profile">Tài khoản</Link>
            <span>/</span>
            <Link to="/orders">Lịch sử đơn hàng</Link>
            <span>/</span>
            <span>Chi tiết {order.id}</span>
          </div>

          <div className="order-detail-header">
            <div className="order-detail-header-left">
              <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-light)', marginBottom: 12, textDecoration: 'none', fontSize: 14 }}>
                <ArrowLeft size={16} /> Quay lại danh sách
              </Link>
              <h1>Đơn Hàng {order.id}</h1>
              <p>Ngày đặt: {order.date}</p>
            </div>
            <div className="order-detail-header-right">
              <button className="btn-download-invoice">
                <Download size={18} /> Tải Hóa Đơn (PDF)
              </button>
            </div>
          </div>

          <div className="order-detail-grid">
            {/* Cột trái: Trạng thái & Sản phẩm */}
            <div className="order-detail-left">
              
              {/* Theo dõi trạng thái (Timeline) */}
              <div className="detail-card">
                <h3><Truck size={20} className="icon-gold" /> Trạng Thái Đơn Hàng</h3>
                <div className="timeline">
                  {order.timeline.map((step, index) => (
                    <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                      <div className="timeline-icon">
                        {step.completed ? <CheckCircle size={14} /> : <div style={{width: 8, height: 8, borderRadius: '50%', background: '#d1d5db'}}/>}
                      </div>
                      <div className="timeline-content">
                        <h4>{step.status}</h4>
                        {step.completed && <p>{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="detail-card">
                <h3><Package size={20} /> Sản Phẩm Đã Đặt ({order.items.length})</h3>
                <div className="detail-products">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="detail-product-item">
                      <img src={item.image} alt={item.name} className="detail-product-img" />
                      <div className="detail-product-info">
                        <h4>{item.name}</h4>
                        <div className="detail-product-meta">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="detail-product-price">{item.price.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Cột phải: Thông tin giao hàng & Thanh toán */}
            <div className="order-detail-right">
              
              {/* Địa chỉ giao hàng */}
              <div className="detail-card">
                <h3><MapPin size={20} /> Thông Tin Giao Hàng</h3>
                <div className="info-block">
                  <div className="info-label">Người nhận</div>
                  <div className="info-value"><strong>{order.shippingAddress.name}</strong></div>
                </div>
                <div className="info-block">
                  <div className="info-label">Số điện thoại</div>
                  <div className="info-value">{order.shippingAddress.phone}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Địa chỉ nhận hàng</div>
                  <div className="info-value">{order.shippingAddress.address}</div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="detail-card">
                <h3><CreditCard size={20} /> Phương Thức Thanh Toán</h3>
                <div className="info-block">
                  <div className="info-value">{order.paymentMethod}</div>
                  <div className="info-value" style={{color: '#10b981', marginTop: 4, fontSize: 13, fontWeight: 500}}>{order.paymentStatus}</div>
                </div>
              </div>

              {/* Tóm tắt đơn hàng (Tổng tiền) */}
              <div className="detail-card">
                <h3><Receipt size={20} /> Tóm Tắt Đơn Hàng</h3>
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{order.summary.subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>{order.summary.shipping.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row">
                  <span>Giảm giá</span>
                  <span style={{ color: '#10b981' }}>{order.summary.discount.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng tiền</span>
                  <span className="value">{order.summary.total.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default OrderDetailPage;
