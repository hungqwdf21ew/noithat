import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, MapPin, Phone, User, FileText,
  CreditCard, Truck, CheckCircle, Tag, ArrowLeft, Lock, Mail,
} from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../apis/order.api';
import { formatCurrency, calculateCartTotal } from '../utils/currency.util';
import './CheckoutPage.css';

const FREE_SHIP_MIN = 10000000;
const SHIPPING_FEE  = 500000;

const PAYMENT_OPTIONS = [
  { value: 'THANH_TOAN_KHI_NHAN_HANG', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { value: 'CHUYEN_KHOAN',             label: 'Chuyển khoản ngân hàng',          icon: '🏦' },
  { value: 'MOMO',                     label: 'Ví MoMo',                          icon: '💜' },
  { value: 'VNPAY',                    label: 'VNPay',                            icon: '🔵' },
];

const STATUS_STEPS = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_GIAO', 'HOAN_THANH'];

// ── Component thành công ──────────────────────────────────────────────────────
const OrderSuccess = ({ order, isLoggedIn }) => (
  <div className="checkout-success">
    <div className="checkout-success-icon">
      <CheckCircle size={56} />
    </div>
    <h2>Đặt hàng thành công!</h2>
    <p>Cảm ơn bạn đã tin tưởng Lavish Heritage.</p>

    <div className="checkout-success-code">
      <span>Mã đơn hàng</span>
      <strong>{order.maDonHangCode}</strong>
    </div>

    <div className="checkout-success-rows">
      <div><span>Tạm tính</span><span>{formatCurrency(order.tamTinh)}</span></div>
      {order.tienGiam > 0 && (
        <div className="discount-row"><span>Giảm giá</span><span>- {formatCurrency(order.tienGiam)}</span></div>
      )}
      <div><span>Phí vận chuyển</span><span>{order.phiVanChuyen === 0 ? 'Miễn phí' : formatCurrency(order.phiVanChuyen)}</span></div>
      <div className="total-row"><span>Tổng cộng</span><strong>{formatCurrency(order.tongTien)}</strong></div>
    </div>

    <p className="checkout-success-note">
      {isLoggedIn
        ? 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi".'
        : 'Vui lòng lưu lại mã đơn hàng để tra cứu sau.'}
    </p>

    <div className="checkout-success-actions">
      {isLoggedIn && (
        <Link to="/orders" className="co-btn-primary">Xem đơn hàng của tôi</Link>
      )}
      <Link to="/products" className="co-btn-outline">Tiếp tục mua sắm</Link>
    </div>
  </div>
);

// ── Trang chính ───────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { isLoggedIn, user }     = useAuth();
  const navigate                 = useNavigate();

  const subtotal  = calculateCartTotal(cartItems);
  const shipping  = subtotal >= FREE_SHIP_MIN || subtotal === 0 ? 0 : SHIPPING_FEE;

  const [form, setForm] = useState({
    tenKhachHang:       isLoggedIn ? (user?.fullName || '') : '',
    email:              isLoggedIn ? (user?.email    || '') : '',
    soDienThoai:        isLoggedIn ? (user?.phone    || '') : '',
    diaChiGiaoHang:     '',
    ghiChu:             '',
    phuongThucThanhToan:'THANH_TOAN_KHI_NHAN_HANG',
    maCode:             '',
  });

  const [couponMsg,  setCouponMsg]  = useState('');
  const [discount,   setDiscount]   = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [orderDone,  setOrderDone]  = useState(null);
  const [showGuestConfirmModal, setShowGuestConfirmModal] = useState(false);

  const total = Math.max(0, subtotal - discount + shipping);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setForm(prev => ({ ...prev, [name]: fieldValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Kiểm tra mã giảm giá (gọi API tạo đơn sẽ validate, ở đây chỉ preview)
  const handleApplyCoupon = async () => {
    if (!form.maCode.trim()) {
      setCouponMsg('Vui lòng nhập mã giảm giá.');
      setCouponApplied(false);
      setDiscount(0);
      return;
    }

    setCouponMsg('Đang kiểm tra...');
    try {
      const res = await orderApi.validateCoupon({
        maCode: form.maCode.trim(),
        tamTinh: subtotal,
      });
      if (res.success) {
        setCouponMsg('✅ Mã giảm giá hợp lệ. Giảm ngay trên tổng đơn.');
        setCouponApplied(true);
        setDiscount(res.data?.discount || 0);
      } else {
        setCouponMsg(`❌ ${res.message}`);
        setCouponApplied(false);
        setDiscount(0);
      }
    } catch (err) {
      setCouponMsg('❌ Không thể kiểm tra mã giảm giá. Vui lòng thử lại.');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.tenKhachHang.trim())   e.tenKhachHang   = 'Vui lòng nhập họ tên.';
    if (!form.email.trim())          e.email          = 'Vui lòng nhập email để nhận thông báo đơn hàng.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Email không hợp lệ.';
    if (!form.soDienThoai.trim())    e.soDienThoai    = 'Vui lòng nhập số điện thoại.';
    else if (!/^0\d{9}$/.test(form.soDienThoai.trim())) e.soDienThoai = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).';
    if (!form.diaChiGiaoHang.trim()) e.diaChiGiaoHang = 'Vui lòng nhập địa chỉ giao hàng.';
    return e;
  };

  const submitOrder = async () => {
    setShowGuestConfirmModal(false);
    setLoading(true);
    try {
      const items = cartItems.map(item => ({
        maSanPham:  item.id,
        tenSanPham: item.name,
        donGia:     item.price,
        soLuong:    item.quantity,
      }));

      const payload = {
        tenKhachHang:       form.tenKhachHang.trim(),
        email:              form.email.trim(),
        soDienThoai:        form.soDienThoai.trim(),
        diaChiGiaoHang:     form.diaChiGiaoHang.trim(),
        ghiChu:             form.ghiChu.trim() || null,
        phuongThucThanhToan:form.phuongThucThanhToan,
        maCode:             couponApplied ? form.maCode.trim() : null,
        items,
      };

      const res = await orderApi.createOrder(payload);
      if (res.success) {
        clearCart();
        setOrderDone(res.data);
      } else {
        setErrors({ submit: res.message });
      }
    } catch (err) {
      setErrors({ submit: err?.message || 'Đặt hàng thất bại, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (!isLoggedIn) {
      setShowGuestConfirmModal(true);
      return;
    }

    await submitOrder();
  };

  // ── Giỏ trống ──
  if (cartItems.length === 0 && !orderDone) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="checkout-page">
          <div className="container">
            <div className="checkout-empty">
              <ShoppingBag size={48} />
              <h2>Giỏ hàng trống</h2>
              <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link to="/products" className="co-btn-primary">Khám phá sản phẩm</Link>
            </div>
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  // ── Đặt hàng thành công ──
  if (orderDone) {
    return (
      <div className="lavish-root">
        <DauTrang />
        <main className="checkout-page">
          <div className="container">
            <OrderSuccess order={orderDone} isLoggedIn={isLoggedIn} />
          </div>
        </main>
        <ChanTrang />
      </div>
    );
  }

  return (
    <div className="lavish-root">
      <DauTrang />
      <main className="checkout-page">
        <div className="container">

          {/* Breadcrumb */}
          <nav className="co-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span>
            <Link to="/cart">Giỏ hàng</Link><span>/</span>
            <span>Thanh toán</span>
          </nav>

          <h1 className="co-title">Thanh Toán</h1>

          {/* Banner khách vãng lai */}
          {!isLoggedIn && (
            <div className="co-guest-banner">
              <Lock size={16} />
              <span>
                Bạn đang đặt hàng với tư cách khách. Vui lòng điền đầy đủ thông tin và xác nhận để đơn hàng được xử lý chính xác.
                <Link to="/login">Đăng nhập</Link> để theo dõi đơn hàng dễ dàng hơn.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="co-layout">

              {/* ── Cột trái: form thông tin ── */}
              <div className="co-left">

                {/* Thông tin giao hàng */}
                <section className="co-card">
                  <h2><MapPin size={18} /> Thông tin giao hàng</h2>

                  <div className="co-field">
                    <label htmlFor="tenKhachHang"><User size={14} /> Họ và tên *</label>
                    <input
                      id="tenKhachHang" name="tenKhachHang" type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.tenKhachHang} onChange={handleChange}
                      className={errors.tenKhachHang ? 'error' : ''}
                    />
                    {errors.tenKhachHang && <span className="co-error">{errors.tenKhachHang}</span>}
                  </div>

                  <div className="co-field">
                    <label htmlFor="soDienThoai"><Phone size={14} /> Số điện thoại *</label>
                    <input
                      id="soDienThoai" name="soDienThoai" type="tel"
                      placeholder="0901234567"
                      value={form.soDienThoai} onChange={handleChange}
                      className={errors.soDienThoai ? 'error' : ''}
                    />
                    {errors.soDienThoai && <span className="co-error">{errors.soDienThoai}</span>}
                  </div>

                  <div className="co-field">
                    <label htmlFor="email"><Mail size={14} /> Email nhận thông báo *</label>
                    <input
                      id="email" name="email" type="email"
                      placeholder="nguyen.van.a@mail.com"
                      value={form.email} onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      readOnly={isLoggedIn && !!user?.email}
                    />
                    {errors.email && <span className="co-error">{errors.email}</span>}
                  </div>

                  <div className="co-field">
                    <label htmlFor="diaChiGiaoHang"><MapPin size={14} /> Địa chỉ giao hàng *</label>
                    <textarea
                      id="diaChiGiaoHang" name="diaChiGiaoHang" rows={3}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={form.diaChiGiaoHang} onChange={handleChange}
                      className={errors.diaChiGiaoHang ? 'error' : ''}
                    />
                    {errors.diaChiGiaoHang && <span className="co-error">{errors.diaChiGiaoHang}</span>}
                  </div>

                  <div className="co-field">
                    <label htmlFor="ghiChu"><FileText size={14} /> Ghi chú (tuỳ chọn)</label>
                    <textarea
                      id="ghiChu" name="ghiChu" rows={2}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      value={form.ghiChu} onChange={handleChange}
                    />
                  </div>
                </section>

                {/* Phương thức thanh toán */}
                <section className="co-card">
                  <h2><CreditCard size={18} /> Phương thức thanh toán</h2>
                  <div className="co-payment-list">
                    {PAYMENT_OPTIONS.map(opt => (
                      <label
                        key={opt.value}
                        className={`co-payment-item ${form.phuongThucThanhToan === opt.value ? 'selected' : ''}`}
                      >
                        <input
                          type="radio" name="phuongThucThanhToan"
                          value={opt.value} checked={form.phuongThucThanhToan === opt.value}
                          onChange={handleChange}
                        />
                        <span className="co-payment-icon">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </section>

              </div>

              {/* ── Cột phải: tóm tắt đơn hàng ── */}
              <aside className="co-right">
                <div className="co-summary-card">
                  <h2><ShoppingBag size={18} /> Đơn hàng ({cartItems.length} sản phẩm)</h2>

                  <div className="co-items-list">
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="co-item">
                        <div className="co-item-img">
                          <img src={item.image || '/images/anhghesofa.png'} alt={item.name} />
                          <span className="co-item-qty">{item.quantity}</span>
                        </div>
                        <div className="co-item-info">
                          <p className="co-item-name">{item.name}</p>
                          {item.selectedColor && <p className="co-item-variant">Màu: {item.selectedColor}</p>}
                          {item.selectedSize  && <p className="co-item-variant">Size: {item.selectedSize}</p>}
                        </div>
                        <div className="co-item-price">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mã giảm giá */}
                  <div className="co-coupon">
                    <Tag size={15} />
                    <input
                      type="text" name="maCode" placeholder="Nhập mã giảm giá"
                      value={form.maCode} onChange={handleChange}
                    />
                    <button type="button" onClick={handleApplyCoupon}>Áp dụng</button>
                  </div>
                  {couponMsg && (
                    <p className={`co-coupon-msg ${couponApplied ? 'ok' : 'err'}`}>{couponMsg}</p>
                  )}

                  {/* Tổng tiền */}
                  <div className="co-totals">
                    <div><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
                    {discount > 0 && (
                      <div className="co-discount"><span>Giảm giá</span><span>- {formatCurrency(discount)}</span></div>
                    )}
                    <div>
                      <span>Phí vận chuyển</span>
                      <span>{shipping === 0 ? <em className="co-free">Miễn phí</em> : formatCurrency(shipping)}</span>
                    </div>
                    {subtotal > 0 && subtotal < FREE_SHIP_MIN && (
                      <p className="co-ship-note">
                        Mua thêm {formatCurrency(FREE_SHIP_MIN - subtotal)} để miễn phí vận chuyển
                      </p>
                    )}
                    <div className="co-total-row">
                      <span>Tổng cộng</span>
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                  </div>

                  {errors.submit && <p className="co-error co-submit-error">{errors.submit}</p>}

                  <button type="submit" className="co-btn-submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                  </button>

                  <Link to="/cart" className="co-back-link">
                    <ArrowLeft size={14} /> Quay lại giỏ hàng
                  </Link>

                  <div className="co-trust">
                    <div><Truck size={14} /> Giao hàng toàn quốc</div>
                    <div><Lock size={14} /> Thanh toán bảo mật</div>
                  </div>
                </div>
              </aside>

            </div>
          </form>

          {showGuestConfirmModal && (
            <div className="co-modal-backdrop">
              <div className="co-modal-card">
                <div className="co-modal-header">
                  <h3>Xác nhận đặt hàng</h3>
                  <button type="button" onClick={() => setShowGuestConfirmModal(false)}>&times;</button>
                </div>
                <div className="co-modal-body">
                  <p>Bạn đang đặt hàng với tư cách khách vãng lai. Vui lòng kiểm tra kỹ thông tin trước khi gửi đơn:</p>
                  <ul>
                    <li><strong>Họ và tên:</strong> {form.tenKhachHang}</li>
                    <li><strong>Email:</strong> {form.email}</li>
                    <li><strong>Số điện thoại:</strong> {form.soDienThoai}</li>
                    <li><strong>Địa chỉ giao hàng:</strong> {form.diaChiGiaoHang}</li>
                    <li><strong>Tổng đơn:</strong> {formatCurrency(total)}</li>
                  </ul>
                  <p className="co-modal-note">
                    Một email xác nhận đơn hàng sẽ được gửi đến địa chỉ bạn cung cấp. Hãy đảm bảo thông tin là chính xác.
                  </p>
                </div>
                <div className="co-modal-actions">
                  <button type="button" className="co-btn-outline" onClick={() => setShowGuestConfirmModal(false)}>
                    Chỉnh sửa lại
                  </button>
                  <button type="button" className="co-btn-submit" onClick={submitOrder} disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Xác nhận và gửi đơn'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <ChanTrang />
    </div>
  );
};

export default CheckoutPage;
