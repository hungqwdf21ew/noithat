import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || '/';
  const { login } = useAuth();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)                             e.email    = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email    = 'Email không hợp lệ';
    if (!form.password)                          e.password = 'Vui lòng nhập mật khẩu';
    else if (form.password.length < 6)           e.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setApiError(res.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setApiError(err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* Left panel — decorative */}
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
            <p>Mỗi sản phẩm là một tác phẩm nghệ thuật, mỗi không gian là một câu chuyện về đẳng cấp và phong cách sống.</p>
            <div className="auth-quote-author">— Lavish Heritage</div>
          </div>
          <div className="auth-left-stats">
            <div className="auth-stat">
              <span className="auth-stat-num">500+</span>
              <span className="auth-stat-label">Sản phẩm</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">10K+</span>
              <span className="auth-stat-label">Khách hàng</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">15+</span>
              <span className="auth-stat-label">Năm kinh nghiệm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {/* Mobile logo */}
          <Link to="/" className="auth-mobile-brand">
            <img src="/images/anhlogo.png" alt="logo" />
            <span>LAVISH HERITAGE</span>
          </Link>

          <div className="auth-header">
            <div className="auth-ornament">✦ ✦ ✦</div>
            <h1 className="auth-title">Chào mừng trở lại</h1>
            <p className="auth-subtitle">Đăng nhập để khám phá bộ sưu tập nội thất đẳng cấp</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="auth-alert error">
              <span>⚠</span> {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={`auth-field ${errors.email ? 'has-error' : ''} ${form.email ? 'has-value' : ''}`}>
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

            {/* Password */}
            <div className={`auth-field ${errors.password ? 'has-error' : ''} ${form.password ? 'has-value' : ''}`}>
              <div className="auth-label-row">
                <label className="auth-label">Mật khẩu</label>
                <Link to="/forgot-password" className="auth-forgot">Quên mật khẩu?</Link>
              </div>
              <div className="auth-input-wrap">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="auth-error-msg">{errors.password}</span>}
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? <><Loader size={18} className="auth-spin" /> Đang đăng nhập...</>
                : <>ĐĂNG NHẬP <ArrowRight size={18} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>hoặc đăng nhập với</span>
          </div>

          {/* Social */}
          <div className="auth-social">
            <button className="auth-social-btn google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="auth-social-btn facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="auth-switch">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-switch-link">Đăng ký ngay</Link>
          </p>

          <Link to="/" className="auth-back-home">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
