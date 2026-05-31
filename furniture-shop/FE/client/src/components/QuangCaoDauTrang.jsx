import React from 'react';
import { Link } from 'react-router-dom';

const QuangCaoDauTrang = () => {
  return (
    <div style={{
      backgroundColor: 'var(--gold, #d4af37)', // Bạn có thể đổi màu đen, đỏ hoặc màu thương hiệu
      color: '#fff',
      textAlign: 'center',
      padding: '10px 15px',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      zIndex: 100,
      position: 'relative'
    }}>
      <span>🎁 Đăng ký tài khoản ngay hôm nay để nhận ưu đãi 20% cho đơn hàng đầu tiên!</span>
      <Link 
        to="/register"
        style={{
          color: '#fff',
          textDecoration: 'underline',
          fontWeight: 'bold',
          whiteSpace: 'nowrap'
        }}
      >
        Đăng Ký Ngay →
      </Link>
    </div>
  );
};

export default QuangCaoDauTrang;