import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Puzzle, Pencil } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

const actions = [
  {
    id: 1,
    icon: <Scale size={32} strokeWidth={1.5} />,
    title: 'SO SÁNH SẢN PHẨM',
    desc: 'Dễ dàng lựa chọn sản phẩm phù hợp nhất',
    btn: 'BẮT ĐẦU SO SÁNH →',
    path: '/compare'
  },
  {
    id: 2,
    icon: <Puzzle size={32} strokeWidth={1.5} />,
    title: 'KẾT HỢP SẢN PHẨM',
    desc: 'Phối hợp hoàn hảo cho gian sống đẳng cấp',
    btn: 'KHÁM PHÁ NGAY →',
    path: '/bundle'
  },
  {
    id: 3,
    icon: <Pencil size={32} strokeWidth={1.5} />,
    title: 'CÁ NHÂN HÓA KHÔNG GIAN',
    desc: 'Thiết kế riêng theo gu & thẩm mỹ của bạn',
    btn: 'TƯ VẤN MIỄN PHÍ →',
    path: '/design-room'
  }
];

const ThaoTacNoiBat = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="feature-actions container stagger-children" ref={ref} id="compare">
      {actions.map((a, i) => (
        <div
          className={`action-card animate-on-scroll${isVisible ? ' visible' : ''}`}
          key={a.id}
          style={{ transitionDelay: `${i * 0.15}s` }}
        >
          <div className="action-body">
            <div className="action-icon">{a.icon}</div>
            <div className="action-details">
              <h3>{a.title}</h3>
              <p className="muted">{a.desc}</p>
              <Link to={a.path} className="action-btn">
                {a.btn}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ThaoTacNoiBat;