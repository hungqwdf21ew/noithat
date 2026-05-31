import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import couponApi from '../../apis/coupon.api';

const COUPON_TYPE_LABEL = {
  PHAN_TRAM: 'Giảm %',
  TIEN_MAT: 'Giảm tiền',
};

const COUPON_STATUS_LABEL = {
  HOAT_DONG: { label: 'Hoạt động', badge: 'success' },
  AN: { label: 'Đã ẩn', badge: 'danger' },
  HET_HAN: { label: 'Hết hạn', badge: 'danger' },
};

const EMPTY_FORM = {
  code: '',
  name: '',
  value: '',
  type: 'PHAN_TRAM',
  minOrder: '0',
  maxDiscount: '',
  limit: '',
  startDate: '',
  endDate: '',
  status: 'HOAT_DONG',
};

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromDateTimeLocal = (value) => (value ? new Date(value).toISOString() : null);

const formatDateRange = (start, end) => {
  if (!start && !end) return 'Không giới hạn';
  const fmt = (v) => new Date(v).toLocaleDateString('vi-VN');
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  if (start) return `Từ ${fmt(start)}`;
  return `Đến ${fmt(end)}`;
};

const buildPayload = (form) => ({
  maCode: form.code.trim(),
  tenMa: form.name?.trim() || form.code.trim(),
  kieuGiam: form.type,
  giaTriGiam: Number(form.value),
  donToiThieu: Number(form.minOrder) || 0,
  giamToiDa: form.maxDiscount !== '' && form.maxDiscount != null ? Number(form.maxDiscount) : null,
  gioiHanSuDung: form.limit !== '' && form.limit != null ? Number(form.limit) : null,
  ngayBatDau: fromDateTimeLocal(form.startDate),
  ngayKetThuc: fromDateTimeLocal(form.endDate),
  trangThai: form.status,
});

const validateForm = (form, isEdit = false) => {
  if (!isEdit && !form.code?.trim()) return 'Vui lòng nhập mã giảm giá.';
  if (form.value === '' || Number(form.value) < 0) return 'Giá trị giảm không hợp lệ.';
  if (form.type === 'PHAN_TRAM' && Number(form.value) > 100) return 'Giảm % tối đa là 100.';
  if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
    return 'Ngày kết thúc phải sau ngày bắt đầu.';
  }
  return '';
};

const couponToForm = (c) => ({
  id: c.id,
  code: c.code,
  name: c.name || '',
  value: String(c.value),
  type: c.type,
  minOrder: String(c.minOrder ?? 0),
  maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : '',
  limit: c.limit != null ? String(c.limit) : '',
  startDate: toDateTimeLocal(c.startDate),
  endDate: toDateTimeLocal(c.endDate),
  status: c.status,
});

const CouponFormModal = ({ title, form, setForm, onClose, onSubmit, saving, isEdit }) => (
  <div className="admin-modal-overlay" onClick={onClose}>
    <div className="admin-modal admin-coupon-modal" onClick={(e) => e.stopPropagation()}>
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        <div className="admin-form-group">
          <label>Mã giảm giá {isEdit ? '' : '(viết hoa, không dấu)'}</label>
          <input
            type="text"
            placeholder="VD: NOITHAT10"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
            required
            readOnly={isEdit}
            style={isEdit ? { opacity: 0.7 } : undefined}
          />
          {isEdit && <small style={{ color: 'var(--admin-text-muted)' }}>Mã không đổi sau khi tạo</small>}
        </div>

        <div className="admin-form-group">
          <label>Tên hiển thị</label>
          <input
            type="text"
            placeholder="VD: Giảm 10% đơn nội thất"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="admin-form-group">
            <label>Loại giảm giá</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PHAN_TRAM">Giảm theo %</option>
              <option value="TIEN_MAT">Giảm tiền cố định (₫)</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="HOAT_DONG">Hoạt động</option>
              <option value="AN">Ẩn</option>
              <option value="HET_HAN">Hết hạn</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label>Giá trị giảm {form.type === 'PHAN_TRAM' ? '(%)' : '(₫)'}</label>
          <input
            type="number"
            min="0"
            max={form.type === 'PHAN_TRAM' ? 100 : undefined}
            placeholder={form.type === 'PHAN_TRAM' ? '10' : '300000'}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="admin-form-group">
            <label>Đơn tối thiểu (₫)</label>
            <input
              type="number"
              min="0"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>Giảm tối đa (₫, chỉ với %)</label>
            <input
              type="number"
              min="0"
              placeholder="Tuỳ chọn"
              value={form.maxDiscount}
              onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
              disabled={form.type !== 'PHAN_TRAM'}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Giới hạn lượt dùng (trống = không giới hạn)</label>
          <input
            type="number"
            min="1"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="admin-form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>Ngày kết thúc</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-modal-buttons">
          <button type="button" className="admin-btn-cancel" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button type="submit" className="admin-btn-submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu mã giảm giá'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const AdminCouponManage = ({ onDataChange }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [formModal, setFormModal] = useState(null);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await couponApi.getAll();
      if (res.success) {
        const list = res.data || [];
        setCoupons(list);
        onDataChange?.(list);
      } else {
        setError(res.message || 'Không thể tải mã giảm giá.');
      }
    } catch (err) {
      setError(err.message || 'Không thể kết nối API mã giảm giá.');
    } finally {
      setLoading(false);
    }
  }, [onDataChange]);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
      if (!q) return matchStatus;
      const hay = [c.code, c.name].filter(Boolean).join(' ').toLowerCase();
      return matchStatus && hay.includes(q);
    });
  }, [coupons, search, filterStatus]);

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter((c) => c.status === 'HOAT_DONG').length,
    hidden: coupons.filter((c) => c.status === 'AN').length,
    expired: coupons.filter((c) => c.status === 'HET_HAN').length,
  }), [coupons]);

  const openCreate = () => setFormModal({ mode: 'create', form: { ...EMPTY_FORM } });

  const openEdit = (coupon) => setFormModal({ mode: 'edit', form: couponToForm(coupon) });

  const closeModal = () => !saving && setFormModal(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formModal) return;

    const errMsg = validateForm(formModal.form, formModal.mode === 'edit');
    if (errMsg) {
      alert(errMsg);
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(formModal.form);
      const res = formModal.mode === 'create'
        ? await couponApi.create(payload)
        : await couponApi.update(formModal.form.id, payload);

      if (res.success) {
        alert(res.message || 'Lưu thành công!');
        setFormModal(null);
        loadCoupons();
      } else {
        alert(res.message || 'Không thể lưu mã giảm giá.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi khi lưu mã giảm giá.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (coupon, status) => {
    try {
      const res = await couponApi.update(coupon.id, { trangThai: status });
      if (res.success) {
        loadCoupons();
      } else {
        alert(res.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi khi cập nhật.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;
    try {
      const res = await couponApi.delete(id);
      if (res.success) {
        alert(res.message || 'Đã xử lý xóa mã.');
        loadCoupons();
      } else {
        alert(res.message || 'Không thể xóa.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi khi xóa.');
    }
  };

  return (
    <>
      <div className="admin-content-header">
        <div>
          <h1>Thiết lập giảm giá</h1>
          <p>Tạo, chỉnh sửa và quản lý mã giảm giá — khách dùng tại trang thanh toán</p>
        </div>
        <button type="button" className="admin-btn-add" onClick={openCreate}>
          <Plus size={16} /> Tạo mã mới
        </button>
      </div>

      <div className="admin-coupon-stats">
        <button type="button" className={filterStatus === 'ALL' ? 'active' : ''} onClick={() => setFilterStatus('ALL')}>
          <strong>{stats.total}</strong><span>Tất cả</span>
        </button>
        <button type="button" className={filterStatus === 'HOAT_DONG' ? 'active' : ''} onClick={() => setFilterStatus('HOAT_DONG')}>
          <strong>{stats.active}</strong><span>Hoạt động</span>
        </button>
        <button type="button" className={filterStatus === 'AN' ? 'active' : ''} onClick={() => setFilterStatus('AN')}>
          <strong>{stats.hidden}</strong><span>Đã ẩn</span>
        </button>
        <button type="button" className={filterStatus === 'HET_HAN' ? 'active' : ''} onClick={() => setFilterStatus('HET_HAN')}>
          <strong>{stats.expired}</strong><span>Hết hạn</span>
        </button>
      </div>

      <div className="admin-data-card">
        <div className="admin-table-actions">
          <div className="admin-search-wrapper">
            <Search size={16} style={{ color: 'var(--admin-text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm theo mã hoặc tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" className="admin-btn-refresh" onClick={loadCoupons} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'admin-spin' : ''} />
            Làm mới
          </button>
        </div>

        {error && (
          <div className="admin-coupon-error">
            {error}
            <button type="button" onClick={loadCoupons}>Thử lại</button>
          </div>
        )}

        {loading ? (
          <p className="admin-coupon-loading">Đang tải mã giảm giá...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Chi tiết</th>
                  <th>Điều kiện</th>
                  <th>Hiệu lực</th>
                  <th>Lượt dùng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-coupon-empty-cell">
                      {coupons.length === 0
                        ? 'Chưa có mã giảm giá. Bấm "Tạo mã mới" để thêm.'
                        : 'Không có mã phù hợp bộ lọc.'}
                    </td>
                  </tr>
                ) : filtered.map((c) => {
                  const st = COUPON_STATUS_LABEL[c.status] || COUPON_STATUS_LABEL.AN;
                  const usedUp = c.limit != null && c.used >= c.limit;
                  return (
                    <tr key={c.id} className={usedUp ? 'admin-coupon-row-used-up' : ''}>
                      <td><strong className="admin-coupon-code">{c.code}</strong></td>
                      <td>
                        <div>{c.name || '—'}</div>
                        <small className="admin-coupon-value">
                          {c.type === 'PHAN_TRAM'
                            ? `Giảm ${c.value}%`
                            : `Giảm ${c.value.toLocaleString('vi-VN')} ₫`}
                          {c.maxDiscount ? ` · Tối đa ${c.maxDiscount.toLocaleString('vi-VN')}₫` : ''}
                        </small>
                      </td>
                      <td>
                        <small>Đơn từ {c.minOrder.toLocaleString('vi-VN')} ₫</small>
                      </td>
                      <td><small>{formatDateRange(c.startDate, c.endDate)}</small></td>
                      <td>
                        <span className={usedUp ? 'admin-coupon-used-full' : ''}>
                          {c.used} / {c.limit ?? '∞'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${st.badge}`}>{st.label}</span>
                      </td>
                      <td>
                        <div className="admin-action-buttons">
                          <button type="button" className="admin-btn-action toggle-role" onClick={() => openEdit(c)}>
                            Sửa
                          </button>
                          {c.status !== 'HOAT_DONG' && (
                            <button type="button" className="admin-btn-action approve" onClick={() => handleQuickStatus(c, 'HOAT_DONG')}>
                              Bật
                            </button>
                          )}
                          {c.status === 'HOAT_DONG' && (
                            <button type="button" className="admin-btn-action toggle-role" onClick={() => handleQuickStatus(c, 'AN')}>
                              Ẩn
                            </button>
                          )}
                          {c.status !== 'HET_HAN' && (
                            <button type="button" className="admin-btn-action reject" onClick={() => handleQuickStatus(c, 'HET_HAN')}>
                              Hết hạn
                            </button>
                          )}
                          <button type="button" className="admin-btn-action delete" onClick={() => handleDelete(c.id)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="admin-coupon-hint">
        Mã mẫu trong DB: <code>NOITHAT10</code>, <code>FREESHIP</code> — khách nhập tại trang thanh toán.
      </p>

      {formModal && (
        <CouponFormModal
          title={formModal.mode === 'create' ? 'Tạo mã giảm giá mới' : `Sửa mã ${formModal.form.code}`}
          form={formModal.form}
          setForm={(form) => setFormModal((prev) => ({ ...prev, form }))}
          onClose={closeModal}
          onSubmit={handleSubmit}
          saving={saving}
          isEdit={formModal.mode === 'edit'}
        />
      )}
    </>
  );
};

export default AdminCouponManage;
