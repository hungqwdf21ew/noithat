# Furniture Shop - Website Thương Mại Điện Tử Nội Thất

## 📋 Tổng quan

**Furniture Shop** là dự án website thương mại điện tử bán hàng nội thất, được xây dựng bằng **React + Vite** ở Frontend, **Node.js + Express** ở Backend và **SQL Server** làm hệ quản trị cơ sở dữ liệu.

Dự án hướng đến việc xây dựng một hệ thống bán hàng trực tuyến có giao diện hiện đại, thẩm mỹ, dễ sử dụng và phù hợp với lĩnh vực nội thất. Website cho phép người dùng xem sản phẩm, tìm kiếm, lọc sản phẩm, thêm vào giỏ hàng, đặt hàng, đánh giá sản phẩm, lưu sản phẩm yêu thích và hỗ trợ quản trị viên quản lý sản phẩm, danh mục, đơn hàng, khách hàng.

Dự án tuân theo kiến trúc **Feature-based** kết hợp với **Clean Architecture** và nguyên tắc **Component-Driven Development**.

---

## 🧰 Công nghệ sử dụng

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS / CSS Modules
- Lucide React

### Backend

- Node.js
- Express.js
- SQL Server
- mssql
- JWT
- bcryptjs
- dotenv
- cors
- multer

### Database

- SQL Server
- File script database: `server/database/furniture_shop_sqlserver.sql`

---

## 🚀 Cách tạo project

### 1. Tạo thư mục chính

```bash
mkdir furniture-shop
cd furniture-shop
```

### 2. Tạo Frontend React + Vite

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install axios react-router-dom lucide-react
npm run dev
```

Sau khi chạy thành công, Frontend sẽ chạy tại:

```txt
http://localhost:5173
```

### 3. Tạo Backend Node.js + Express

Mở terminal mới tại thư mục `furniture-shop`:

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv mssql bcryptjs jsonwebtoken multer
npm install -D nodemon
```

### 4. Tạo cấu trúc Backend

```bash
mkdir src
mkdir src/routes src/controllers src/middlewares src/config src/utils src/services
mkdir database
```

Tạo file chính:

```bash
type nul > src/server.js
type nul > .env
type nul > .env.example
```

Nếu dùng PowerShell:

```powershell
New-Item -ItemType File -Path src/server.js
New-Item -ItemType File -Path .env
New-Item -ItemType File -Path .env.example
```

### 5. Cấu hình `package.json` Backend

Trong file `server/package.json`, thêm phần scripts:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

### 6. Cấu hình file `.env`

Tạo file `server/.env`:

```env
PORT=5000

DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=FurnitureShopDB
DB_PORT=1433

JWT_SECRET=furniture_shop_secret_key
```

### 7. Code mẫu `server/src/server.js`

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Furniture Shop API is running'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Chạy Backend:

```bash
npm run dev
```

Backend sẽ chạy tại:

```txt
http://localhost:5000
```

---

## 🏗️ Cấu trúc dự án

```txt
furniture-shop/
├── client/                         # Frontend React
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── apis/                   # API service layer
│   │   │   ├── axios.config.js
│   │   │   ├── auth.api.js
│   │   │   ├── product.api.js
│   │   │   ├── category.api.js
│   │   │   ├── order.api.js
│   │   │   ├── review.api.js
│   │   │   └── favorite.api.js
│   │   │
│   │   ├── assets/                 # Images, fonts, icons
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/             # Shared components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── contexts/               # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── data/                   # Constants, mock data
│   │   │   ├── menu.constant.js
│   │   │   ├── roles.constant.js
│   │   │   ├── status.constant.js
│   │   │   └── payment.constant.js
│   │   │
│   │   ├── features/               # Feature-based modules
│   │   │   ├── Auth/
│   │   │   ├── Product/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Order/
│   │   │   ├── Review/
│   │   │   ├── Favorite/
│   │   │   ├── Compare/
│   │   │   ├── DesignRoom/
│   │   │   └── Admin/
│   │   │
│   │   ├── helpers/                # Helper có side effects
│   │   │   ├── storage.helper.js
│   │   │   ├── token.helper.js
│   │   │   └── cart.helper.js
│   │   │
│   │   ├── hooks/                  # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProducts.js
│   │   │   ├── useCart.js
│   │   │   ├── useOrders.js
│   │   │   ├── useCategories.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── layouts/                # Layout components
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── libs/                   # Third-party configs
│   │   │   └── axios.js
│   │   │
│   │   ├── pages/                  # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── FavoritePage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── DesignRoomPage.jsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.jsx
│   │   │       ├── ProductManagePage.jsx
│   │   │       ├── CategoryManagePage.jsx
│   │   │       ├── OrderManagePage.jsx
│   │   │       └── UserManagePage.jsx
│   │   │
│   │   ├── utils/                  # Pure utility functions
│   │   │   ├── currency.util.js
│   │   │   ├── date.util.js
│   │   │   ├── validation.util.js
│   │   │   └── slug.util.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   └── package.json
│
├── server/                         # Backend Node.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── review.controller.js
│   │   │   └── favorite.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── review.routes.js
│   │   │   └── favorite.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── product.service.js
│   │   │   └── order.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── response.js
│   │   │
│   │   └── server.js
│   │
│   ├── database/
│   │   └── furniture_shop_sqlserver.sql
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔄 Luồng xử lý dữ liệu

```txt
User Interaction → Page → Feature Component → Custom Hook → API Service → Backend
                     ↓                                          ↓
                  Context                                   Response
                     ↓                                          ↓
                Components ← State Update ← Hook ← API Service
```

Ví dụ luồng đặt hàng:

```txt
Người dùng bấm "Xác nhận đặt hàng"
→ CheckoutPage
→ CheckoutForm trong features/Checkout
→ useOrders hook
→ order.api.js
→ Backend /api/orders
→ SQL Server lưu Orders và OrderItems
→ Backend trả kết quả
→ React hiển thị thông báo đặt hàng thành công
```

---

## 📝 Quy tắc đặt tên file

### 1. Components

```txt
PascalCase.jsx
```

Ví dụ:

```txt
Button.jsx
Input.jsx
ProductCard.jsx
CartItem.jsx
OrderTable.jsx
AdminSidebar.jsx
```

### 2. Pages

```txt
PascalCasePage.jsx
```

Ví dụ:

```txt
HomePage.jsx
ProductListPage.jsx
ProductDetailPage.jsx
CartPage.jsx
CheckoutPage.jsx
LoginPage.jsx
DashboardPage.jsx
```

### 3. Hooks

```txt
use<Name>.js
```

Ví dụ:

```txt
useAuth.js
useProducts.js
useCart.js
useOrders.js
useCategories.js
useDebounce.js
```

### 4. APIs

```txt
<entity>.api.js
```

Ví dụ:

```txt
auth.api.js
product.api.js
category.api.js
order.api.js
review.api.js
favorite.api.js
```

### 5. Utils

```txt
<purpose>.util.js
```

Ví dụ:

```txt
currency.util.js
date.util.js
validation.util.js
slug.util.js
```

### 6. Helpers

```txt
<purpose>.helper.js
```

Ví dụ:

```txt
storage.helper.js
token.helper.js
cart.helper.js
```

### 7. Constants

```txt
<name>.constant.js
```

Ví dụ:

```txt
roles.constant.js
status.constant.js
payment.constant.js
menu.constant.js
```

---

## 💻 Code mẫu quan trọng

### 1. Axios Config

File: `client/src/apis/axios.config.js`

```javascript
import axios from 'axios';
import { getToken, removeToken } from '../helpers/storage.helper';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 2. Product API

File: `client/src/apis/product.api.js`

```javascript
import axiosInstance from './axios.config';

export const productApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post('/products', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
```

### 3. Storage Helper

File: `client/src/helpers/storage.helper.js`

```javascript
const TOKEN_KEY = 'furniture_shop_token';
const USER_KEY = 'furniture_shop_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearStorage = () => {
  localStorage.clear();
};
```

### 4. Cart Helper

File: `client/src/helpers/cart.helper.js`

```javascript
const CART_KEY = 'furniture_shop_cart';

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cartItems) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

export const clearCartStorage = () => {
  localStorage.removeItem(CART_KEY);
};
```

### 5. Format tiền Việt Nam

File: `client/src/utils/currency.util.js`

```javascript
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 ₫';

  return Number(value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};
```

### 6. Validate Form

File: `client/src/utils/validation.util.js`

```javascript
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^(0|\+84)[0-9]{9}$/;
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
```

---

## 🔌 API dự kiến

### Auth

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Products

```txt
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categories

```txt
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Orders

```txt
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/orders/my-orders
PUT    /api/orders/:id/status
```

### Reviews

```txt
GET    /api/products/:productId/reviews
POST   /api/products/:productId/reviews
DELETE /api/reviews/:id
```

### Favorites

```txt
GET    /api/favorites
POST   /api/favorites/:productId
DELETE /api/favorites/:productId
```

### Compare

```txt
POST   /api/compare
GET    /api/compare/:id
DELETE /api/compare/:id
```

---

## 🗄️ Database chính

Database sử dụng SQL Server. Các bảng chính:

```txt
Users
UserAddresses
Categories
Styles
Rooms
Products
ProductImages
FavoriteProducts
ProductReviews
Carts
CartItems
Coupons
Orders
OrderItems
Payments
Collections
CollectionProducts
BannerAds
ShowroomAppointments
ContactMessages
ProductComparisons
ComparisonItems
DesignProjects
DesignProjectItems
ProductBundles
ProductBundleItems
```

---

## 🎨 Quy tắc giao diện

Màu sắc phù hợp với website nội thất:

```txt
Trắng:        #FFFFFF
Be nhạt:      #F5EFE6
Nâu gỗ:       #8B5E3C
Nâu đậm:      #4B2E1F
Xám nhạt:     #F4F4F4
Đen chữ:      #1F1F1F
```

Phong cách giao diện:

- Hiện đại
- Tối giản
- Sang trọng
- Dễ thao tác
- Nhiều khoảng trắng
- Ảnh sản phẩm lớn, rõ nét
- Card sản phẩm đồng đều
- Nút mua hàng nổi bật
- Navbar rõ ràng
- Footer đầy đủ thông tin cửa hàng

---

## 🎯 Nguyên tắc Clean Code

### 1. Component Design

- Mỗi component chỉ làm một nhiệm vụ.
- Component dùng chung không chứa logic nghiệp vụ phức tạp.
- Feature component được phép gắn với nghiệp vụ cụ thể.
- Logic gọi API nên tách ra custom hook.
- Không viết toàn bộ xử lý trong một page.

Ví dụ:

```txt
Đúng:
ProductListPage → ProductFilter + ProductList → ProductCard

Không nên:
ProductListPage chứa tất cả filter, map sản phẩm, gọi API, xử lý giỏ hàng
```

### 2. State Management

- Local state dùng cho trạng thái nhỏ trong component.
- Context dùng cho trạng thái toàn cục như auth và cart.
- Custom hook dùng cho logic gọi API, loading, error.
- Tránh truyền props quá sâu qua nhiều tầng.

### 3. Performance

- Dùng React.memo cho component nặng như bảng đơn hàng.
- Dùng useCallback cho function truyền xuống component con.
- Dùng useMemo cho giá trị tính toán như tổng tiền giỏ hàng.
- Lazy loading cho trang admin và trang chi tiết sản phẩm.

### 4. Import Order

```javascript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { Link } from 'react-router-dom';

// 3. Internal absolute imports
import Button from '@/components/Button';

// 4. Internal relative imports
import { useProducts } from '../hooks/useProducts';
import './ProductListPage.css';
```

### 5. Error Handling

```javascript
try {
  const response = await productApi.getAll();

  if (response.success) {
    setProducts(response.data);
  } else {
    setError(response.message);
  }
} catch (error) {
  console.error('Error:', error);
  setError('Có lỗi xảy ra, vui lòng thử lại');
}
```

---

## 🚀 Cách thêm feature mới

Ví dụ thêm feature **Favorite**:

### 1. Tạo folder feature

```txt
client/src/features/Favorite/
```

### 2. Tạo component

```txt
client/src/features/Favorite/FavoriteList.jsx
client/src/features/Favorite/FavoriteButton.jsx
```

### 3. Tạo custom hook

```txt
client/src/hooks/useFavorites.js
```

### 4. Tạo API service

```txt
client/src/apis/favorite.api.js
```

### 5. Tạo page

```txt
client/src/pages/FavoritePage.jsx
```

### 6. Thêm route vào `App.jsx`

```jsx
<Route path="/favorites" element={<FavoritePage />} />
```

### 7. Test chức năng

```txt
- Thêm sản phẩm yêu thích
- Xóa sản phẩm yêu thích
- Hiển thị danh sách sản phẩm yêu thích
```

---

## ✅ Checklist khi code

- [ ] File đặt tên đúng convention
- [ ] Component nhỏ, tập trung, dễ test
- [ ] Logic gọi API đã tách ra hooks
- [ ] API service không xử lý UI
- [ ] Có loading state
- [ ] Có error handling
- [ ] Có validate form
- [ ] Giỏ hàng lưu được vào localStorage
- [ ] Token đăng nhập lưu bằng helper
- [ ] Trang responsive cho mobile
- [ ] Admin route có kiểm tra quyền
- [ ] Không để console.log trong production
- [ ] Không hard-code API URL trong nhiều file
- [ ] Code dễ đọc, dễ bảo trì
- [ ] Tên biến rõ nghĩa
- [ ] Có xử lý trường hợp không có dữ liệu
- [ ] Có thông báo khi đặt hàng thành công hoặc thất bại
- [ ] Có kiểm tra tồn kho trước khi đặt hàng
- [ ] Có tối ưu performance khi danh sách sản phẩm lớn

---

## 📌 Gợi ý thứ tự làm project

```txt
Bước 1: Tạo database SQL Server
Bước 2: Chạy file furniture_shop_sqlserver.sql
Bước 3: Tạo backend Express
Bước 4: Kết nối backend với SQL Server
Bước 5: Làm API Auth
Bước 6: Làm API Product và Category
Bước 7: Làm giao diện React
Bước 8: Làm giỏ hàng bằng Context + localStorage
Bước 9: Làm đặt hàng
Bước 10: Làm trang admin
Bước 11: Làm đánh giá, yêu thích, so sánh sản phẩm
Bước 12: Test toàn bộ hệ thống
```

---

## ▶️ Cách chạy project

### Chạy Backend

```bash
cd server
npm install
npm run dev
```

### Chạy Frontend

Mở terminal mới:

```bash
cd client
npm install
npm run dev
```

### Đường dẫn mặc định

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5000
API:      http://localhost:5000/api
```

---

## 👤 Phân quyền người dùng

```txt
ADMIN:
- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý khách hàng
- Quản lý đánh giá
- Xem thống kê doanh thu

STAFF:
- Xử lý đơn hàng
- Hỗ trợ khách hàng
- Quản lý lịch hẹn showroom

CUSTOMER:
- Xem sản phẩm
- Thêm giỏ hàng
- Đặt hàng
- Đánh giá sản phẩm
- Lưu yêu thích
- So sánh sản phẩm
```

---

## 📌 Ghi chú

- Không nên làm thanh toán online ngay từ đầu.
- Nên làm thanh toán COD trước để hệ thống chạy ổn.
- Sau khi hoàn thành chức năng cơ bản, có thể tích hợp VNPay, MoMo hoặc ZaloPay.
- Ảnh sản phẩm có thể lưu local bằng `multer`, sau đó nâng cấp lên Cloudinary.
- Admin nên được tạo trực tiếp trong database hoặc qua seed data.
