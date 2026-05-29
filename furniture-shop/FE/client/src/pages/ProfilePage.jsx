import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, Loader, Save } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../apis/auth.api';
import './ProfilePage.css';

const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  NHAN_VIEN: 'Nhân viên',
  KHACH_HANG: 'Khách hàng',
};

const STATUS_LABELS = {
  HOAT_DONG: 'Đang hoạt động',
  KHOA: 'Đã khóa',
  VO_HIEU: 'Vô hiệu',
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setProfile(res.data);
          setForm({
            fullName: res.data.fullName || '',
            phone: res.data.phone || '',
          });
        }
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : '?';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Họ tên không được để trống');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await authApi.updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
      });

      if (res.success) {
        setProfile(res.data);
        updateUser(res.data);
        setMessage('Cập nhật thông tin thành công');
      } else {
        setError(res.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lavish-root">
      <DauTrang />

      <main className="profile-page">
        <div className="container">
          <div className="profile-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Thông tin tài khoản</span>
          </div>

          <div className="profile-header">
            <h1>Thông tin tài khoản</h1>
            <p>Quản lý thông tin cá nhân của bạn</p>
          </div>

          {loading ? (
            <div className="profile-loading">
              <Loader size={28} className="profile-spin" />
              <span>Đang tải thông tin...</span>
            </div>
          ) : (
            <div className="profile-layout">
              <aside className="profile-card profile-summary">
                <div className="profile-avatar">{initials}</div>
                <h2>{profile?.fullName}</h2>
                <p>{profile?.email}</p>
                <span className="profile-role">{ROLE_LABELS[profile?.role] || profile?.role}</span>
                <span className={`profile-status status-${profile?.status}`}>
                  {STATUS_LABELS[profile?.status] || profile?.status}
                </span>
              </aside>

              <section className="profile-card profile-form-card">
                <h3>Cập nhật thông tin</h3>

                {message && <div className="profile-alert success">{message}</div>}
                {error && <div className="profile-alert error">{error}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="profile-field">
                    <label htmlFor="fullName">
                      <User size={16} /> Họ và tên
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div className="profile-field readonly">
                    <label>
                      <Mail size={16} /> Email
                    </label>
                    <input value={profile?.email || ''} readOnly />
                    <small>Email không thể thay đổi</small>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="phone">
                      <Phone size={16} /> Số điện thoại
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                    />
                  </div>

                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <Shield size={16} />
                      <div>
                        <span>Vai trò</span>
                        <strong>{ROLE_LABELS[profile?.role] || profile?.role}</strong>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Calendar size={16} />
                      <div>
                        <span>Ngày tham gia</span>
                        <strong>{formatDate(profile?.createdAt)}</strong>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="profile-save-btn" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader size={18} className="profile-spin" /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Lưu thay đổi
                      </>
                    )}
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>

      <ChanTrang />
    </div>
  );
};

export default ProfilePage;
