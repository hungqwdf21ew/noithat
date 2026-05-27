import React from 'react'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="col">
          <div className="crest">LH</div>
          <p>Lavish Heritage - Nội thất cao cấp phong cách hoàng gia châu Âu.</p>
        </div>
        <div className="col">
          <h4>Liên hệ</h4>
          <p>45 Nguyễn Huệ, Q.1, TP. HCM</p>
          <p>Hotline: (+84) 28 3822 8888</p>
        </div>
        <div className="col">
          <h4>Danh mục</h4>
          <p>Sofa</p>
          <p>Ghế bành</p>
        </div>
        <div className="col">
          <h4>Chính sách</h4>
          <p>Chính sách bảo hành</p>
          <p>Chính sách đổi trả</p>
        </div>
        <div className="col">
          <h4>Kết nối</h4>
          <p>Facebook</p>
          <p>Instagram</p>
        </div>
      </div>
      <div className="copyright">© {new Date().getFullYear()} Lavish Heritage. All rights reserved.</div>
    </footer>
  )
}

export default Footer
