import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, MessageSquare, Image,
  ShoppingBag, Tag, LogOut, Plus, Search,
  Star, Home, DollarSign, TrendingUp, UserCheck, X, Package
} from 'lucide-react';
import userApi from '../../apis/user.api';
import productApi from '../../apis/product.api';
import collectionApi from '../../apis/collection.api';
import { orderApi } from '../../apis/order.api';
import couponApi from '../../apis/coupon.api';
import AdminCouponManage from './AdminCouponManage';
import { getImageUrl } from '../../helpers/image.helper';
import './AdminDashboard.css';

const ORDER_STATUS_META = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', badge: 'warning' },
  DA_XAC_NHAN:  { label: 'Đã xác nhận',  badge: 'info' },
  DANG_GIAO:    { label: 'Đang giao',     badge: 'info' },
  HOAN_THANH:   { label: 'Hoàn thành',   badge: 'success' },
  DA_HUY:       { label: 'Đã huỷ',       badge: 'danger' },
};

const ORDER_STATUS_FILTERS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
  { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
  { value: 'DANG_GIAO', label: 'Đang giao' },
  { value: 'HOAN_THANH', label: 'Hoàn thành' },
  { value: 'DA_HUY', label: 'Đã huỷ' },
];

const PAYMENT_LABELS = {
  THANH_TOAN_KHI_NHAN_HANG: 'COD',
  CHUYEN_KHOAN: 'Chuyển khoản',
  MOMO: 'MoMo',
  VNPAY: 'VNPay',
};

const DashboardPage = ({ initialTab = 'overview' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [coupons, setCoupons] = useState([]);

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

  const [dbCategories, setDbCategories] = useState([]);
  const [editingProd, setEditingProd] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll();
      if (res && res.success) {
        setProducts(res.data.products);
        setDbCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const [collections, setCollections] = useState([]);
  const [newCol, setNewCol] = useState(null);
  const [editingCol, setEditingCol] = useState(null);

  const fetchCollections = async () => {
    try {
      const res = await collectionApi.getAll();
      if (res && res.success) {
        setCollections(res.data);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  const handleCollectionImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await collectionApi.uploadImage(formData);
      if (res.success) {
        if (type === 'new') {
          setNewCol(prev => ({ ...prev, img: res.url }));
        } else {
          setEditingCol(prev => ({ ...prev, img: res.url }));
        }
        alert('Tải hình ảnh bộ sưu tập lên thành công!');
      } else {
        alert(res.message || 'Lỗi khi tải hình ảnh bộ sưu tập.');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tải hình ảnh lên server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveNewCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await collectionApi.create({
        title: newCol.title,
        desc: newCol.desc,
        img: newCol.img || ''
      });
      if (res.success) {
        alert('Đã thêm bộ sưu tập mới thành công!');
        fetchCollections();
        setNewCol(null);
      } else {
        alert(res.message || 'Không thể thêm bộ sưu tập.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi thêm bộ sưu tập.');
    }
  };

  const saveCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await collectionApi.update(editingCol.id, {
        title: editingCol.title,
        desc: editingCol.desc,
        img: editingCol.img || ''
      });
      if (res.success) {
        alert('Cập nhật bộ sưu tập thành công!');
        fetchCollections();
        setEditingCol(null);
      } else {
        alert(res.message || 'Không thể cập nhật bộ sưu tập.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật bộ sưu tập.');
    }
  };

  const deleteCollection = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bộ sưu tập này?')) {
      try {
        const res = await collectionApi.delete(id);
        if (res.success) {
          alert('Xóa bộ sưu tập thành công!');
          fetchCollections();
        } else {
          alert(res.message || 'Không thể xóa bộ sưu tập.');
        }
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra khi xóa bộ sưu tập.');
      }
    }
  };

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchOrder, setSearchOrder] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      if (res && res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await orderApi.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        alert('Cập nhật trạng thái đơn hàng thành công!');
        fetchOrders();
        if (selectedOrder && selectedOrder.MaDonHang === orderId) {
          setSelectedOrder(prev => ({ ...prev, TrangThaiDonHang: nextStatus }));
        }
      } else {
        alert(res.message || 'Cập nhật trạng thái thất bại.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const fetchOrderItemsDetail = async (order) => {
    setOrderDetailLoading(true);
    setSelectedOrder(order);
    try {
      const res = await orderApi.getOrderDetail(order.MaDonHangCode || order.MaDonHang);
      if (res.success) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error('[fetchOrderItemsDetail]', err);
      alert(err.message || 'Không thể tải chi tiết đơn hàng.');
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterOrderStatus === 'ALL' || o.TrangThaiDonHang === filterOrderStatus;
    const q = searchOrder.trim().toLowerCase();
    if (!q) return matchStatus;
    const haystack = [
      o.MaDonHangCode,
      o.TenKhachHang,
      o.SoDienThoai,
      o.DiaChiGiaoHang,
    ].filter(Boolean).join(' ').toLowerCase();
    return matchStatus && haystack.includes(q);
  });

  const handleAdminStatusChange = async (e) => {
    const nextStatus = e.target.value;
    if (!selectedOrder || nextStatus === selectedOrder.TrangThaiDonHang) return;
    setUpdatingOrderId(selectedOrder.MaDonHang);
    try {
      await handleUpdateOrderStatus(selectedOrder.MaDonHang, nextStatus);
      setSelectedOrder(prev => ({ ...prev, TrangThaiDonHang: nextStatus }));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders') navigate('/admin/orders');
    else if (location.pathname !== '/admin') navigate('/admin');
  };

  useEffect(() => {
    if (location.pathname.includes('/admin/orders')) {
      setActiveTab('orders');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCollections();
    fetchOrders();
    couponApi.getAll()
      .then((res) => { if (res?.success) setCoupons(res.data || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setRecentTransactions(
        orders.slice(0, 4).map(o => ({
          id: o.MaDonHangCode,
          name: o.TenKhachHang,
          type: ORDER_STATUS_META[o.TrangThaiDonHang]?.label || o.TrangThaiDonHang,
          amount: Number(o.TongTien),
          date: new Date(o.NgayTao).toLocaleString('vi-VN'),
        }))
      );
    }
  }, [orders]);

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



  // 5. Products Setup
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [newProd, setNewProd] = useState(null);

  const saveNewProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await productApi.create({
        name: newProd.name,
        categoryId: Number(newProd.categoryId || dbCategories[0]?.id || 1),
        price: Number(newProd.price),
        stock: Number(newProd.stock),
        image: newProd.image || '',
        description: newProd.description || '',
        material: newProd.material || '',
        color: newProd.color || '',
        size: newProd.size || '',
        gallery: newProd.gallery || [],
        status: newProd.status || 'ACTIVE'
      });
      if (res.success) {
        alert('Đã thêm sản phẩm mới thành công!');
        fetchProducts();
        setNewProd(null);
      } else {
        alert(res.message || 'Không thể thêm sản phẩm.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi thêm sản phẩm.');
    }
  };

  const saveEditingProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await productApi.update(editingProd.id, {
        name: editingProd.name,
        categoryId: Number(editingProd.categoryId),
        price: Number(editingProd.price),
        stock: Number(editingProd.stock),
        image: editingProd.image || '',
        description: editingProd.description || '',
        material: editingProd.material || '',
        color: editingProd.color || '',
        size: editingProd.size || '',
        gallery: editingProd.gallery || [],
        status: editingProd.status || 'ACTIVE',
        sku: editingProd.sku
      });
      if (res.success) {
        alert('Cập nhật sản phẩm thành công!');
        fetchProducts();
        setEditingProd(null);
      } else {
        alert(res.message || 'Không thể cập nhật sản phẩm.');
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra khi cập nhật sản phẩm.');
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await productApi.uploadImage(formData);
      if (res.success) {
        if (type === 'new') {
          setNewProd(prev => ({ ...prev, image: res.url }));
        } else {
          setEditingProd(prev => ({ ...prev, image: res.url }));
        }
        alert('Tải hình ảnh lên thành công!');
      } else {
        alert(res.message || 'Lỗi khi tải hình ảnh.');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tải hình ảnh lên server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploadingImage(true);
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await productApi.uploadImage(formData);
        if (res.success) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        if (type === 'new') {
          setNewProd(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
        } else {
          setEditingProd(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
        }
        alert('Tải thư viện ảnh lên thành công!');
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi tải hình ảnh lên server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (type, index) => {
    if (type === 'new') {
      setNewProd(prev => {
        const newGallery = [...(prev.gallery || [])];
        newGallery.splice(index, 1);
        return { ...prev, gallery: newGallery };
      });
    } else {
      setEditingProd(prev => {
        const newGallery = [...(prev.gallery || [])];
        newGallery.splice(index, 1);
        return { ...prev, gallery: newGallery };
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi hệ thống kho?')) {
      try {
        const res = await productApi.delete(id);
        if (res.success) {
          alert('Xóa sản phẩm thành công!');
          setProducts(prev => prev.filter(p => p.id !== id));
        } else {
          alert(res.message || 'Không thể xóa sản phẩm.');
        }
      } catch (err) {
        alert(err.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
      }
    }
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
              onClick={() => switchTab('overview')}
            >
              <TrendingUp size={18} />
              <span>Báo cáo thống kê</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => switchTab('users')}
            >
              <Users size={18} />
              <span>Kiểm soát truy cập</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => switchTab('products')}
            >
              <ShoppingBag size={18} />
              <span>Thiết lập sản phẩm</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => switchTab('collections')}
            >
              <Image size={18} />
              <span>Biên tập bộ sưu tập</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => switchTab('coupons')}
            >
              <Tag size={18} />
              <span>Thiết lập giảm giá</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => switchTab('orders')}
            >
              <Package size={18} />
              <span>Quản lý đơn hàng</span>
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => switchTab('reviews')}
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
                  <strong>
                    {(orders.filter(o => o.TrangThaiDonHang === 'HOAN_THANH').reduce((sum, o) => sum + Number(o.TongTien), 0) || 668000000).toLocaleString('vi-VN')} ₫
                  </strong>
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
                  <strong>{coupons.filter(c => c.status === 'HOAT_DONG').length} mã coupon</strong>
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
              <button
                className="admin-btn-add"
                onClick={() => setNewCol({ title: '', desc: '', img: '' })}
              >
                <Plus size={16} /> Thêm bộ sưu tập
              </button>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="admin-col-btn-edit"
                        onClick={() => setEditingCol({ ...col })}
                        style={{ flex: 1 }}
                      >
                        Sửa
                      </button>
                      <button
                        className="admin-col-btn-edit"
                        onClick={() => deleteCollection(col.id)}
                        style={{ flex: 1, background: 'var(--admin-danger)', color: '#fff', border: 'none' }}
                      >
                        Xóa
                      </button>
                    </div>
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
                      <label>Mô tả ngắn</label>
                      <textarea
                        rows={3}
                        value={editingCol.desc}
                        onChange={e => setEditingCol({ ...editingCol, desc: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Đường dẫn hình ảnh</label>
                      <input
                        type="text"
                        value={editingCol.img || ''}
                        onChange={e => setEditingCol({ ...editingCol, img: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Hoặc Tải ảnh mới từ thiết bị</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleCollectionImageUpload(e, 'edit')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {uploadingImage && <small style={{ color: 'var(--admin-gold)', display: 'block', marginTop: '4px' }}>Đang tải ảnh lên...</small>}
                      {editingCol.img && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={getImageUrl(editingCol.img)}
                            alt="Preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
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

            {/* Modal Add Collection */}
            {newCol && (
              <div className="admin-modal-overlay">
                <div className="admin-modal">
                  <h3>Thêm bộ sưu tập mới</h3>
                  <form onSubmit={saveNewCollection}>
                    <div className="admin-form-group">
                      <label>Tiêu đề</label>
                      <input
                        type="text"
                        value={newCol.title}
                        onChange={e => setNewCol({ ...newCol, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả ngắn</label>
                      <textarea
                        rows={3}
                        value={newCol.desc}
                        onChange={e => setNewCol({ ...newCol, desc: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Đường dẫn hình ảnh</label>
                      <input
                        type="text"
                        value={newCol.img || ''}
                        onChange={e => setNewCol({ ...newCol, img: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Hoặc Tải ảnh mới từ thiết bị</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleCollectionImageUpload(e, 'new')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {uploadingImage && <small style={{ color: 'var(--admin-gold)', display: 'block', marginTop: '4px' }}>Đang tải ảnh lên...</small>}
                      {newCol.img && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={getImageUrl(newCol.img)}
                            alt="Preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setNewCol(null)}>
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
                  onClick={() => setNewProd({ name: '', categoryId: dbCategories[0]?.id || '', price: '', stock: '', image: '', gallery: [], material: '', color: '', size: '', description: '' })}
                >
                  <Plus size={16} /> Thêm sản phẩm
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
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
                          <td>
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.name}
                              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                              onError={e => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                            />
                          </td>
                          <td><code>SP-{p.id}</code></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>{p.name}</strong>
                              {p.material && <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Chất liệu: {p.material}</span>}
                              {p.size && <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Size: {p.size}</span>}
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>{p.price.toLocaleString('vi-VN')} ₫</td>
                          <td>{p.stock} cái</td>
                          <td>
                            <div className="admin-action-buttons">
                              <button
                                className="admin-btn-action toggle-role"
                                onClick={() => setEditingProd({ ...p })}
                              >
                                Sửa
                              </button>
                              <button
                                className="admin-btn-action reject"
                                onClick={() => handleDeleteProduct(p.id)}
                              >
                                Xoá
                              </button>
                            </div>
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
                <div className="admin-modal" style={{ maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                        value={newProd.categoryId || ''}
                        onChange={e => setNewProd({ ...newProd, categoryId: e.target.value })}
                        required
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {dbCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label>Đơn giá (₫)</label>
                        <input
                          type="number"
                          value={newProd.price}
                          onChange={e => setNewProd({ ...newProd, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Số lượng tồn kho</label>
                        <input
                          type="number"
                          value={newProd.stock}
                          onChange={e => setNewProd({ ...newProd, stock: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Đường dẫn hình ảnh chính</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: /uploads/products/sofa-1.jpg"
                        value={newProd.image || ''}
                        onChange={e => setNewProd({ ...newProd, image: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Hoặc Tải ảnh từ thiết bị</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'new')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {uploadingImage && <small style={{ color: 'var(--admin-gold)', display: 'block', marginTop: '4px' }}>Đang tải ảnh lên...</small>}
                      {newProd.image && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={getImageUrl(newProd.image)}
                            alt="Preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="admin-form-group" style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
                      <label>Ảnh mô tả (Thư viện ảnh)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => handleGalleryUpload(e, 'new')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {newProd.gallery && newProd.gallery.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                          {newProd.gallery.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img
                                src={getImageUrl(img)}
                                alt={`Gallery ${idx}`}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage('new', idx)}
                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label>Chất liệu</label>
                        <input
                          type="text"
                          placeholder="Gỗ, Vải..."
                          value={newProd.material || ''}
                          onChange={e => setNewProd({ ...newProd, material: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Màu sắc</label>
                        <input
                          type="text"
                          placeholder="Xám, Nâu..."
                          value={newProd.color || ''}
                          onChange={e => setNewProd({ ...newProd, color: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Kích thước</label>
                        <input
                          type="text"
                          placeholder="200x80x80 cm..."
                          value={newProd.size || ''}
                          onChange={e => setNewProd({ ...newProd, size: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả chi tiết sản phẩm</label>
                      <textarea
                        rows={3}
                        placeholder="Nhập mô tả sản phẩm..."
                        value={newProd.description || ''}
                        onChange={e => setNewProd({ ...newProd, description: e.target.value })}
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

            {/* Modal Edit Product */}
            {editingProd && (
              <div className="admin-modal-overlay">
                <div className="admin-modal" style={{ maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3>Chỉnh sửa sản phẩm</h3>
                  <form onSubmit={saveEditingProduct}>
                    <div className="admin-form-group">
                      <label>Tên sản phẩm</label>
                      <input
                        type="text"
                        value={editingProd.name}
                        onChange={e => setEditingProd({ ...editingProd, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Danh mục</label>
                      <select
                        value={editingProd.categoryId || ''}
                        onChange={e => setEditingProd({ ...editingProd, categoryId: e.target.value })}
                        required
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {dbCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label>Đơn giá (₫)</label>
                        <input
                          type="number"
                          value={editingProd.price}
                          onChange={e => setEditingProd({ ...editingProd, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Số lượng tồn kho</label>
                        <input
                          type="number"
                          value={editingProd.stock}
                          onChange={e => setEditingProd({ ...editingProd, stock: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Đường dẫn hình ảnh chính</label>
                      <input
                        type="text"
                        value={editingProd.image || ''}
                        onChange={e => setEditingProd({ ...editingProd, image: e.target.value })}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Hoặc Tải ảnh mới từ thiết bị</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, 'edit')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {uploadingImage && <small style={{ color: 'var(--admin-gold)', display: 'block', marginTop: '4px' }}>Đang tải ảnh lên...</small>}
                      {editingProd.image && (
                        <div style={{ marginTop: '8px' }}>
                          <img
                            src={getImageUrl(editingProd.image)}
                            alt="Preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="admin-form-group" style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
                      <label>Ảnh mô tả (Thư viện ảnh)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => handleGalleryUpload(e, 'edit')}
                        disabled={uploadingImage}
                        style={{ display: 'block', marginTop: '6px' }}
                      />
                      {editingProd.gallery && editingProd.gallery.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                          {editingProd.gallery.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img
                                src={getImageUrl(img)}
                                alt={`Gallery ${idx}`}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage('edit', idx)}
                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div className="admin-form-group">
                        <label>Chất liệu</label>
                        <input
                          type="text"
                          value={editingProd.material || ''}
                          onChange={e => setEditingProd({ ...editingProd, material: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Màu sắc</label>
                        <input
                          type="text"
                          value={editingProd.color || ''}
                          onChange={e => setEditingProd({ ...editingProd, color: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Kích thước</label>
                        <input
                          type="text"
                          value={editingProd.size || ''}
                          onChange={e => setEditingProd({ ...editingProd, size: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Mô tả chi tiết sản phẩm</label>
                      <textarea
                        rows={3}
                        value={editingProd.description || ''}
                        onChange={e => setEditingProd({ ...editingProd, description: e.target.value })}
                      />
                    </div>
                    <div className="admin-modal-buttons">
                      <button type="button" className="admin-btn-cancel" onClick={() => setEditingProd(null)}>
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

        {activeTab === 'coupons' && (
          <AdminCouponManage onDataChange={setCoupons} />
        )}

        {/* ── TAB: ORDER MANAGEMENT ── */}
        {activeTab === 'orders' && (
          <>
            <div className="admin-content-header">
              <div>
                <h1>Quản lý đơn hàng</h1>
                <p>Theo dõi, xử lý và cập nhật trạng thái đơn hàng từ API</p>
              </div>
              <button type="button" className="admin-btn-add" onClick={fetchOrders} disabled={ordersLoading}>
                {ordersLoading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>

            <div className="admin-order-stats">
              {ORDER_STATUS_FILTERS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  className={`admin-order-stat ${filterOrderStatus === f.value ? 'active' : ''}`}
                  onClick={() => setFilterOrderStatus(f.value)}
                >
                  <strong>
                    {f.value === 'ALL'
                      ? orders.length
                      : orders.filter(o => o.TrangThaiDonHang === f.value).length}
                  </strong>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            <div className="admin-data-card">
              <div className="admin-table-actions">
                <div className="admin-search-wrapper">
                  <Search size={16} style={{ color: 'var(--admin-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn, tên, SĐT, địa chỉ..."
                    value={searchOrder}
                    onChange={e => setSearchOrder(e.target.value)}
                  />
                </div>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                  Hiển thị {filteredOrders.length} / {orders.length} đơn
                </div>
              </div>

              {ordersLoading ? (
                <div className="admin-order-loading">Đang tải danh sách đơn hàng...</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Liên hệ / Giao hàng</th>
                        <th>Tổng tiền</th>
                        <th>Thanh toán</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--admin-text-muted)' }}>
                            Không có đơn hàng phù hợp bộ lọc.
                          </td>
                        </tr>
                      ) : filteredOrders.map(order => {
                        const meta = ORDER_STATUS_META[order.TrangThaiDonHang] || ORDER_STATUS_META.CHO_XAC_NHAN;
                        const ngayTao = new Date(order.NgayTao).toLocaleString('vi-VN');
                        return (
                          <tr key={order.MaDonHang}>
                            <td><code>{order.MaDonHangCode}</code></td>
                            <td><strong>{order.TenKhachHang}</strong></td>
                            <td>
                              <div className="admin-order-contact">
                                <span>{order.SoDienThoai}</span>
                                <small>{order.DiaChiGiaoHang}</small>
                              </div>
                            </td>
                            <td><strong>{Number(order.TongTien).toLocaleString('vi-VN')} ₫</strong></td>
                            <td>{PAYMENT_LABELS[order.PhuongThucThanhToan] || order.PhuongThucThanhToan}</td>
                            <td>
                              <span className={`admin-badge ${meta.badge}`}>{meta.label}</span>
                            </td>
                            <td><small>{ngayTao}</small></td>
                            <td>
                              <div className="admin-action-buttons">
                                <button
                                  type="button"
                                  className="admin-btn-action toggle-role"
                                  onClick={() => fetchOrderItemsDetail(order)}
                                >
                                  Chi tiết
                                </button>
                                {order.TrangThaiDonHang === 'CHO_XAC_NHAN' && (
                                  <button
                                    type="button"
                                    className="admin-btn-action approve"
                                    disabled={updatingOrderId === order.MaDonHang}
                                    onClick={() => handleUpdateOrderStatus(order.MaDonHang, 'DA_XAC_NHAN')}
                                  >
                                    Xác nhận
                                  </button>
                                )}
                                {order.TrangThaiDonHang === 'DA_XAC_NHAN' && (
                                  <button
                                    type="button"
                                    className="admin-btn-action approve"
                                    disabled={updatingOrderId === order.MaDonHang}
                                    onClick={() => handleUpdateOrderStatus(order.MaDonHang, 'DANG_GIAO')}
                                  >
                                    Giao hàng
                                  </button>
                                )}
                                {order.TrangThaiDonHang === 'DANG_GIAO' && (
                                  <button
                                    type="button"
                                    className="admin-btn-action approve"
                                    disabled={updatingOrderId === order.MaDonHang}
                                    onClick={() => handleUpdateOrderStatus(order.MaDonHang, 'HOAN_THANH')}
                                  >
                                    Hoàn thành
                                  </button>
                                )}
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

            {selectedOrder && (
              <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="admin-modal admin-order-modal" onClick={e => e.stopPropagation()}>
                  <div className="admin-order-modal-header">
                    <h3>Chi tiết đơn {selectedOrder.MaDonHangCode}</h3>
                    <button type="button" className="admin-order-close" onClick={() => setSelectedOrder(null)}>
                      <X size={18} />
                    </button>
                  </div>

                  {orderDetailLoading ? (
                    <p className="admin-order-loading">Đang tải chi tiết...</p>
                  ) : (
                    <>
                      <div className="admin-order-modal-grid">
                        <div>
                          <label>Khách hàng</label>
                          <p>{selectedOrder.TenKhachHang}</p>
                        </div>
                        <div>
                          <label>Số điện thoại</label>
                          <p>{selectedOrder.SoDienThoai}</p>
                        </div>
                        <div className="admin-order-modal-full">
                          <label>Địa chỉ giao hàng</label>
                          <p>{selectedOrder.DiaChiGiaoHang}</p>
                        </div>
                        {selectedOrder.GhiChu && (
                          <div className="admin-order-modal-full">
                            <label>Ghi chú</label>
                            <p>{selectedOrder.GhiChu}</p>
                          </div>
                        )}
                        <div>
                          <label>Cập nhật trạng thái</label>
                          <select
                            value={selectedOrder.TrangThaiDonHang}
                            onChange={handleAdminStatusChange}
                            disabled={updatingOrderId === selectedOrder.MaDonHang}
                          >
                            {Object.entries(ORDER_STATUS_META).map(([value, { label }]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label>Thanh toán</label>
                          <p>{PAYMENT_LABELS[selectedOrder.PhuongThucThanhToan] || selectedOrder.PhuongThucThanhToan}</p>
                        </div>
                      </div>

                      <h4 className="admin-order-items-title">Sản phẩm trong đơn</h4>
                      {selectedOrder.chiTiet?.length ? (
                        <div className="admin-order-items">
                          {selectedOrder.chiTiet.map(item => (
                            <div key={item.MaChiTietDonHang} className="admin-order-item">
                              <img
                                src={getImageUrl(item.HinhAnhChinh)}
                                alt={item.TenSanPham}
                                onError={e => { e.target.src = 'https://placehold.co/80x80?text=SP'; }}
                              />
                              <div>
                                <strong>{item.TenSanPham}</strong>
                                <small>SL: {item.SoLuong} × {Number(item.DonGia).toLocaleString('vi-VN')} ₫</small>
                              </div>
                              <span>{(Number(item.DonGia) * item.SoLuong).toLocaleString('vi-VN')} ₫</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="admin-order-loading">Chưa có dòng sản phẩm (mở lại Chi tiết để tải).</p>
                      )}

                      <div className="admin-order-totals">
                        <div><span>Tạm tính</span><span>{Number(selectedOrder.TamTinh).toLocaleString('vi-VN')} ₫</span></div>
                        {Number(selectedOrder.TienGiam) > 0 && (
                          <div><span>Giảm giá</span><span>- {Number(selectedOrder.TienGiam).toLocaleString('vi-VN')} ₫</span></div>
                        )}
                        <div>
                          <span>Phí vận chuyển</span>
                          <span>
                            {Number(selectedOrder.PhiVanChuyen) === 0
                              ? 'Miễn phí'
                              : `${Number(selectedOrder.PhiVanChuyen).toLocaleString('vi-VN')} ₫`}
                          </span>
                        </div>
                        <div className="admin-order-total-row">
                          <span>Tổng cộng</span>
                          <strong>{Number(selectedOrder.TongTien).toLocaleString('vi-VN')} ₫</strong>
                        </div>
                      </div>
                    </>
                  )}
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
