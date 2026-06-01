import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package, ChevronDown, ChevronUp, Truck, CheckCircle,
  Clock, XCircle, ShoppingBag, ExternalLink, RefreshCw,
  Star, Send, CheckCircle2,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../apis/order.api';
import { formatCurrency } from '../utils/currency.util';
import { getImageUrl } from '../helpers/image.helper';
import { getToken } from '../helpers/storage.helper';
import { ORDER_STATUS_CONFIG, ORDER_PAYMENT_LABEL, ORDER_FILTER_TABS } from '../constants/order.constant';
import './OrdersPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Trạng thái đơn hàng cho phép đánh giá
const CAN_REVIEW_STATUSES = ['DANG_GIAO', 'HOAN_THANH'];

/* ── ReviewModal ── */
const ReviewModal = ({ item, onClose, onSuccess }) => {
  const [soSao,      setSoSao]      = useState(5);
  const [noiDung,    setNoiDung]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg,        setMsg]        = useState({ type: '', text: '' });
  const [existing,   setExisting]   = useState(null);
  const [isEdit,     setIsEdit]     = useState(false);
  const [checking,   setChecking]   = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res  = await fetch(`${API_BASE}/reviews/check/${item.MaSanPham}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (data.success && data.data.existingReview) {
          setExisting(data.data.existingReview);
          setSoSao(data.data.existingReview.SoSao);
          setNoiDung(data.data.existingReview.NoiDung || '');
        }
      } catch (_) {}
      finally { setChecking(false); }
    };
    check();
  }, [item.MaSanPham]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const isUpdate = !!existing;
      const url    = isUpdate ? `${API_BASE}/reviews/${existing.MaDanhGia}` : `${API_BASE}/reviews`;
      const method = isUpdate ? 'PUT' : 'POST';
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ productId: item.MaSanPham, soSao, noiDung }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: data.message });
        onSuccess?.();
        setTimeout(onClose, 1800);
      } else {
        setMsg({ type: 'error', text: data.message });
      }
    } catch (_) {
      setMsg({ type: 'error', text: 'Lỗi kết nối. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  const STAR_LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

  return (
    <div className="rv-modal-overlay" onClick={onClose}>
      <div className="rv-modal" onClick={e => e.stopPropagation()}>
        <button className="rv-modal-close" onClick={onClose}>×</button>
        <h3 className="rv-modal-title">
          {existing && !isEdit ? 'Đánh giá của bạn' : existing ? 'Sửa đánh giá' : 'Đánh giá sản phẩm'}
        </h3>

        <div className="rv-product-info">
          <img src={getImageUrl(item.HinhAnhChinh)} alt={item.TenSanPham} className="rv-product-img" />
          <span className="rv-product-name">{item.TenSanPham}</span>
        </div>

        {checking ? (
          <p className="rv-checking">Đang kiểm tra...</p>
        ) : existing && !isEdit ? (
          <div className="rv-existing">
            <div className="rv-existing-stars">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={22}
                  fill={s <= existing.SoSao ? '#c9973a' : 'none'}
                  stroke={s <= existing.SoSao ? '#c9973a' : '#ccc'}
                />
              ))}
            </div>
            {existing.NoiDung && <p className="rv-existing-text">{existing.NoiDung}</p>}
            <span className={`rv-status-badge ${existing.TrangThai}`}>
              {existing.TrangThai === 'CHO_DUYET' ? 'Chờ duyệt'
                : existing.TrangThai === 'DA_DUYET' ? 'Đã duyệt' : 'Đã ẩn'}
            </span>
            <button className="rv-edit-btn" onClick={() => setIsEdit(true)}>Sửa đánh giá</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="rv-stars-row">
              <span>Đánh giá:</span>
              <div className="rv-stars-input">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setSoSao(s)}>
                    <Star size={28}
                      fill={s <= soSao ? '#c9973a' : 'none'}
                      stroke={s <= soSao ? '#c9973a' : '#ccc'}
                    />
                  </button>
                ))}
                <span className="rv-star-label">{STAR_LABELS[soSao]}</span>
              </div>
            </div>
            <textarea
              className="rv-textarea"
              placeholder="Chia sẻ trải nghiệm của bạn..."
              value={noiDung}
              onChange={e => setNoiDung(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <div className="rv-char-count">{noiDung.length}/1000</div>
            {msg.text && (
              <div className={`rv-msg ${msg.type}`}>
                {msg.type === 'success' ? <CheckCircle2 size={15} /> : null}
                {msg.text}
              </div>
            )}
            <div className="rv-form-actions">
              {isEdit && (
                <button type="button" className="rv-cancel-btn" onClick={() => setIsEdit(false)}>Hủy</button>
              )}
              <button type="submit" className="rv-submit-btn" disabled={submitting}>
                <Send size={14} />
                {submitting ? 'Đang gửi...' : existing ? 'Cập nhật' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const STATUS_ICONS = {
  CHO_XAC_NHAN: Clock,
  DA_XAC_NHAN: CheckCircle,
  DANG_GIAO: Truck,
  HOAN_THANH: CheckCircle,
  DA_HUY: XCircle,
};

const STEPS = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH'];

const OrderProgress = ({ status }) => {
  if (status === 'DA_HUY') {
    return (
      <div className="op-cancelled-bar">
        <XCircle size={16} /> Đơn hàng đã bị huỷ
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="op-progress">
      {STEPS.map((step, idx) => {
        const cfg = ORDER_STATUS_CONFIG[step];
        const Icon = STATUS_ICONS[step] || Clock;  // fallback Clock nếu không tìm thấy
        const done = idx < currentIdx;
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

const OrderCard = ({ order, onCancel, onStatusChange }) => {
  const [expanded,    setExpanded]    = useState(false);
  const [detail,      setDetail]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [cancelling,  setCancelling]  = useState(false);
  const [localStatus, setLocalStatus] = useState(order.TrangThaiDonHang);
  const [reviewItem,  setReviewItem]  = useState(null); // item đang mở modal đánh giá

  useEffect(() => {
    setLocalStatus(order.TrangThaiDonHang);
  }, [order.TrangThaiDonHang]);

  const status = localStatus;
  const cfg = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.CHO_XAC_NHAN;
  const Icon = STATUS_ICONS[status] || Clock;

  const toggleDetail = async () => {
    if (!expanded && !detail) {
      setLoading(true);
      try {
        const res = await orderApi.getOrderDetail(order.MaDonHangCode || order.MaDonHang);
        if (res.success) setDetail(res.data);
      } catch (_) {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    setExpanded((prev) => !prev);
  };

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return;
    setCancelling(true);
    try {
      const res = await onCancel(order.MaDonHang);
      if (res.success) {
        setLocalStatus('DA_HUY');
        onStatusChange?.(order.MaDonHang, 'DA_HUY');
        if (detail) setDetail((prev) => ({ ...prev, TrangThaiDonHang: 'DA_HUY' }));
      }
    } finally {
      setCancelling(false);
    }
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
            <Link to={`/orders/${order.MaDonHangCode}`} className="op-code-link">
              <strong>{order.MaDonHangCode}</strong>
            </Link>
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

      <OrderProgress status={status} />

      <div className="op-quick-info">
        <span>📍 {order.DiaChiGiaoHang}</span>
        <span>💳 {ORDER_PAYMENT_LABEL[order.PhuongThucThanhToan] || order.PhuongThucThanhToan}</span>
      </div>

      <div className="op-card-actions">
        <Link to={`/orders/${order.MaDonHangCode}`} className="op-btn-detail">
          <ExternalLink size={14} /> Trang chi tiết
        </Link>
        <button type="button" className="op-btn-toggle" onClick={toggleDetail}>
          {expanded
            ? <><ChevronUp size={14} /> Ẩn chi tiết</>
            : <><ChevronDown size={14} /> Xem nhanh</>}
        </button>
        {status === 'CHO_XAC_NHAN' && (
          <button type="button" className="op-btn-cancel" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Đang huỷ...' : 'Huỷ đơn'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="op-detail">
          {loading ? (
            <div className="op-loading">Đang tải từ API...</div>
          ) : detail ? (
            <>
              <h4>Sản phẩm đã đặt</h4>
              <div className="op-detail-items">
                {detail.chiTiet?.map((item) => (
                  <div key={item.MaChiTietDonHang} className="op-detail-item">
                    <div className="op-detail-img">
                      <img src={getImageUrl(item.HinhAnhChinh)} alt={item.TenSanPham} />
                    </div>
                    <div className="op-detail-info">
                      <p className="op-detail-name">{item.TenSanPham}</p>
                      <p className="op-detail-qty">Số lượng: {item.SoLuong}</p>
                    </div>
                    <div className="op-detail-right">
                      <div className="op-detail-price">
                        {formatCurrency(item.DonGia * item.SoLuong)}
                      </div>
                      {CAN_REVIEW_STATUSES.includes(status) && (
                        <button
                          className="op-btn-review"
                          onClick={() => setReviewItem(item)}
                          title="Đánh giá sản phẩm"
                        >
                          <Star size={13} /> Đánh giá
                        </button>
                      )}
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
            <p className="op-loading">Không thể tải chi tiết. Thử mở trang chi tiết.</p>
          )}
        </div>
      )}

      {reviewItem && (
        <ReviewModal
          item={reviewItem}
          onClose={() => setReviewItem(null)}
          onSuccess={() => {}}
        />
      )}
    </article>
  );
};

const OrdersPage = () => {
  const { user, initialized } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.getMyOrders();
      if (res.success) {
        setOrders(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.message || 'Không thể tải đơn hàng.');
      }
    } catch (err) {
      const msg = err?.message || 'Không thể kết nối máy chủ.';
      setError(msg);
      if (err?.success === false && !err.message) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized || !user) return;
    loadOrders();
  }, [initialized, user, location.key, loadOrders]);

  const handleCancel = async (maDonHang) => {
    try {
      const res = await orderApi.cancelOrder(maDonHang);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.MaDonHang === maDonHang ? { ...o, TrangThaiDonHang: 'DA_HUY' } : o))
        );
      } else {
        alert(res.message || 'Không thể huỷ đơn hàng.');
      }
      return res;
    } catch (err) {
      alert(err.message || 'Không thể huỷ đơn hàng.');
      return { success: false };
    }
  };

  const handleStatusChange = (maDonHang, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.MaDonHang === maDonHang ? { ...o, TrangThaiDonHang: status } : o))
    );
  };

  const filtered = filter === 'ALL'
    ? orders
    : orders.filter((o) => o.TrangThaiDonHang === filter);

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
            <div>
              <h1>Đơn Hàng Của Tôi</h1>
              <p>Xin chào, <strong>{user?.fullName}</strong> — {orders.length} đơn hàng</p>
            </div>
            <button type="button" className="op-btn-refresh" onClick={loadOrders} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'op-spin' : ''} />
              Làm mới
            </button>
          </div>

          <div className="op-filters">
            {ORDER_FILTER_TABS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`op-filter-btn ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                {f.value !== 'ALL' && (
                  <span className="op-filter-count">
                    {orders.filter((o) => o.TrangThaiDonHang === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="op-error-banner">
              {error}
              <button type="button" onClick={loadOrders}>Thử lại</button>
            </div>
          )}

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
              {filtered.map((order) => (
                <OrderCard
                  key={order.MaDonHang}
                  order={order}
                  onCancel={handleCancel}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          <p className="op-track-hint">
            Đặt hàng không đăng nhập? <Link to="/track-order">Tra cứu bằng mã đơn</Link>
          </p>

        </div>
      </main>
      <ChanTrang />
    </div>
  );
};

export default OrdersPage;
