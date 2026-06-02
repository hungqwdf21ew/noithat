import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useAnimations';

const rooms = [
  {
    id: 1,
    title: 'PHÒNG KHÁCH',
    desc: 'Đẳng cấp gia chủ',
    price: 'Từ 165.000.000 đ',
    img: '/images/noi_that_cao_cap_boi_canh_03.png'
  },
  {
    id: 2,
    title: 'PHÒNG NGỦ',
    desc: 'Riêng tư thanh lịch và đẳng cấp',
    price: 'Từ 98.000.000 đ',
    img: '/images/giuongngu_ct_maube_1.png'
  },
  {
    id: 3,
    title: 'PHÒNG ĂN',
    desc: 'Gắn kết và ấm cúng',
    price: 'Từ 85.500.000 đ',
    img: '/images/banantancodien_ct_mauvangdong_12.png'
  }
];

const PhongCamHung = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div className="rooms-grid stagger-children" ref={ref}>
      {rooms.map((r, i) => (
        <Link
          to={`/products?room=${encodeURIComponent(r.title === 'PHÒNG ĂN' ? 'Phòng bếp' : r.title === 'PHÒNG NGỦ' ? 'Phòng ngủ' : 'Phòng khách')}`}
          className={`room-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={r.id}
          style={{
            backgroundImage: `url(${r.img})`,
            transitionDelay: `${i * 0.15}s`,
            display: 'block',
            textDecoration: 'none'
          }}
        >
          <div className="room-overlay">
            <div className="room-info-left">
              <h3>{r.title}</h3>
              <p className="muted">{r.desc}</p>
            </div>
            <div className="room-info-right">
              <div className="from">{r.price}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PhongCamHung;
