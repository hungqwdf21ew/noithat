import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      if (onSubmit) {
        onSubmit({ rating, comment, productId: product?.id });
      }
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 600);
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <div className="review-modal-overlay" onClick={handleClose}>
      <div className="review-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {isSubmitted ? (
          <div className="review-success">
            <CheckCircle size={64} className="review-success-icon" />
            <h3>Cảm ơn bạn!</h3>
            <p>Đánh giá của bạn đã được gửi thành công. Chúng tôi rất trân trọng ý kiến của bạn.</p>
          </div>
        ) : (
          <>
            <div className="review-modal-header">
              <h2>Đánh giá sản phẩm</h2>
              <p>Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
            </div>

            {product && (
              <div className="review-product-info">
                <img src={product.image} alt={product.name} className="review-product-img" />
                <div className="review-product-details">
                  <h4>{product.name}</h4>
                  <p>{product.price?.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="review-stars-section">
                <h3>Chất lượng sản phẩm thế nào?</h3>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${(hoveredRating || rating) >= star ? 'filled' : ''}`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        size={32} 
                        fill={(hoveredRating || rating) >= star ? 'currentColor' : 'none'} 
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-textarea-wrapper">
                <label htmlFor="review-comment">Hãy chia sẻ thêm (tùy chọn)</label>
                <textarea
                  id="review-comment"
                  className="review-textarea"
                  placeholder="Sản phẩm có giống mô tả không? Chất liệu như thế nào?..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <div className="review-modal-actions">
                <button type="button" className="btn-review-cancel" onClick={handleClose}>
                  Trở lại
                </button>
                <button 
                  type="submit" 
                  className="btn-review-submit"
                  disabled={rating === 0}
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
