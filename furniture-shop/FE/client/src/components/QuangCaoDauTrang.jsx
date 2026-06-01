import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Bạn có thể thay đổi các link ảnh này thành ảnh sản phẩm thực tế của bạn
const dsAnhNen = [
  '/images/anhbanghekh.png',
  '/images/anhghesofa.png',
  '/images/anhgiuong.png'
];

const QuangCaoDauTrang = () => {
  const { isLoggedIn } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh nền sau mỗi 4 giây
  useEffect(() => {
    if (isLoggedIn) return; // Nếu đã đăng nhập, ẩn thanh này đi thì không cần chạy hàm
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === dsAnhNen.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  // Vẫn giữ tính năng: Đã đăng nhập thì ẩn đi
  if (isLoggedIn) {
    return null;
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '46px', // Thiết kế mỏng ngang màn hình
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111'
    }}>
      
      {/* 1. Lớp ảnh nền tự động mờ dần và hiện lên (Fade in/out) */}
      {dsAnhNen.map((anh, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${anh})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentIndex === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out', // Hiệu ứng chuyển ảnh mượt mà
            zIndex: 1
          }}
        />
      ))}

      {/* 2. Lớp phủ màu đen trong suốt (Overlay) để đảm bảo chữ trắng luôn dễ đọc */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.65)', // Phủ đen mờ 65%
        zIndex: 2
      }} />

      {/* 3. Lớp Nội dung chữ (Giữ nguyên dòng chữ của bạn) */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '10px 15px',
        textAlign: 'center'
      }}>
        <span>🎁 Đăng ký tài khoản ngay hôm nay để nhận ưu đãi 20% cho đơn hàng đầu tiên!</span>
        <Link 
          to="/register"
          style={{
            color: 'var(--gold, #d4af37)', // Đổi màu link sang vàng gold cho nổi bật trên nền tối
            textDecoration: 'underline',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.color = '#fff'}
          onMouseOut={(e) => e.target.style.color = 'var(--gold, #d4af37)'}
        >
          Đăng Ký Ngay →
        </Link>
      </div>
      
    </div>
  )
}

export default QuangCaoDauTrang
