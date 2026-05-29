import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) {
      e.fullName = 'Vui lòng nhập họ tên';
    } else if (form.fullName.trim().length < 2) {
      e.fullName = 'Họ tên tối thiểu 2 ký tự';
    }
    if (!form.email) {
      e.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Email không hợp lệ';
    }
    if (!form.password) {
      e.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 6) {
      e.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (res.success) {
        navigate('/', { replace: true });
      } else {
        setApiError(res.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setApiError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
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
          <div className="auth-left-quote">
            <div className="auth-quote-mark">"</div>
            <p>Tham gia cùng chúng tôi để khám phá bộ sưu tập nội thất cao cấp.</p>
            <div className="auth-quote-author">— Lavish Heritage</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-mobile-brand">
            <img src="/images/anhlogo.png" alt="logo" />
            <span>LAVISH HERITAGE</span>
          </Link>

          <div className="auth-header">
            <div className="auth-ornament">✦ ✦ ✦</div>
            <h1 className="auth-title">Đăng ký tài khoản</h1>
            <p className="auth-subtitle">Chỉ cần vài thông tin cơ bản để bắt đầu</p>
          </div>

          {apiError && (
            <div className="auth-alert error">
              <span>⚠</span> {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd((v) => !v)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="auth-error-msg">{errors.password}</span>}
            </div>

            <div className={`auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label className="auth-label">Xác nhận mật khẩu</label>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <span className="auth-error-msg">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className="auth-spin" /> Đang đăng ký...
                </>
              ) : (
                <>
                  ĐĂNG KÝ <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-switch-link">
              Đăng nhập ngay
            </Link>
          </p>

          <Link to="/" className="auth-back-home">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
