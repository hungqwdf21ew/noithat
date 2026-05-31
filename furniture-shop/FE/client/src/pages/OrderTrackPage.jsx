import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import DauTrang from '../components/DauTrang';
import ChanTrang from '../components/ChanTrang';
import './OrderTrackPage.css';

const OrderTrackPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Vui lòng nhập mã đơn hàng.');
      return;
    }
    setError('');
    navigate(`/orders/${trimmed}`);
  };

  return (
    <div className="lavish-root">
      <DauTrang />
      <main className="track-order-page">
        <div className="container">
          <nav className="track-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Tra cứu đơn hàng</span>
          </nav>

          <div className="track-card">
            <div className="track-icon">
              <Package size={40} />
            </div>
            <h1>Tra cứu đơn hàng</h1>
            <p>Nhập mã đơn hàng (ví dụ: DH202605301234) để xem trạng thái và chi tiết.</p>

            <form onSubmit={handleSubmit} className="track-form">
              <div className="track-input-wrap">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Mã đơn hàng..."
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                />
              </div>
              {error && <p className="track-error">{error}</p>}
              <button type="submit" className="track-submit">Tra cứu</button>
            </form>

            <p className="track-hint">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link> để xem toàn bộ đơn hàng tại{' '}
              <Link to="/orders">Đơn hàng của tôi</Link>.
            </p>
          </div>
        </div>
      </main>
      <ChanTrang />
    </div>
  );
};

export default OrderTrackPage;
