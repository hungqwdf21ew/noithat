import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, MessageSquare, Image,
  ShoppingBag, Tag, LogOut, Plus, Search,
  Star, Home, DollarSign, TrendingUp, UserCheck, X
} from 'lucide-react';
import userApi from '../../apis/user.api';
import './AdminDashboard.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // ── MOCK DATA FOR THE MODULES ──

  // 1. Overview / Statistical Reports
  const [revenueData] = useState([
    { month: 'T1', amount: 85000000 },
    { month: 'T2', amount: 96000000 },
    { month: 'T3', amount: 125000000 },
    { month: 'T4', amount: 110000000 },
    { month: 'T5', amount: 154000000 },
    { month: 'T6', amount: 198000000 }
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { id: '#ORD-9021', name: 'Đỗ Hùng', type: 'Sofa Da Cao Cấp', amount: 10500000, date: 'Vừa xong' },
    { id: '#ORD-9020', name: 'Trần Quyết', type: 'Giường Hoàng Gia', amount: 8900000, date: '10 phút trước' },
    { id: '#ORD-9019', name: 'Nguyễn Vy', type: 'Bàn Trà Đá', amount: 3400000, date: '1 giờ trước' },
    { id: '#ORD-9018', name: 'Phạm Nam', type: 'Đèn Trang Trí', amount: 1500000, date: '3 giờ trước' }
  ]);

  // 2. Access Control / Users
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [newMember, setNewMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAll();
      if (res && res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    const newRole = userToUpdate.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    try {
      const res = await userApi.update(id, {
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: newRole,
        status: userToUpdate.status
      });
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        alert(res.message || 'Không thể đổi quyền.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi đổi quyền.');
    }
  };

  const handleToggleStatus = async (id) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    const newStatus = userToUpdate.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await userApi.update(id, {
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
        status: newStatus
      });
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      } else {
        alert(res.message || 'Không thể đổi trạng thái.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi đổi trạng thái.');
    }
  };

  const saveNewMember = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.create({
        name: newMember.name,
        email: newMember.email,
        password: newMember.password,
        role: newMember.role
      });
      if (res.success) {
        alert('Đã tạo tài khoản thành công!');
        fetchUsers();
        setNewMember(null);
      } else {
        alert(res.message || 'Không thể tạo tài khoản.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi tạo tài khoản.');
    }
  };

  const saveEditingMember = async (e) => {
    e.preventDefault();
    try {
      const { newPassword, ...rest } = editingMember;
      const res = await userApi.update(editingMember.id, {
        name: rest.name,
        email: rest.email,
        role: rest.role,
        status: rest.status
      });
      if (res.success) {
        if (newPassword) {
          const passRes = await userApi.resetPassword(editingMember.id, newPassword);
          if (!passRes.success) {
            alert('Cập nhật thông tin thành công nhưng đặt lại mật khẩu thất bại: ' + passRes.message);
          } else {
            alert('Đã cập nhật thông tin và mật khẩu mới thành công!');
          }
        } else {
          alert('Cập nhật thông tin thành công!');
        }
        fetchUsers();
        setEditingMember(null);
      } else {
        alert(res.message || 'Không thể cập nhật tài khoản.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật tài khoản.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này khỏi danh sách truy cập?')) {
      try {
        const res = await userApi.delete(id);
        if (res.success) {
          alert('Xóa tài khoản thành công!');
          setUsers(prev => prev.filter(u => u.id !== id));
        } else {
          alert(res.message || 'Không thể xóa tài khoản.');
        }
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra khi xóa tài khoản.');
      }
    }
  };

  // 3. Review Moderation
  const [reviews, setReviews] = useState([
    { id: 1, product: 'Sofa Da Milano', user: 'Nam Lê', rating: 5, comment: 'Sofa cực kỳ êm ái, da thật sờ rất sướng tay. Đáng đồng tiền!', status: 'PENDING' },
    { id: 2, product: 'Bàn Trà Kính', user: 'Vân Khánh', rating: 2, comment: 'Giao hàng hơi chậm, mặt kính bám vân tay nhiều.', status: 'PENDING' },
    { id: 3, product: 'Giường Ngủ Hoàng Gia', user: 'Hoàng Long', rating: 5, comment: 'Đẹp xuất sắc. Lắp đặt nhiệt tình!', status: 'APPROVED' },
    { id: 4, product: 'Đèn Bàn Minimalist', user: 'Mai Hoa', rating: 4, comment: 'Đèn sáng vừa phải, rất hợp phòng ngủ.', status: 'REJECTED' }
  ]);

  const handleApproveReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleRejectReview = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  // 4. Collections Editor (BST 1 - 13)
  const [collections, setCollections] = useState([
    { id: 1, title: 'Minimalist Elegance', tag: 'Hiện đại', img: '/images/bst1.png', desc: 'Sự tĩnh lặng của không gian đương đại tối giản.' },
    { id: 2, title: 'Royal Oak', tag: 'Cổ điển', img: '/images/bst2.png', desc: 'Vẻ đẹp hoàng tộc sang trọng kết hợp gỗ óc chó.' },
    { id: 3, title: 'Glass & Stone', tag: 'Hiện đại', img: '/images/bst3.png', desc: 'Nét chạm khắc tinh khôi từ thiên nhiên đá kính.' },
    { id: 4, title: 'Cozy Terracotta', tag: 'Decor', img: '/images/bst4.png', desc: 'Ấm áp, gần gũi với sắc cam đất terracotta.' },
    { id: 5, title: 'Navy Gold', tag: 'Cổ điển', img: '/images/bst5.png', desc: 'Sự quyền uy sâu thẳm kết hợp nhung vàng đồng.' },
    { id: 6, title: 'Luxe Bedroom', tag: 'Cổ điển', img: '/images/bst6.png', desc: 'Giấc ngủ hoàng cung đầy vương giả quý phái.' }
  ]);

  const [editingCol, setEditingCol] = useState(null);

  const saveCollection = (e) => {
    e.preventDefault();
    setCollections(prev => prev.map(c => c.id === editingCol.id ? editingCol : c));
    setEditingCol(null);
  };

  // 5. Products Setup
  const [products, setProducts] = useState([
    { id: 'SP-101', name: 'Sofa Da Milano', category: 'Phòng khách', price: 10500000, stock: 12 },
    { id: 'SP-102', name: 'Giường Ngủ Hoàng Gia', category: 'Phòng ngủ', price: 8900000, stock: 8 },
    { id: 'SP-103', name: 'Bàn Trà Kính Cường Lực', category: 'Phòng khách', price: 2000000, stock: 24 },
    { id: 'SP-104', name: 'Ghế Thư Giãn Đọc Sách', category: 'Decor', price: 3400000, stock: 15 },
    { id: 'SP-105', name: 'Đèn Bàn Trang Trí Gold', category: 'Tủ & Đèn', price: 750000, stock: 30 }
  ]);

  const [searchProduct, setSearchProduct] = useState('');
  const [newProd, setNewProd] = useState(null);

  const saveNewProduct = (e) => {
    e.preventDefault();
    const newId = 'SP-' + (Math.floor(Math.random() * 900) + 100);
    setProducts(prev => [...prev, { ...newProd, id: newId }]);
    setNewProd(null);
  };

  // 6. Coupon Setup
  const [coupons, setCoupons] = useState([
    { code: 'LAVISH2026', value: 20, type: 'PERCENTAGE', limit: 100, used: 45, status: 'ACTIVE' },
    { code: 'HERITAGE100', value: 100000, type: 'FIXED', limit: 50, used: 12, status: 'ACTIVE' },
    { code: 'ROYAL50', value: 50, type: 'PERCENTAGE', limit: 10, used: 10, status: 'EXPIRED' }
  ]);

  const [newCoupon, setNewCoupon] = useState(null);

  const saveNewCoupon = (e) => {
    e.preventDefault();
    setCoupons(prev => [...prev, { ...newCoupon, used: 0, status: 'ACTIVE' }]);
    setNewCoupon(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard-container">
      {/* ── SIDEBAR NAV ── */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-logo-section">
            <LayoutDashboard size={24} className="text-gold" style={{ color: 'var(--admin-gold)' }} />
            <h2>LAVISH ADMIN</h2>
          </div>
          <nav className="admin-sidebar-nav">
            <button
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={18} />
              <span>Báo cáo thống kê</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>Kiểm soát truy cập</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <ShoppingBag size={18} />
              <span>Thiết lập sản phẩm</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => setActiveTab('collections')}
            >
              <Image size={18} />
              <span>Biên tập bộ sưu tập</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <Tag size={18} />
              <span>Thiết lập giảm giá</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={18} />
              <span>Kiểm duyệt đánh giá</span>
            </button>
          </nav>
        </div>

        <div>
          <div className="admin-user-card">
            <div className="admin-avatar">
              {user?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info">
              <span>{user?.fullName || 'Quản trị viên'}</span>
              <small>Hệ thống Admin</small>
            </div>
          </div>
          <button className="admin-nav-item" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
            <Home size={18} />
            <span>Về Trang Chủ</span>
          </button>
          <button className="admin-btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT PANEL ── */}
      <main className="admin-main-content">
        
        {/* ── TAB: OVERVIEW & REPORTS ── */}
        {activeTab === 'overview' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Báo cáo thống kê</h1>
                <p>Tổng quan chỉ số kinh doanh và hoạt động của Lavish Heritage</p>
              </div>
            </div>

            {/* Widgets */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><DollarSign size={24} /></div>
                <div className="admin-stat-info">
                  <small>Tổng doanh thu</small>
                  <strong>668,000,000 ₫</strong>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Users size={24} /></div>
                <div className="admin-stat-info">
                  <small>Tổng khách hàng</small>
                  <strong>{users.length} thành viên</strong>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><MessageSquare size={24} /></div>
                <div className="admin-stat-info">
                  <small>Yêu cầu đánh giá</small>
                  <strong>{reviews.filter(r => r.status === 'PENDING').length} bình luận chờ</strong>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Tag size={24} /></div>
                <div className="admin-stat-info">
                  <small>Mã giảm giá hoạt động</small>
                  <strong>{coupons.filter(c => c.status === 'ACTIVE').length} mã coupon</strong>
                </div>
              </div>
            </div>

            {/* Graphs & Activity */}
            <div className="admin-charts-section">
              <div className="admin-chart-box">
                <h3>Biểu đồ doanh thu 6 tháng (Năm 2026)</h3>
                <div className="admin-bar-chart-container">
                  {revenueData.map((data, idx) => {
                    const pct = (data.amount / 200000000) * 100;
                    return (
                      <div key={idx} className="admin-chart-bar-wrapper">
                        <div className="admin-chart-bar" style={{ height: `${pct}%` }}>
                          <span className="admin-chart-bar-tooltip">{(data.amount / 1000000).toFixed(0)}Tr ₫</span>
                        </div>
                        <span className="admin-chart-bar-label">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-activity-box">
                <h3>Hoạt động giao dịch mới nhất</h3>
                <div className="admin-recent-list">
                  {recentTransactions.map((tr) => (
                    <div key={tr.id} className="admin-activity-item">
                      <div className="admin-act-details">
                        <span>{tr.name} — {tr.type}</span>
                        <small>{tr.id} • {tr.date}</small>
                      </div>
                      <div className="admin-act-amount">
                        +{tr.amount.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── TAB: ACCESS CONTROL ── */}
        {activeTab === 'users' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Kiểm soát quyền truy cập</h1>
                <p>Danh sách tài khoản khách hàng và quản lý phân quyền sử dụng</p>
              </div>
            </div>

            <div className="admin-data-card">
              <div className="admin-table-actions">
                <div className="admin-search-wrapper">
                  <Search size={16} style={{ color: 'var(--admin-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Tìm thành viên theo tên hoặc email..."
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                  />
                </div>
                <button
                  className="admin-btn-add"
                  onClick={() => setNewMember({ name: '', email: '', role: 'CUSTOMER' })}
                >
                  <Plus size={16} /> Thêm thành viên
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tên thành viên</th>
                      <th>Email</th>
                      <th>Phân quyền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()))
                      .map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`admin-badge ${u.role === 'ADMIN' ? 'success' : 'info'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-badge ${u.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                              {u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-action-buttons">
                              <button
                                className="admin-btn-action toggle-role"
                                onClick={() => setEditingMember({ ...u })}
                              >
                                Sửa thông tin
                              </button>
                              <button
                                className="admin-btn-action toggle-role"
                                onClick={() => handleToggleRole(u.id)}
                              >
                                Đổi quyền
                              </button>
                              <button
                                className={`admin-btn-action ${u.status === 'ACTIVE' ? 'reject' : 'approve'}`}
                                onClick={() => handleToggleStatus(u.id)}
                              >
                                {u.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
                              </button>
                              <button
                                className="admin-btn-action delete"
                                onClick={() => handleDeleteMember(u.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Add Member */}
            {newMember && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Thêm thành viên mới</h3>
                  <form onSubmit={saveNewMember}>
                    <div className="admin-form-group">
                      <label>Họ tên thành viên</label>
                      <input
                        type="text"
                        value={newMember.name}
                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Địa chỉ Email</label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Mật khẩu khởi tạo</label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu của thành viên..."
                        value={newMember.password || ''}
                        onChange={e => setNewMember({ ...newMember, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Phân quyền truy cập</label>
                      <select
                        value={newMember.role}
                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                      >
                        <option value="CUSTOMER">CUSTOMER (Khách hàng)</option>
                        <option value="ADMIN">ADMIN (Quản trị viên)</option>
                      </select>
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setNewMember(null)}>
                        Hủy
                      </button>
                      <button type="submit" className="admin-btn-submit">
                        Thêm mới
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Edit Member */}
            {editingMember && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Chỉnh sửa tài khoản</h3>
                  <form onSubmit={saveEditingMember}>
                    <div className="admin-form-group">
                      <label>Họ tên</label>
                      <input
                        type="text"
                        value={editingMember.name}
                        onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editingMember.email}
                        onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Mật khẩu mới (Để trống nếu không đổi)</label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới để đặt lại..."
                        value={editingMember.newPassword || ''}
                        onChange={e => setEditingMember({ ...editingMember, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Phân quyền</label>
                      <select
                        value={editingMember.role}
                        onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Trạng thái</label>
                      <select
                        value={editingMember.status}
                        onChange={e => setEditingMember({ ...editingMember, status: e.target.value })}
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="SUSPENDED">Bị khóa</option>
                      </select>
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setEditingMember(null)}>
                        Hủy
                      </button>
                      <button type="submit" className="admin-btn-submit">
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: REVIEW MODERATION ── */}
        {activeTab === 'reviews' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Kiểm duyệt đánh giá</h1>
                <p>Kiểm soát bình luận, đánh giá chất lượng sản phẩm từ khách hàng</p>
              </div>
            </div>

            <div className="admin-data-card">
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Sản phẩm</th>
                      <th>Điểm số</th>
                      <th>Nội dung bình luận</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.user}</strong></td>
                        <td>{r.product}</td>
                        <td>
                          <div className="admin-stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '280px' }}><em>"{r.comment}"</em></td>
                        <td>
                          <span className={`admin-badge ${
                            r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'
                          }`}>
                            {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Đã ẩn' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td>
                          {r.status === 'PENDING' ? (
                            <div className="admin-action-buttons">
                              <button
                                className="admin-btn-action approve"
                                onClick={() => handleApproveReview(r.id)}
                              >
                                Phê duyệt
                              </button>
                              <button
                                className="admin-btn-action reject"
                                onClick={() => handleRejectReview(r.id)}
                              >
                                Ẩn đi
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>Đã xử lý</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── TAB: COLLECTIONS EDITOR ── */}
        {activeTab === 'collections' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Biên tập bộ sưu tập</h1>
                <p>Quản lý nội dung, hình ảnh và tiêu đề các bộ sưu tập nội thất</p>
              </div>
            </div>

            <div className="admin-collections-grid">
              {collections.map(col => (
                <div key={col.id} className="admin-col-card">
                  <div className="admin-col-img">
                    <img src={col.img} alt={col.title} />
                    <span className="admin-col-tag">{col.tag}</span>
                  </div>
                  <div className="admin-col-body">
                    <h4>{col.title}</h4>
                    <p>{col.desc}</p>
                    <button
                      className="admin-col-btn-edit"
                      onClick={() => setEditingCol({ ...col })}
                    >
                      Chỉnh sửa nội dung
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit Collection */}
            {editingCol && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Sửa bộ sưu tập {editingCol.id}</h3>
                  <form onSubmit={saveCollection}>
                    <div className="admin-form-group">
                      <label>Tiêu đề</label>
                      <input
                        type="text"
                        value={editingCol.title}
                        onChange={e => setEditingCol({ ...editingCol, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Nhãn danh mục (Tag)</label>
                      <input
                        type="text"
                        value={editingCol.tag}
                        onChange={e => setEditingCol({ ...editingCol, tag: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả ngắn</label>
                      <textarea
                        rows={3}
                        value={editingCol.desc}
                        onChange={e => setEditingCol({ ...editingCol, desc: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setEditingCol(null)}>
                        Hủy
                      </button>
                      <button type="submit" className="admin-btn-submit">
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: PRODUCT SETUP ── */}
        {activeTab === 'products' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Thiết lập sản phẩm</h1>
                <p>Danh sách sản phẩm trong kho và quản lý cập nhật sản phẩm mới</p>
              </div>
            </div>

            <div className="admin-data-card">
              <div className="admin-table-actions">
                <div className="admin-search-wrapper">
                  <Search size={16} style={{ color: 'var(--admin-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm theo tên..."
                    value={searchProduct}
                    onChange={e => setSearchProduct(e.target.value)}
                  />
                </div>
                <button
                  className="admin-btn-add"
                  onClick={() => setNewProd({ name: '', category: 'Phòng khách', price: '', stock: '' })}
                >
                  <Plus size={16} /> Thêm sản phẩm
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã sản phẩm</th>
                      <th>Tên sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Đơn giá</th>
                      <th>Tồn kho</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()))
                      .map(p => (
                        <tr key={p.id}>
                          <td><code>{p.id}</code></td>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.category}</td>
                          <td>{p.price.toLocaleString('vi-VN')} ₫</td>
                          <td>{p.stock} cái</td>
                          <td>
                            <button
                              className="admin-btn-action reject"
                              onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}
                            >
                              Xoá sản phẩm
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Add Product */}
            {newProd && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Thêm sản phẩm mới</h3>
                  <form onSubmit={saveNewProduct}>
                    <div className="admin-form-group">
                      <label>Tên sản phẩm</label>
                      <input
                        type="text"
                        value={newProd.name}
                        onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Danh mục</label>
                      <select
                        value={newProd.category}
                        onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                      >
                        <option value="Phòng khách">Phòng khách</option>
                        <option value="Phòng ngủ">Phòng ngủ</option>
                        <option value="Tủ & Đèn">Tủ & Đèn</option>
                        <option value="Decor">Decor</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Đơn giá (₫)</label>
                      <input
                        type="number"
                        value={newProd.price}
                        onChange={e => setNewProd({ ...newProd, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Số lượng tồn kho</label>
                      <input
                        type="number"
                        value={newProd.stock}
                        onChange={e => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setNewProd(null)}>
                        Hủy
                      </button>
                      <button type="submit" className="admin-btn-submit">
                        Thêm mới
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: COUPON SETUP ── */}
        {activeTab === 'coupons' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Thiết lập giảm giá</h1>
                <p>Tạo và quản lý các mã giảm giá khuyến mãi (Coupons) cho khách hàng</p>
              </div>
            </div>

            <div className="admin-data-card">
              <div className="admin-table-actions">
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                  Tổng cộng: {coupons.length} mã giảm giá
                </div>
                <button
                  className="admin-btn-add"
                  onClick={() => setNewCoupon({ code: '', value: '', type: 'PERCENTAGE', limit: '' })}
                >
                  <Plus size={16} /> Tạo mã mới
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã giảm giá</th>
                      <th>Mức giảm</th>
                      <th>Phân loại</th>
                      <th>Lượt sử dụng</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c, i) => (
                      <tr key={i}>
                        <td><strong>{c.code}</strong></td>
                        <td>
                          {c.type === 'PERCENTAGE' ? `${c.value}%` : `${c.value.toLocaleString('vi-VN')} ₫`}
                        </td>
                        <td>
                          <span className={`admin-badge ${c.type === 'PERCENTAGE' ? 'info' : 'warning'}`}>
                            {c.type === 'PERCENTAGE' ? 'Tỉ lệ %' : 'Khấu trừ cố định'}
                          </span>
                        </td>
                        <td>{c.used} / {c.limit} lượt</td>
                        <td>
                          <span className={`admin-badge ${c.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                            {c.status === 'ACTIVE' ? 'Hoạt động' : 'Hết hạn'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="admin-btn-action reject"
                            onClick={() => setCoupons(prev => prev.filter((_, idx) => idx !== i))}
                          >
                            Xoá mã
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Add Coupon */}
            {newCoupon && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Tạo mã giảm giá mới</h3>
                  <form onSubmit={saveNewCoupon}>
                    <div className="admin-form-group">
                      <label>Mã giảm giá (Viết hoa liền)</label>
                      <input
                        type="text"
                        placeholder="VD: GIAMGIA10"
                        value={newCoupon.code}
                        onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Loại giảm giá</label>
                      <select
                        value={newCoupon.type}
                        onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}
                      >
                        <option value="PERCENTAGE">Giảm theo tỉ lệ (%)</option>
                        <option value="FIXED">Giảm số tiền cố định (₫)</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Giá trị giảm</label>
                      <input
                        type="number"
                        placeholder={newCoupon.type === 'PERCENTAGE' ? 'VD: 15' : 'VD: 50000'}
                        value={newCoupon.value}
                        onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Giới hạn lượt dùng</label>
                      <input
                        type="number"
                        value={newCoupon.limit}
                        onChange={e => setNewCoupon({ ...newCoupon, limit: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setNewCoupon(null)}>
                        Hủy
                      </button>
                      <button type="submit" className="admin-btn-submit">
                        Tạo Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default DashboardPage;
