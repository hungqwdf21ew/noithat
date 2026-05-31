import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Search, ChevronRight, Eye } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import ReviewModal from '../components/ReviewModal';
import './OrdersPage.css';

// Mock data (keep existing mockOrders here)
const mockOrders = [
  {
    id: '#ORD-2026-001',
    date: '28-05-2026',
    total: 12500000,
    status: 'DELIVERED', // PROCESSING, SHIPPED, DELIVERED, CANCELLED
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
    ]
  },
  {
    id: '#ORD-2026-002',
    date: '25-05-2026',
    total: 3400000,
    status: 'PROCESSING',
    items: [
      {
        name: 'Ghế Thư Giãn Đọc Sách',
        quantity: 1,
        price: 3400000,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: '#ORD-2026-003',
    date: '20-05-2026',
    total: 8900000,
    status: 'CANCELLED',
    items: [
      {
        name: 'Giường Ngủ Hiện Đại Bắc Âu',
        quantity: 1,
        price: 8900000,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=80'
      }
    ]
  },
  {
    id: '#ORD-2026-004',
    date: '10-05-2026',
    total: 1500000,
    status: 'SHIPPED',
    items: [
      {
        name: 'Đèn Bàn Trang Trí Minimalist',
        quantity: 2,
        price: 750000,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80'
      }
    ]
  }
];

const STATUS_CONFIG = {
  PROCESSING: { label: 'Đang xử lý', icon: Clock, color: 'var(--status-processing)' },
  SHIPPED: { label: 'Đang giao hàng', icon: Package, color: 'var(--status-shipped)' },
  DELIVERED: { label: 'Đã giao thành công', icon: CheckCircle, color: 'var(--status-delivered)' },
  CANCELLED: { label: 'Đã hủy', icon: XCircle, color: 'var(--status-cancelled)' },
};

const OrdersPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setReviewModalOpen(true);
  };

  const filteredOrders = mockOrders.filter(
    order => filter === 'ALL' || order.status === filter
  );

  return (
    <div className="lavish-root">
      <DauTrang />
      
      <main className="orders-page">
        <div className="container">
          <div className="orders-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/profile">Tài khoản</Link>
            <span>/</span>
            <span>Lịch sử đơn hàng</span>
          </div>

          <div className="orders-header">
            <div>
              <h1>Đơn Hàng Của Bạn</h1>
              <p>Theo dõi và quản lý lịch sử mua hàng</p>
            </div>
            
            {/* Thanh lọc đơn hàng (Tabs) */}
            <div className="orders-filter">
              <button 
                className={filter === 'ALL' ? 'active' : ''} 
                onClick={() => setFilter('ALL')}
              >
                Tất cả
              </button>
              <button 
                className={filter === 'PROCESSING' ? 'active' : ''} 
                onClick={() => setFilter('PROCESSING')}
              >
                Đang xử lý
              </button>
              <button 
                className={filter === 'SHIPPED' ? 'active' : ''} 
                onClick={() => setFilter('SHIPPED')}
              >
                Đang giao
              </button>
              <button 
                className={filter === 'DELIVERED' ? 'active' : ''} 
                onClick={() => setFilter('DELIVERED')}
              >
                Đã giao
              </button>
              <button 
                className={filter === 'CANCELLED' ? 'active' : ''} 
                onClick={() => setFilter('CANCELLED')}
              >
                Đã hủy
              </button>
            </div>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="orders-empty">
                <Package size={64} className="empty-icon" />
                <h3>Không tìm thấy đơn hàng nào!</h3>
                <p>Chưa có đơn hàng nào khớp với trạng thái bạn chọn.</p>
                <Link to="/collections" className="btn-shopping">Tiếp tục mua sắm</Link>
              </div>
            ) : (
              filteredOrders.map(order => {
                const StatusIcon = STATUS_CONFIG[order.status].icon;
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-info-primary">
                        <span className="order-id">{order.id}</span>
                        <span className="order-date">{order.date}</span>
                      </div>
                      <div 
                        className="order-status-badge" 
                        style={{ '--status-color': STATUS_CONFIG[order.status].color }}
                      >
                        <StatusIcon size={16} />
                        <span>{STATUS_CONFIG[order.status].label}</span>
                      </div>
                    </div>

                    <div className="order-card-body">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-image-wrapper">
                            <img src={item.image} alt={item.name} className="item-image" />
                          </div>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p className="item-qty">Số lượng: x{item.quantity}</p>
                          </div>
                          <div className="item-price">
                            {item.price.toLocaleString('vi-VN')} ₫
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-total">
                        <span>Tổng tiền:</span>
                        <span className="total-amount">{order.total.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      <div className="order-actions">
                        {order.status === 'DELIVERED' && (
                          <button 
                            className="btn-outline"
                            onClick={() => handleOpenReview(order.items[0])}
                          >
                            Đánh giá sản phẩm
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button className="btn-outline-danger">Hủy đơn hàng</button>
                        )}
                        <Link 
                          to={`/orders/${order.id.replace('#', '')}`}
                          className="btn-primary" 
                          style={{ textDecoration: 'none' }}
                        >
                          <Eye size={16} /> Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <ReviewModal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
        product={selectedProduct}
        onSubmit={(data) => console.log('Submit review:', data)}
      />

      <ChanTrang />
    </div>
  );
};

export default OrdersPage;
