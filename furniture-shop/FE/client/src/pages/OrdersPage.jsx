import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ChevronDown, ChevronUp, Truck, CheckCircle,
  Clock, XCircle, ShoppingBag,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../apis/order.api';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import './OrdersPage.css';

const STATUS_CONFIG = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: 'pending',   icon: Clock       },
  DA_XAC_NHAN:  { label: 'Đã xác nhận',  color: 'confirmed', icon: CheckCircle },
  DANG_GIAO:    { label: 'Đang giao',     color: 'shipping',  icon: Truck       },
  HOAN_THANH:   { label: 'Hoàn thành',   color: 'done',      icon: CheckCircle },
  DA_HUY:       { label: 'Đã huỷ',       color: 'cancelled', icon: XCircle     },
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
        const cfg  = STATUS_CONFIG[step];
        const Icon = cfg.icon;
        const done   = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step} className={`op-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="op-step-dot"><Icon size={14} /></div>
            <span>{cfg.label}</span>
            {idx < STEPS.length - 1 && (
              <div className={`op-step-line ${done ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Card đơn hàng ─────────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
  const [expanded,   setExpanded]   = useState(false);
  const [detail,     setDetail]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const cfg  = STATUS_CONFIG[order.TrangThaiDonHang] || STATUS_CONFIG.CHO_XAC_NHAN;
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
      if (res.success && detail) {
        setDetail(prev => ({ ...prev, TrangThaiDonHang: 'DA_HUY' }));
      }
    } finally { setCancelling(false); }
  };

  const ngayTao = new Date(order.NgayTao).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <article className="op-card">
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

      <OrderProgress status={order.TrangThaiDonHang} />

      <div className="op-quick-info">
        <span>📍 {order.DiaChiGiaoHang}</span>
        <span>💳 {PAYMENT_LABEL[order.PhuongThucThanhToan] || order.PhuongThucThanhToan}</span>
      </div>

      <div className="op-card-actions">
        <button className="op-btn-toggle" onClick={toggleDetail}>
          {expanded
            ? <><ChevronUp size={14} /> Ẩn chi tiết</>
            : <><ChevronDown size={14} /> Xem chi tiết</>}
        </button>
        {order.TrangThaiDonHang === 'CHO_XAC_NHAN' && (
          <button className="op-btn-cancel" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
          </button>
        )}
      </div>

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
                      <img src={getImageUrl(item.HinhAnhChinh)} alt={item.TenSanPham} />
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
                  <div className="op-discount">
                    <span>Giảm giá</span>
                    <span>- {formatCurrency(detail.TienGiam)}</span>
                  </div>
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
  const { user }  = useAuth();
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
    { value: 'ALL',           label: 'Tất cả' },
    { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
    { value: 'DA_XAC_NHAN',  label: 'Đã xác nhận' },
    { value: 'DANG_GIAO',    label: 'Đang giao' },
    { value: 'HOAN_THANH',   label: 'Hoàn thành' },
    { value: 'DA_HUY',       label: 'Đã huỷ' },
  ];

  const filtered = filter === 'ALL'
    ? orders
    : orders.filter(o => o.TrangThaiDonHang === filter);

  return (
    <div className="lavish-root">
      <DauTrang />
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
      <ChanTrang />
    </div>
  );
};

export default OrdersPage;
