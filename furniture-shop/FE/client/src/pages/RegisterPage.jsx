import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const STEPS = ['Thông tin cá nhân', 'Tài khoản', 'Hoàn tất'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({
    fullName: '', phone: '',
    email: '', password: '', confirmPassword: '',
    agree: false,
  });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  /* ── Validate per step ── */
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.fullName.trim())              e.fullName = 'Vui lòng nhập họ tên';
      else if (form.fullName.trim().length < 2) e.fullName = 'Họ tên tối thiểu 2 ký tự';
      if (!form.phone.trim())                 e.phone = 'Vui lòng nhập số điện thoại';
      else if (!/^(0|\+84)[0-9]{9}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ';
    }
    if (s === 1) {
      if (!form.email)                            e.email = 'Vui lòng nhập email';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
      if (!form.password)                         e.password = 'Vui lòng nhập mật khẩu';
      else if (form.password.length < 6)          e.password = 'Mật khẩu tối thiểu 6 ký tự';
      if (!form.confirmPassword)                  e.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      else if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu không khớp';
      if (!form.agree)                            e.agree = 'Vui lòng đồng ý điều khoản';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await register({
        fullName: form.fullName,
        phone:    form.phone,
        email:    form.email,
        password: form.password,
      });
      if (res.success) {
        setToken(res.data?.token);
        setUser(res.data?.user);
        setSuccess(true);
        setStep(2);
        setTimeout(() => navigate('/'), 2500);
      } else {
        setApiError(res.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setApiError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  /* ── Password strength ── */
  const pwdStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const pwdLabel  = ['', 'Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][pwdStrength];
  const pwdColor  = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'][pwdStrength];

  return (
    <div className="auth-root">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <Link to="/" className="auth-brand">
            <img src="/images/anhlogo.png" alt="Lavish Heritage" className="auth-logo" />
            <div>
              <div className="auth-brand-name">LAVISH HERITAGE</div>
              <div className="auth-brand-sub">Timeless Luxury · Crafted for Generations</div>
            </div>
          </Link>

          {/* Benefits */}
          <div className="auth-benefits">
            <h3 className="auth-benefits-title">Lợi ích khi đăng ký</h3>
            {[
              { icon: '🎁', title: 'Ưu đãi độc quyền', desc: 'Nhận ngay voucher 500K cho đơn hàng đầu tiên' },
              { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Cho tất cả đơn hàng từ 10 triệu đồng' },
              { icon: '⭐', title: 'Tích điểm thưởng', desc: 'Mỗi đơn hàng tích lũy điểm đổi quà hấp dẫn' },
              { icon: '🛡️', title: 'Bảo hành ưu tiên', desc: 'Hỗ trợ bảo hành nhanh chóng, tận nơi' },
            ].map((b, i) => (
              <div key={i} className="auth-benefit-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="auth-benefit-icon">{b.icon}</div>
                <div>
                  <div className="auth-benefit-title">{b.title}</div>
                  <div className="auth-benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="auth-mobile-brand">
            <img src="/images/anhlogo.png" alt="logo" />
            <span>LAVISH HERITAGE</span>
          </Link>

          {/* Step indicator */}
          <div className="auth-steps">
            {STEPS.map((s, i) => (
              <div key={i} className={`auth-step ${i <= step ? 'done' : ''} ${i === step ? 'current' : ''}`}>
                <div className="auth-step-circle">
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="auth-step-label">{s}</span>
                {i < STEPS.length - 1 && <div className={`auth-step-line ${i < step ? 'done' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Success state */}
          {step === 2 && success ? (
            <div className="auth-success">
              <div className="auth-success-icon">
                <Check size={40} />
              </div>
              <h2>Đăng ký thành công!</h2>
              <p>Chào mừng bạn đến với Lavish Heritage.<br />Đang chuyển hướng về trang chủ...</p>
              <div className="auth-success-loader" />
            </div>
          ) : (
            <>
              <div className="auth-header">
                <div className="auth-ornament">✦ ✦ ✦</div>
                <h1 className="auth-title">
                  {step === 0 ? 'Tạo tài khoản' : 'Thông tin đăng nhập'}
                </h1>
                <p className="auth-subtitle">
                  {step === 0
                    ? 'Điền thông tin cá nhân của bạn'
                    : 'Thiết lập email và mật khẩu'}
                </p>
              </div>

              {apiError && (
                <div className="auth-alert error">
                  <span>⚠</span> {apiError}
                </div>
              )}

              <form className="auth-form" onSubmit={step === 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} noValidate>

                {/* ── STEP 0: Personal info ── */}
                {step === 0 && (
                  <>
                    <div className={`auth-field ${errors.fullName ? 'has-error' : ''}`}>
                      <label className="auth-label">Họ và tên</label>
                      <div className="auth-input-wrap">
                        <User size={17} className="auth-input-icon" />
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          className="auth-input"
                          autoComplete="name"
                        />
                      </div>
                      {errors.fullName && <span className="auth-error-msg">{errors.fullName}</span>}
                    </div>

                    <div className={`auth-field ${errors.phone ? 'has-error' : ''}`}>
                      <label className="auth-label">Số điện thoại</label>
                      <div className="auth-input-wrap">
                        <Phone size={17} className="auth-input-icon" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="0901 234 567"
                          className="auth-input"
                          autoComplete="tel"
                        />
                      </div>
                      {errors.phone && <span className="auth-error-msg">{errors.phone}</span>}
                    </div>

                    <button type="submit" className="auth-submit-btn">
                      Tiếp theo <ArrowRight size={18} />
                    </button>
                  </>
                )}

                {/* ── STEP 1: Account info ── */}
                {step === 1 && (
                  <>
                    <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
                      <label className="auth-label">Email</label>
                      <div className="auth-input-wrap">
                        <Mail size={17} className="auth-input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="auth-input"
                          autoComplete="email"
                        />
                      </div>
                      {errors.email && <span className="auth-error-msg">{errors.email}</span>}
                    </div>

                    <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
                      <label className="auth-label">Mật khẩu</label>
                      <div className="auth-input-wrap">
                        <Lock size={17} className="auth-input-icon" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Tối thiểu 6 ký tự"
                          className="auth-input"
                          autoComplete="new-password"
                        />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)}>
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {/* Password strength */}
                      {form.password && (
                        <div className="auth-pwd-strength">
                          <div className="auth-pwd-bars">
                            {[1,2,3,4,5].map(n => (
                              <div key={n} className="auth-pwd-bar"
                                style={{ background: n <= pwdStrength ? pwdColor : '#e0e0e0' }}
                              />
                            ))}
                          </div>
                          <span style={{ color: pwdColor }}>{pwdLabel}</span>
                        </div>
                      )}
                      {errors.password && <span className="auth-error-msg">{errors.password}</span>}
                    </div>

                    <div className={`auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
                      <label className="auth-label">Xác nhận mật khẩu</label>
                      <div className="auth-input-wrap">
                        <Lock size={17} className="auth-input-icon" />
                        <input
                          type={showCfm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Nhập lại mật khẩu"
                          className="auth-input"
                          autoComplete="new-password"
                        />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowCfm(v => !v)}>
                          {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {/* Match indicator */}
                      {form.confirmPassword && (
                        <div className={`auth-match ${form.password === form.confirmPassword ? 'ok' : 'no'}`}>
                          {form.password === form.confirmPassword
                            ? <><Check size={13} /> Mật khẩu khớp</>
                            : '✕ Mật khẩu chưa khớp'}
                        </div>
                      )}
                      {errors.confirmPassword && <span className="auth-error-msg">{errors.confirmPassword}</span>}
                    </div>

                    {/* Terms */}
                    <div className={`auth-checkbox-field ${errors.agree ? 'has-error' : ''}`}>
                      <label className="auth-checkbox-label">
                        <input
                          type="checkbox"
                          name="agree"
                          checked={form.agree}
                          onChange={handleChange}
                          className="auth-checkbox"
                        />
                        <span className="auth-checkbox-custom" />
                        <span>
                          Tôi đồng ý với{' '}
                          <a href="#" className="auth-link">Điều khoản dịch vụ</a>
                          {' '}và{' '}
                          <a href="#" className="auth-link">Chính sách bảo mật</a>
                        </span>
                      </label>
                      {errors.agree && <span className="auth-error-msg">{errors.agree}</span>}
                    </div>

                    <div className="auth-btn-row">
                      <button type="button" className="auth-back-btn" onClick={() => setStep(0)}>
                        ← Quay lại
                      </button>
                      <button type="submit" className="auth-submit-btn flex-1" disabled={loading}>
                        {loading
                          ? <><Loader size={18} className="auth-spin" /> Đang xử lý...</>
                          : <>ĐĂNG KÝ <ArrowRight size={18} /></>
                        }
                      </button>
                    </div>
                  </>
                )}
              </form>

              <p className="auth-switch">
                Đã có tài khoản?{' '}
                <Link to="/login" className="auth-switch-link">Đăng nhập ngay</Link>
              </p>

              <Link to="/" className="auth-back-home">← Quay về trang chủ</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
