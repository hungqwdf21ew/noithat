<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ChevronDown, ChevronUp, Truck, CheckCircle,
  Clock, XCircle, AlertCircle, ShoppingBag,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../apis/order.api';
import { formatCurrency } from '../utils/currency.util';
import './OrdersPage.css';

// ── Trạng thái đơn hàng ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: 'pending',   icon: Clock        },
  DA_XAC_NHAN:  { label: 'Đã xác nhận',  color: 'confirmed', icon: CheckCircle  },
  DANG_GIAO:    { label: 'Đang giao',     color: 'shipping',  icon: Truck        },
  HOAN_THANH:   { label: 'Hoàn thành',   color: 'done',      icon: CheckCircle  },
  DA_HUY:       { label: 'Đã huỷ',       color: 'cancelled', icon: XCircle      },
};

const STEPS = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH'];

const PAYMENT_LABEL = {
  THANH_TOAN_KHI_NHAN_HANG: 'Thanh toán khi nhận hàng',
  CHUYEN_KHOAN:              'Chuyển khoản',
  MOMO:                      'Ví MoMo',
  VNPAY:                     'VNPay',
};

// ── Thanh tiến trình ──────────────────────────────────────────────────────────
const OrderProgress = ({ status }) => {
  if (status === 'DA_HUY') return (
    <div className="op-cancelled-bar">
      <XCircle size={16} /> Đơn hàng đã bị huỷ
    </div>
  );

  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="op-progress">
      {STEPS.map((step, idx) => {
        const cfg = STATUS_CONFIG[step];
        const Icon = cfg.icon;
        const done    = idx < currentIdx;
        const active  = idx === currentIdx;
        return (
          <div key={step} className={`op-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="op-step-dot">
              <Icon size={14} />
            </div>
            <span>{cfg.label}</span>
            {idx < STEPS.length - 1 && <div className={`op-step-line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
};

// ── Card đơn hàng ─────────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const [detail,   setDetail]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const cfg = STATUS_CONFIG[order.TrangThaiDonHang] || STATUS_CONFIG.CHO_XAC_NHAN;
  const Icon = cfg.icon;

  const toggleDetail = async () => {
    if (!expanded && !detail) {
      setLoading(true);
      try {
        const res = await orderApi.getOrderDetail(order.MaDonHang);
        if (res.success) setDetail(res.data);
      } catch (_) {}
      finally { setLoading(false); }
    }
    setExpanded(prev => !prev);
  };

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return;
    setCancelling(true);
    try {
      const res = await onCancel(order.MaDonHang);
      if (res.success) {
        // Reload detail nếu đang mở
        if (detail) setDetail(prev => ({ ...prev, TrangThaiDonHang: 'DA_HUY' }));
      }
    } finally { setCancelling(false); }
  };

  const ngayTao = new Date(order.NgayTao).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <article className="op-card">
      {/* Header */}
      <div className="op-card-header">
        <div className="op-card-meta">
          <div className="op-code">
            <Package size={16} />
            <strong>{order.MaDonHangCode}</strong>
          </div>
          <span className="op-date">{ngayTao}</span>
        </div>
        <div className="op-card-right">
          <span className={`op-status-badge ${cfg.color}`}>
            <Icon size={13} /> {cfg.label}
          </span>
          <strong className="op-total">{formatCurrency(order.TongTien)}</strong>
        </div>
      </div>

      {/* Thanh tiến trình */}
      <OrderProgress status={order.TrangThaiDonHang} />

      {/* Thông tin nhanh */}
      <div className="op-quick-info">
        <span>📍 {order.DiaChiGiaoHang}</span>
        <span>💳 {PAYMENT_LABEL[order.PhuongThucThanhToan] || order.PhuongThucThanhToan}</span>
      </div>

      {/* Actions */}
      <div className="op-card-actions">
        <button className="op-btn-toggle" onClick={toggleDetail}>
          {expanded ? <><ChevronUp size={14} /> Ẩn chi tiết</> : <><ChevronDown size={14} /> Xem chi tiết</>}
        </button>
        {order.TrangThaiDonHang === 'CHO_XAC_NHAN' && (
          <button className="op-btn-cancel" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
          </button>
        )}
      </div>

      {/* Chi tiết mở rộng */}
      {expanded && (
        <div className="op-detail">
          {loading ? (
            <div className="op-loading">Đang tải...</div>
          ) : detail ? (
            <>
              <h4>Sản phẩm đã đặt</h4>
              <div className="op-detail-items">
                {detail.chiTiet?.map(item => (
                  <div key={item.MaChiTietDonHang} className="op-detail-item">
                    <div className="op-detail-img">
                      <img src={item.HinhAnhChinh || '/images/anhghesofa.png'} alt={item.TenSanPham} />
                    </div>
                    <div className="op-detail-info">
                      <p className="op-detail-name">{item.TenSanPham}</p>
                      <p className="op-detail-qty">Số lượng: {item.SoLuong}</p>
                    </div>
                    <div className="op-detail-price">
                      {formatCurrency(item.DonGia * item.SoLuong)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="op-detail-totals">
                <div><span>Tạm tính</span><span>{formatCurrency(detail.TamTinh)}</span></div>
                {detail.TienGiam > 0 && (
                  <div className="op-discount"><span>Giảm giá</span><span>- {formatCurrency(detail.TienGiam)}</span></div>
                )}
                <div>
                  <span>Phí vận chuyển</span>
                  <span>{detail.PhiVanChuyen === 0 ? 'Miễn phí' : formatCurrency(detail.PhiVanChuyen)}</span>
                </div>
                <div className="op-detail-total">
                  <span>Tổng cộng</span>
                  <strong>{formatCurrency(detail.TongTien)}</strong>
                </div>
              </div>

              {detail.GhiChu && (
                <p className="op-detail-note">📝 Ghi chú: {detail.GhiChu}</p>
              )}
            </>
          ) : (
            <p className="op-loading">Không thể tải chi tiết đơn hàng.</p>
          )}
        </div>
      )}
    </article>
  );
};

// ── Trang chính ───────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res.success) setOrders(res.data);
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleCancel = async (maDonHang) => {
    const res = await orderApi.cancelOrder(maDonHang);
    if (res.success) {
      setOrders(prev =>
        prev.map(o => o.MaDonHang === maDonHang ? { ...o, TrangThaiDonHang: 'DA_HUY' } : o)
      );
    } else {
      alert(res.message || 'Không thể huỷ đơn hàng.');
    }
    return res;
  };

  const FILTERS = [
    { value: 'ALL',          label: 'Tất cả' },
    { value: 'CHO_XAC_NHAN',label: 'Chờ xác nhận' },
    { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
    { value: 'DANG_GIAO',   label: 'Đang giao' },
    { value: 'HOAN_THANH',  label: 'Hoàn thành' },
    { value: 'DA_HUY',      label: 'Đã huỷ' },
  ];

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.TrangThaiDonHang === filter);
>>>>>>> 2481af277543e3895fe766bf50a34a9086fe97f2

  return (
    <div className="lavish-root">
      <DauTrang />
<<<<<<< HEAD
      
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

=======
      <main className="orders-page">
        <div className="container">

          <nav className="op-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span>
            <Link to="/profile">Tài khoản</Link><span>/</span>
            <span>Đơn hàng của tôi</span>
          </nav>

          <div className="op-page-header">
            <h1>Đơn Hàng Của Tôi</h1>
            <p>Xin chào, <strong>{user?.fullName}</strong> — {orders.length} đơn hàng</p>
          </div>

          {/* Filter tabs */}
          <div className="op-filters">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`op-filter-btn ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                {f.value !== 'ALL' && (
                  <span className="op-filter-count">
                    {orders.filter(o => o.TrangThaiDonHang === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Danh sách đơn hàng */}
          {loading ? (
            <div className="op-loading-state">
              <div className="op-spinner" />
              <p>Đang tải đơn hàng...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="op-empty">
              <ShoppingBag size={48} />
              <h3>Chưa có đơn hàng nào</h3>
              <p>{filter === 'ALL' ? 'Bạn chưa đặt hàng lần nào.' : 'Không có đơn hàng ở trạng thái này.'}</p>
              <Link to="/products" className="op-btn-shop">Mua sắm ngay</Link>
            </div>
          ) : (
            <div className="op-list">
              {filtered.map(order => (
                <OrderCard key={order.MaDonHang} order={order} onCancel={handleCancel} />
              ))}
            </div>
          )}

        </div>
      </main>
>>>>>>> 2481af277543e3895fe766bf50a34a9086fe97f2
      <ChanTrang />
    </div>
  );
};

export default OrdersPage;
