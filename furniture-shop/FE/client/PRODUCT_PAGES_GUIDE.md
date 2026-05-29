# 🎨 Hướng Dẫn Sử Dụng Trang Sản Phẩm

## 📋 Tổng Quan

Đã tạo thành công **2 trang sản phẩm** với giao diện hiện đại, đầy đủ tính năng và animation thú vị:

### 1. **ProductListPage** - Trang Danh Sách Sản Phẩm
- 📍 Route: `/products`
- 📁 File: `src/pages/ProductListPage.jsx`
- 🎨 CSS: `src/pages/ProductListPage.css`

### 2. **ProductDetailPage** - Trang Chi Tiết Sản Phẩm  
- 📍 Route: `/products/:id`
- 📁 File: `src/pages/ProductDetailPage.jsx`
- 🎨 CSS: `src/pages/ProductDetailPage.css`

---

## ✨ Tính Năng Chính

### ProductListPage (Danh Sách Sản Phẩm)

#### 🔍 Tìm Kiếm & Lọc
- **Tìm kiếm theo từ khóa** với search box có animation
- **Lọc theo danh mục** - dropdown danh mục sản phẩm
- **Lọc theo khoảng giá** - input min/max price
- **Lọc theo phong cách** - chips có thể chọn nhiều style
- **Sắp xếp** - mới nhất, giá, phổ biến, đánh giá

#### 🎯 Hiển Thị
- **2 chế độ xem**: Grid (lưới) và List (danh sách)
- **Product Card** với animation hover đẹp mắt
- **Lazy loading** cho hình ảnh
- **Pagination** với số trang

#### 🎭 Animation
- Fade in down cho header
- Slide in từ trái/phải cho controls
- Fade in up cho từng product card với delay
- Smooth transitions cho tất cả interactions

---

### ProductDetailPage (Chi Tiết Sản Phẩm)

#### 🖼️ Gallery Ảnh
- **Main image** lớn với zoom on hover
- **Thumbnail gallery** để chuyển ảnh
- **Navigation buttons** (prev/next)
- **Click to zoom** - modal fullscreen
- **Discount badge** nếu có giảm giá

#### 🛍️ Thông Tin Sản Phẩm
- **Tên sản phẩm** với typography đẹp
- **Rating & Reviews** với stars animation
- **Giá** với animation glow effect
- **Mô tả ngắn** dễ đọc

#### 🎨 Tùy Chọn
- **Chọn màu sắc** - color swatches với animation pop
- **Chọn kích thước** - size buttons
- **Chọn số lượng** - quantity selector với +/-
- **Stock status** - hiển thị tình trạng còn hàng

#### 🛒 Hành Động
- **Thêm vào giỏ** - button với icon
- **Mua ngay** - redirect to cart
- **Yêu thích** - heart animation
- **So sánh** - compare products
- **Chia sẻ** - share button

#### 📦 Thông Tin Bổ Sung
- **4 features** - shipping, warranty, return, installation
- **3 tabs** - description, specifications, reviews
- **Related products** - sản phẩm liên quan

#### 🎭 Animation
- Slide in từ trái cho gallery
- Slide in từ phải cho info
- Fade in down cho từng section với delay
- Price glow effect
- Heart beat animation cho favorite
- Color pop animation khi chọn màu
- Smooth transitions cho tất cả

---

## 🧩 Components Đã Tạo

### 1. ProductCard Component
- 📁 `src/features/Product/ProductCard.jsx`
- 🎨 `src/features/Product/ProductCard.css`

**Features:**
- Hover effects với overlay
- Action buttons (cart, view, compare)
- Favorite button với heart animation
- Badge cho new/discount
- Rating stars với twinkle effect
- Responsive design

### 2. Custom Hooks

#### useProducts
- 📁 `src/hooks/useProducts.js`
- Fetch danh sách sản phẩm với params
- Loading & error states
- Pagination support

#### useProduct
- 📁 `src/hooks/useProducts.js`
- Fetch chi tiết 1 sản phẩm
- Loading & error states

#### useCategories
- 📁 `src/hooks/useCategories.js`
- Fetch danh sách categories
- Loading & error states

---

## 🎨 Animation Effects

### Entrance Animations
```css
fadeIn - Fade in đơn giản
fadeInDown - Fade in từ trên xuống
fadeInUp - Fade in từ dưới lên
slideInLeft - Slide từ trái
slideInRight - Slide từ phải
zoomIn - Zoom in từ nhỏ
```

### Interaction Animations
```css
heartBeat - Animation cho favorite button
pulse - Pulsing effect cho badges
bounce - Bouncing effect
priceGlow - Glow effect cho giá
starTwinkle - Twinkle cho rating stars
colorPop - Pop effect khi chọn màu
```

### Hover Effects
```css
Transform scale - Phóng to nhẹ
Transform translateY - Di chuyển lên/xuống
Box shadow - Đổ bóng động
Color transitions - Chuyển màu mượt
```

---

## 🎯 Cách Sử Dụng

### 1. Truy Cập Trang

```
Danh sách sản phẩm: http://localhost:5173/products
Chi tiết sản phẩm: http://localhost:5173/products/1
```

### 2. Test Filters

```javascript
// URL với filters
/products?search=sofa
/products?category=living-room
/products?minPrice=1000000&maxPrice=5000000
/products?style=Hiện đại
/products?sortBy=price-asc
```

### 3. Tích Hợp API

Các trang đã sẵn sàng tích hợp với API backend:

```javascript
// API endpoints cần có
GET /api/products - Lấy danh sách sản phẩm
GET /api/products/:id - Lấy chi tiết sản phẩm
GET /api/categories - Lấy danh sách categories
```

**Response format mong đợi:**

```javascript
// GET /api/products
{
  success: true,
  data: [
    {
      id: "1",
      name: "Sofa Hiện Đại",
      price: 15000000,
      originalPrice: 20000000,
      discount: 25,
      image: "/images/sofa.jpg",
      images: ["/images/sofa1.jpg", "/images/sofa2.jpg"],
      category: "Phòng khách",
      rating: 4.5,
      reviewCount: 120,
      isNew: true,
      stock: 10
    }
  ],
  pagination: {
    page: 1,
    limit: 12,
    total: 100,
    totalPages: 9
  }
}

// GET /api/products/:id
{
  success: true,
  data: {
    id: "1",
    name: "Sofa Hiện Đại",
    description: "Mô tả ngắn...",
    fullDescription: "Mô tả đầy đủ...",
    price: 15000000,
    originalPrice: 20000000,
    discount: 25,
    images: ["/images/sofa1.jpg", "/images/sofa2.jpg"],
    category: "Phòng khách",
    rating: 4.5,
    reviewCount: 120,
    sku: "SF-001",
    stock: 10,
    colors: [
      { name: "Xám", hex: "#808080" },
      { name: "Nâu", hex: "#8B4513" }
    ],
    sizes: ["2 chỗ", "3 chỗ", "L-shape"],
    features: ["Chất liệu cao cấp", "Thiết kế hiện đại"],
    specifications: {
      "Chất liệu": "Vải bố cao cấp",
      "Kích thước": "200x90x85cm",
      "Trọng lượng": "45kg"
    },
    warranty: "24 tháng",
    relatedProducts: [...]
  }
}
```

---

## 🎨 Tùy Chỉnh Màu Sắc

Các biến CSS chính trong `:root`:

```css
--gold: #d4af37;           /* Màu vàng chủ đạo */
--text-dark: #1a1a1a;      /* Màu chữ đậm */
--text-mid: #666;          /* Màu chữ trung bình */
--text-muted: #999;        /* Màu chữ nhạt */
--bg-main: #fff;           /* Nền chính */
--bg-light: #f8f9fa;       /* Nền nhạt */
--border-light: #e0e0e0;   /* Viền nhạt */
```

Để thay đổi màu sắc, chỉnh trong file CSS hoặc `index.css`.

---

## 📱 Responsive Design

Tất cả trang đều responsive với breakpoints:

```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
```

**Mobile features:**
- Grid chuyển sang 2 cột hoặc 1 cột
- Filters collapse thành panel
- Touch-friendly buttons
- Optimized spacing

---

## 🚀 Performance

### Optimizations Đã Áp Dụng

1. **Lazy Loading** - Hình ảnh chỉ load khi cần
2. **Animation Delays** - Stagger effect cho smooth UX
3. **CSS Transitions** - Hardware-accelerated animations
4. **Debounce Search** - Giảm API calls khi search
5. **Pagination** - Load từng trang thay vì tất cả

---

## 🐛 Troubleshooting

### Lỗi thường gặp:

**1. Không hiển thị sản phẩm**
- Kiểm tra API endpoint có đúng không
- Kiểm tra response format có match không
- Xem console log để debug

**2. Animation không chạy**
- Kiểm tra CSS file đã import chưa
- Clear browser cache
- Kiểm tra browser có support CSS animations không

**3. Images không hiển thị**
- Kiểm tra đường dẫn ảnh
- Kiểm tra ảnh có tồn tại trong public folder không
- Sử dụng placeholder nếu ảnh lỗi

---

## 📚 Dependencies

Packages đã cài đặt:

```json
{
  "lucide-react": "^latest",  // Icons
  "axios": "^latest",         // HTTP client
  "react-router-dom": "^latest" // Routing
}
```

---

## 🎯 Next Steps

### Tính năng có thể thêm:

1. **Quick View Modal** - Xem nhanh sản phẩm không cần chuyển trang
2. **Wishlist Page** - Trang danh sách yêu thích
3. **Compare Page** - Trang so sánh sản phẩm
4. **Reviews System** - Hệ thống đánh giá đầy đủ
5. **Image Zoom** - Zoom ảnh chi tiết hơn
6. **360° View** - Xem sản phẩm 360 độ
7. **AR Preview** - Xem thử sản phẩm bằng AR
8. **Recently Viewed** - Sản phẩm đã xem gần đây
9. **Infinite Scroll** - Thay pagination bằng infinite scroll
10. **Filters Persistence** - Lưu filters vào localStorage

---

## 💡 Tips

1. **Sử dụng mock data** để test UI trước khi có API
2. **Customize animations** bằng cách chỉnh duration và easing
3. **Add loading skeletons** để UX tốt hơn khi loading
4. **Implement error boundaries** để handle errors gracefully
5. **Add toast notifications** cho user feedback

---

## 📞 Support

Nếu cần hỗ trợ thêm:
- Đọc code comments trong các file
- Xem console.log để debug
- Kiểm tra Network tab trong DevTools

---

**Chúc bạn code vui vẻ! 🎉**
