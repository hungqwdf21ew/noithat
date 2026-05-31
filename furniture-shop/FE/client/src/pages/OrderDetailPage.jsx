import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, CreditCard, MapPin, Receipt, Download, ArrowLeft } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { orderApi } from '../apis/order.api';
import { getImageUrl } from '../helpers/image.helper';
import './OrderDetailPage.css';

const PAYMENT_LABEL = {
  THANH_TOAN_KHI_NHAN_HANG: 'Thanh toán khi nhận hàng (COD)',
  CHUYEN_KHOAN: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'Cổng VNPAY',
};

const getTimeline = (status, dateStr) => {
  const date = new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  if (status === 'DA_HUY') {
    return [
      { status: 'Đặt hàng thành công', date, completed: true },
      { status: 'Đã hủy đơn hàng', date, completed: true }
    ];
  }

  return [
    { status: 'Đặt hàng thành công', date, completed: true },
    { status: 'Đang xử lý', date: '', completed: ['DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH'].includes(status) },
    { status: 'Đang giao hàng', date: '', completed: ['DANG_GIAO', 'HOAN_THANH'].includes(status) },
    { status: 'Giao hàng thành công', date: '', completed: status === 'HOAN_THANH' }
  ];
};

const mapOrderData = (raw) => {
  return {
    id: raw.MaDonHangCode,
    date: new Date(raw.NgayTao).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    status: raw.TrangThaiDonHang,
    paymentMethod: PAYMENT_LABEL[raw.PhuongThucThanhToan] || raw.PhuongThucThanhToan,
    paymentStatus: raw.TrangThaiThanhToan === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán',
    shippingAddress: {
      name: raw.TenKhachHang,
      phone: raw.SoDienThoai,
      address: raw.DiaChiGiaoHang
    },
    timeline: getTimeline(raw.TrangThaiDonHang, raw.NgayTao),
    items: (raw.chiTiet || []).map(item => ({
      name: item.TenSanPham,
      quantity: item.SoLuong,
      price: Number(item.DonGia),
      image: getImageUrl(item.HinhAnhChinh)
    })),
    summary: {
      subtotal: Number(raw.TamTinh),
      shipping: Number(raw.PhiVanChuyen),
      discount: -Number(raw.TienGiam || 0),
      total: Number(raw.TongTien)
    }
  };
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
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
        console.error('[fetchOrder]', err);
        setError(err.message || 'Không thể tải chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="order-detail-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-light)', fontSize: 16 }}>Đang tải thông tin đơn hàng...</div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="order-detail-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--text-light)', marginBottom: 12 }}>Có lỗi xảy ra</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{error || 'Không tìm thấy đơn hàng.'}</p>
            <Link to="/orders" className="co-btn-outline" style={{ display: 'inline-flex', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none' }}>
              Quay lại danh sách đơn hàng
            </Link>
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
