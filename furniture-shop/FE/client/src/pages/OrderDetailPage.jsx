import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, CreditCard, MapPin, Receipt,
  Download, ArrowLeft, XCircle, Clock,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../apis/order.api';
import { getImageUrl } from '../helpers/image.helper';
import { ORDER_STATUS_CONFIG, ORDER_PAYMENT_LABEL } from '../constants/order.constant';
import './OrderDetailPage.css';

const STATUS_ICONS = {
  CHO_XAC_NHAN: Clock,
  DA_XAC_NHAN: CheckCircle,
  DANG_GIAO: Truck,
  HOAN_THANH: CheckCircle,
  DA_HUY: XCircle,
};

const getTimeline = (status, dateStr) => {
  const date = new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  if (status === 'DA_HUY') {
    return [
      { status: 'Đặt hàng thành công', date, completed: true },
      { status: 'Đã hủy đơn hàng', date, completed: true },
    ];
  }

  return [
    { status: 'Đặt hàng thành công', date, completed: true },
    { status: 'Đang xử lý', date: '', completed: ['DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH'].includes(status) },
    { status: 'Đang giao hàng', date: '', completed: ['DANG_GIAO', 'HOAN_THANH'].includes(status) },
    { status: 'Giao hàng thành công', date: '', completed: status === 'HOAN_THANH' },
  ];
};

const mapOrderData = (raw) => ({
  maDonHang: raw.MaDonHang,
  id: raw.MaDonHangCode,
  date: new Date(raw.NgayTao).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }),
  status: raw.TrangThaiDonHang,
  paymentMethod: ORDER_PAYMENT_LABEL[raw.PhuongThucThanhToan] || raw.PhuongThucThanhToan,
  paymentStatus: raw.TrangThaiThanhToan === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán',
  shippingAddress: {
    name: raw.TenKhachHang,
    phone: raw.SoDienThoai,
    address: raw.DiaChiGiaoHang,
  },
  ghiChu: raw.GhiChu,
  timeline: getTimeline(raw.TrangThaiDonHang, raw.NgayTao),
  items: (raw.chiTiet || []).map((item) => ({
    maSanPham: item.MaSanPham,
    name: item.TenSanPham,
    quantity: item.SoLuong,
    price: Number(item.DonGia),
    image: getImageUrl(item.HinhAnhChinh),
    duongDan: item.DuongDan,
  })),
  summary: {
    subtotal: Number(raw.TamTinh),
    shipping: Number(raw.PhiVanChuyen),
    discount: -Number(raw.TienGiam || 0),
    total: Number(raw.TongTien),
  },
});

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderApi.getOrderDetail(id);
      if (res.success) {
        setOrder(mapOrderData(res.data));
      } else {
        setError(res.message || 'Không thể tải chi tiết đơn hàng.');
      }
    } catch (err) {
      setError(err.message || 'Không thể tải chi tiết đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancel = async () => {
    if (!order || !window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return;
    setCancelling(true);
    try {
      const res = await orderApi.cancelOrder(order.maDonHang);
      if (res.success) {
        await fetchOrder();
      } else {
        alert(res.message || 'Không thể huỷ đơn hàng.');
      }
    } catch (err) {
      alert(err.message || 'Không thể huỷ đơn hàng.');
    } finally {
      setCancelling(false);
    }
  };

  const statusCfg = order ? ORDER_STATUS_CONFIG[order.status] : null;
  const StatusIcon = order ? (STATUS_ICONS[order.status] || Clock) : Clock;

  if (loading) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="order-detail-page od-loading-wrap">
          <div className="container">
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="order-detail-page od-loading-wrap">
          <div className="container od-error-box">
            <h2>Có lỗi xảy ra</h2>
            <p>{error || 'Không tìm thấy đơn hàng.'}</p>
            <div className="od-error-actions">
              {isLoggedIn && (
                <Link to="/orders" className="od-btn-outline">Danh sách đơn hàng</Link>
              )}
              <Link to="/track-order" className="od-btn-outline">Tra cứu đơn khác</Link>
            </div>
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="order-detail-page">
        <div className="container">
          <div className="orders-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            {isLoggedIn ? (
              <>
                <Link to="/profile">Tài khoản</Link>
                <span>/</span>
                <Link to="/orders">Lịch sử đơn hàng</Link>
              </>
            ) : (
              <Link to="/track-order">Tra cứu đơn</Link>
            )}
            <span>/</span>
            <span>Chi tiết {order.id}</span>
          </div>

          <div className="order-detail-header">
            <div className="order-detail-header-left">
              <button
                type="button"
                className="od-back-link"
                onClick={() => (isLoggedIn ? navigate('/orders') : navigate('/track-order'))}
              >
                <ArrowLeft size={16} /> Quay lại
              </button>
              <h1>Đơn Hàng {order.id}</h1>
              <p>Ngày đặt: {order.date}</p>
              <span className={`od-status-pill od-status-${statusCfg?.color || 'pending'}`}>
                <StatusIcon size={14} />
                {statusCfg?.label || order.status}
              </span>
            </div>
            <div className="order-detail-header-right">
              {isLoggedIn && order.status === 'CHO_XAC_NHAN' && (
                <button
                  type="button"
                  className="od-btn-cancel"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
                </button>
              )}
            </div>
          </div>

          <div className="order-detail-grid">
            <div className="order-detail-left">
              <div className="detail-card">
                <h3><Truck size={20} className="icon-gold" /> Trạng Thái Đơn Hàng</h3>
                <div className="timeline">
                  {order.timeline.map((step, index) => (
                    <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                      <div className="timeline-icon">
                        {step.completed ? <CheckCircle size={14} /> : (
                          <div className="timeline-dot-pending" />
                        )}
                      </div>
                      <div className="timeline-content">
                        <h4>{step.status}</h4>
                        {step.completed && step.date && <p>{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <h3><Package size={20} /> Sản Phẩm Đã Đặt ({order.items.length})</h3>
                <div className="detail-products">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="detail-product-item">
                      <img src={item.image} alt={item.name} className="detail-product-img" />
                      <div className="detail-product-info">
                        <h4>
                          {item.duongDan ? (
                            <Link to={`/product/${item.duongDan}`}>{item.name}</Link>
                          ) : (
                            item.name
                          )}
                        </h4>
                        <div className="detail-product-meta">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="detail-product-price">
                            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-detail-right">
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
                {order.ghiChu && (
                  <div className="info-block">
                    <div className="info-label">Ghi chú</div>
                    <div className="info-value">{order.ghiChu}</div>
                  </div>
                )}
              </div>

              <div className="detail-card">
                <h3><CreditCard size={20} /> Phương Thức Thanh Toán</h3>
                <div className="info-block">
                  <div className="info-value">{order.paymentMethod}</div>
                  <div className="info-value od-payment-status">{order.paymentStatus}</div>
                </div>
              </div>

              <div className="detail-card">
                <h3><Receipt size={20} /> Tóm Tắt Đơn Hàng</h3>
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>{order.summary.subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>
                    {order.summary.shipping === 0
                      ? 'Miễn phí'
                      : `${order.summary.shipping.toLocaleString('vi-VN')} ₫`}
                  </span>
                </div>
                {order.summary.discount < 0 && (
                  <div className="summary-row">
                    <span>Giảm giá</span>
                    <span style={{ color: '#10b981' }}>
                      {order.summary.discount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                )}
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
