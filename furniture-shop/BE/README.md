# Backend - Furniture Shop Coding Standards & Project Structure

## 📋 Tổng quan

Dự án Backend của **Furniture Shop** sử dụng kiến trúc **Layered Architecture** với **Node.js**, **Express** và **SQL Server**.

Backend chịu trách nhiệm xử lý API cho website thương mại điện tử bán hàng nội thất, bao gồm:

- Đăng ký, đăng nhập, xác thực người dùng
- Phân quyền khách hàng, nhân viên, quản trị viên
- Quản lý sản phẩm nội thất
- Quản lý danh mục sản phẩm
- Quản lý phong cách nội thất
- Quản lý giỏ hàng
- Quản lý đơn hàng
- Quản lý đánh giá sản phẩm
- Quản lý sản phẩm yêu thích
- Quản lý so sánh sản phẩm
- Quản lý phối nội thất trong không gian cá nhân
- Quản lý bộ sản phẩm kết hợp
- Quản lý lịch hẹn showroom
- Quản lý liên hệ khách hàng

Dự án tuân theo nguyên tắc **Clean Code**, **Separation of Concerns** và chia tầng rõ ràng để dễ bảo trì, mở rộng và kiểm thử.

---

## 🏗️ Cấu trúc dự án

```txt
BE/
├── src/
│   ├── configs/         # Cấu hình database, env, constants
│   ├── models/          # Database models & queries
│   ├── validators/      # Request validation schemas
│   ├── middlewares/     # Express middlewares
│   ├── services/        # Business logic layer
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes definition
│   ├── helpers/         # Helper functions có side effects
│   ├── utils/           # Pure utility functions
│   └── server.js        # Entry point
├── database.sql         # Database schema SQL Server
├── .env                 # Biến môi trường
├── .env.example         # File env mẫu
└── package.json
```

Cấu trúc gợi ý chi tiết:

```txt
BE/
├── src/
│   ├── configs/
│   │   ├── database.config.js
│   │   ├── jwt.config.js
│   │   └── constants.config.js
│   │
│   ├── models/
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── category.model.js
│   │   ├── style.model.js
│   │   ├── room.model.js
│   │   ├── product.model.js
│   │   ├── productImage.model.js
│   │   ├── cart.model.js
│   │   ├── cartItem.model.js
│   │   ├── order.model.js
│   │   ├── orderItem.model.js
│   │   ├── review.model.js
│   │   ├── favorite.model.js
│   │   ├── compare.model.js
│   │   ├── designProject.model.js
│   │   └── showroomAppointment.model.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   ├── category.validator.js
│   │   ├── order.validator.js
│   │   ├── review.validator.js
│   │   └── appointment.validator.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   ├── validation.middleware.js
│   │   └── errorHandler.middleware.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   ├── review.service.js
│   │   ├── favorite.service.js
│   │   ├── compare.service.js
│   │   ├── designProject.service.js
│   │   └── dashboard.service.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── favorite.controller.js
│   │   ├── compare.controller.js
│   │   ├── designProject.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.route.js
│   │   ├── product.route.js
│   │   ├── category.route.js
│   │   ├── cart.route.js
│   │   ├── order.route.js
│   │   ├── review.route.js
│   │   ├── favorite.route.js
│   │   ├── compare.route.js
│   │   ├── designProject.route.js
│   │   └── dashboard.route.js
│   │
│   ├── helpers/
│   │   ├── upload.helper.js
│   │   ├── mail.helper.js
│   │   └── pagination.helper.js
│   │
│   ├── utils/
│   │   ├── response.util.js
│   │   ├── slug.util.js
│   │   ├── date.util.js
│   │   ├── price.util.js
│   │   └── token.util.js
│   │
│   └── server.js
│
├── database.sql
├── .env
├── .env.example
└── package.json
```

---

## 🔄 Luồng xử lý request

```txt
Request → Routes → Middlewares → Validators → Controllers → Services → Models → Database
                                                    ↓
Response ← Controllers ← Services ← Models ← Database
```

Ví dụ luồng đặt hàng:

```txt
Khách hàng gửi POST /api/orders
→ order.route.js
→ auth.middleware.js
→ order.validator.js
→ order.controller.js
→ order.service.js
→ order.model.js và orderItem.model.js
→ SQL Server
→ Trả response đặt hàng thành công
```

### Chi tiết từng tầng

1. **Routes** (`src/routes/`)
   - Định nghĩa endpoint API.
   - Gắn middleware, validator và controller tương ứng.
   - Không chứa logic xử lý nghiệp vụ.

2. **Middlewares** (`src/middlewares/`)
   - Xác thực JWT.
   - Phân quyền ADMIN, STAFF, CUSTOMER.
   - Xử lý upload ảnh sản phẩm.
   - Xử lý lỗi tập trung.
   - Kiểm tra validation result.

3. **Validators** (`src/validators/`)
   - Validate input data bằng `express-validator`.
   - Kiểm tra dữ liệu bắt buộc.
   - Kiểm tra định dạng email, số điện thoại, giá, số lượng.
   - Trả lỗi validation rõ ràng.

4. **Controllers** (`src/controllers/`)
   - Nhận request từ routes.
   - Lấy dữ liệu từ `req.params`, `req.query`, `req.body`.
   - Gọi services để xử lý logic.
   - Format response trả về client.
   - Không viết business logic phức tạp trong controller.

5. **Services** (`src/services/`)
   - Chứa toàn bộ business logic.
   - Kiểm tra sản phẩm tồn tại.
   - Kiểm tra tồn kho.
   - Tính tổng tiền đơn hàng.
   - Xử lý tạo đơn hàng và chi tiết đơn hàng.
   - Xử lý transaction khi đặt hàng.
   - Gọi models để tương tác database.

6. **Models** (`src/models/`)
   - Định nghĩa model Sequelize tương ứng với bảng SQL Server.
   - Định nghĩa relationship giữa các bảng.
   - Thực hiện CRUD với database.
   - Không chứa business logic.

7. **Helpers** (`src/helpers/`)
   - Chứa các hàm hỗ trợ có thể có side effects.
   - Ví dụ: upload file, gửi email, xử lý phân trang.

8. **Utils** (`src/utils/`)
   - Chứa pure functions.
   - Không thao tác database, file, localStorage hoặc request.
   - Ví dụ: format tiền, tạo slug, format ngày.

9. **Configs** (`src/configs/`)
   - Cấu hình database.
   - Cấu hình JWT.
   - Cấu hình biến môi trường.
   - Chứa constants và enums dùng chung.

---

## 📝 Quy tắc đặt tên file

### 1. Routes

```txt
<entity>.route.js
```

Ví dụ:

```txt
auth.route.js
product.route.js
category.route.js
cart.route.js
order.route.js
review.route.js
favorite.route.js
compare.route.js
dashboard.route.js
```

### 2. Controllers

```txt
<entity>.controller.js
```

Ví dụ:

```txt
auth.controller.js
product.controller.js
category.controller.js
cart.controller.js
order.controller.js
review.controller.js
favorite.controller.js
compare.controller.js
dashboard.controller.js
```

### 3. Services

```txt
<entity>.service.js
```

Ví dụ:

```txt
auth.service.js
product.service.js
category.service.js
cart.service.js
order.service.js
review.service.js
favorite.service.js
compare.service.js
dashboard.service.js
```

### 4. Models

```txt
<entity>.model.js
```

Ví dụ:

```txt
user.model.js
product.model.js
category.model.js
style.model.js
room.model.js
cart.model.js
cartItem.model.js
order.model.js
orderItem.model.js
review.model.js
favorite.model.js
```

### 5. Validators

```txt
<entity>.validator.js
```

Ví dụ:

```txt
auth.validator.js
product.validator.js
category.validator.js
order.validator.js
review.validator.js
appointment.validator.js
```

### 6. Middlewares

```txt
<purpose>.middleware.js
```

Ví dụ:

```txt
auth.middleware.js
role.middleware.js
upload.middleware.js
validation.middleware.js
errorHandler.middleware.js
```

### 7. Helpers

```txt
<purpose>.helper.js
```

Ví dụ:

```txt
upload.helper.js
mail.helper.js
pagination.helper.js
```

### 8. Utils

```txt
<purpose>.util.js
```

Ví dụ:

```txt
response.util.js
slug.util.js
date.util.js
price.util.js
token.util.js
```

### 9. Configs

```txt
<purpose>.config.js
```

Ví dụ:

```txt
database.config.js
jwt.config.js
constants.config.js
```

---

## 💻 Quy tắc viết code

### 1. Routes

File: `src/routes/product.route.js`

```javascript
const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const productValidator = require('../validators/product.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// GET all products
router.get('/', productController.getAllProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// POST create product - ADMIN only
router.post(
  '/',
  authMiddleware.verifyToken,
  roleMiddleware.checkRole('ADMIN'),
  uploadMiddleware.single('image'),
  productValidator.createProduct,
  productController.createProduct
);

// PUT update product - ADMIN only
router.put(
  '/:id',
  authMiddleware.verifyToken,
  roleMiddleware.checkRole('ADMIN'),
  uploadMiddleware.single('image'),
  productValidator.updateProduct,
  productController.updateProduct
);

// DELETE product - ADMIN only
router.delete(
  '/:id',
  authMiddleware.verifyToken,
  roleMiddleware.checkRole('ADMIN'),
  productController.deleteProduct
);

module.exports = router;
```

---

### 2. Controllers

File: `src/controllers/product.controller.js`

```javascript
const { validationResult } = require('express-validator');
const productService = require('../services/product.service');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        categoryId,
        styleId,
        minPrice,
        maxPrice,
        sort = 'newest'
      } = req.query;

      const result = await productService.getAllProducts({
        page,
        limit,
        search,
        categoryId,
        styleId,
        minPrice,
        maxPrice,
        sort
      });

      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách sản phẩm thành công',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy chi tiết sản phẩm thành công',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const productData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      };

      const newProduct = await productService.createProduct(productData);

      return res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm thành công',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: errors.array()
        });
      }

      const { id } = req.params;

      const productData = {
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl
      };

      const updatedProduct = await productService.updateProduct(id, productData);

      return res.status(200).json({
        success: true,
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
```

---

### 3. Services

File: `src/services/order.service.js`

```javascript
const { sequelize, Order, OrderItem, Product, Cart, CartItem } = require('../models');

class OrderService {
  async createOrder(userId, orderData) {
    const transaction = await sequelize.transaction();

    try {
      const {
        customerName,
        phone,
        address,
        note,
        paymentMethod = 'COD',
        items
      } = orderData;

      if (!items || items.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
      }

      let totalAmount = 0;

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          throw new Error(`Sản phẩm có ID ${item.productId} không tồn tại`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm ${product.name} không đủ tồn kho`);
        }

        totalAmount += Number(product.price) * Number(item.quantity);
      }

      const order = await Order.create(
        {
          userId,
          customerName,
          phone,
          address,
          note,
          totalAmount,
          status: 'PENDING',
          paymentMethod
        },
        { transaction }
      );

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });

        await OrderItem.create(
          {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price
          },
          { transaction }
        );

        await product.update(
          {
            stock: product.stock - item.quantity
          },
          { transaction }
        );
      }

      if (userId) {
        const cart = await Cart.findOne({ where: { userId }, transaction });

        if (cart) {
          await CartItem.destroy({
            where: { cartId: cart.id },
            transaction
          });
        }
      }

      await transaction.commit();

      return await this.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getOrderById(id) {
    return await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl']
            }
          ]
        }
      ]
    });
  }
}

module.exports = new OrderService();
```

---

### 4. Models

File: `src/models/product.model.js`

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database.config');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    styleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Styles',
        key: 'id'
      }
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Rooms',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  },
  {
    tableName: 'Products',
    timestamps: true
  }
);

module.exports = Product;
```

---

### 5. Relationships

File: `src/models/index.js`

```javascript
const { sequelize } = require('../configs/database.config');

const User = require('./user.model');
const Category = require('./category.model');
const Style = require('./style.model');
const Room = require('./room.model');
const Product = require('./product.model');
const ProductImage = require('./productImage.model');
const Cart = require('./cart.model');
const CartItem = require('./cartItem.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const Review = require('./review.model');
const Favorite = require('./favorite.model');

// User - Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Category - Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Style - Product
Style.hasMany(Product, { foreignKey: 'styleId', as: 'products' });
Product.belongsTo(Style, { foreignKey: 'styleId', as: 'style' });

// Room - Product
Room.hasMany(Product, { foreignKey: 'roomId', as: 'products' });
Product.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Product - ProductImage
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Product - CartItem
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product - Review
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - Favorite
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product - Favorite
Product.hasMany(Favorite, { foreignKey: 'productId', as: 'favorites' });
Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Category,
  Style,
  Room,
  Product,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Review,
  Favorite
};
```

---

### 6. Validators

File: `src/validators/product.validator.js`

```javascript
const { body } = require('express-validator');

const createProduct = [
  body('categoryId')
    .notEmpty()
    .withMessage('Danh mục không được để trống')
    .isInt({ min: 1 })
    .withMessage('Danh mục không hợp lệ'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên sản phẩm không được để trống')
    .isLength({ min: 2, max: 255 })
    .withMessage('Tên sản phẩm phải từ 2 đến 255 ký tự'),

  body('price')
    .notEmpty()
    .withMessage('Giá sản phẩm không được để trống')
    .isFloat({ min: 0 })
    .withMessage('Giá sản phẩm phải lớn hơn hoặc bằng 0'),

  body('stock')
    .notEmpty()
    .withMessage('Số lượng tồn kho không được để trống')
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải lớn hơn hoặc bằng 0'),

  body('material')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Chất liệu tối đa 100 ký tự'),

  body('color')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Màu sắc tối đa 100 ký tự')
];

const updateProduct = [
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Danh mục không hợp lệ'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Tên sản phẩm phải từ 2 đến 255 ký tự'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá sản phẩm phải lớn hơn hoặc bằng 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải lớn hơn hoặc bằng 0')
];

module.exports = {
  createProduct,
  updateProduct
};
```

---

### 7. Middlewares

File: `src/middlewares/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/constants.config');

class AuthMiddleware {
  verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token không được cung cấp'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  }
}

module.exports = new AuthMiddleware();
```

File: `src/middlewares/role.middleware.js`

```javascript
class RoleMiddleware {
  checkRole(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Chưa xác thực'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      next();
    };
  }
}

module.exports = new RoleMiddleware();
```

---

### 8. Configs

File: `src/configs/database.config.js`

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQL Server connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Models synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};
```

File: `src/configs/constants.config.js`

```javascript
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'furniture_shop_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER'
};

const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

const PAYMENT_METHOD = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY'
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_METHOD
};
```

---

## 🎯 Nguyên tắc Clean Code

### 1. Tách biệt rõ ràng các tầng

- Routes chỉ định nghĩa endpoint.
- Controllers chỉ xử lý request và response.
- Services chứa business logic.
- Models chỉ tương tác database.
- Validators chỉ kiểm tra dữ liệu đầu vào.

### 2. Single Responsibility Principle

- Mỗi function chỉ làm một việc.
- Mỗi class chỉ có một lý do để thay đổi.
- Không gộp quá nhiều logic vào một file.

### 3. Error Handling

- Luôn sử dụng `try-catch` trong controller và service.
- Throw error với message rõ ràng.
- Sử dụng error middleware để xử lý lỗi tập trung.
- Không trả lỗi kỹ thuật thô trực tiếp cho người dùng cuối.

### 4. Async/Await

- Luôn sử dụng `async/await`.
- Hạn chế dùng `.then().catch()` để code dễ đọc hơn.
- Không dùng callback lồng nhau.

### 5. Naming Convention

- camelCase cho biến và function: `getProductById`, `orderData`.
- PascalCase cho class: `ProductController`, `OrderService`.
- UPPER_CASE cho constants: `JWT_SECRET`, `ORDER_STATUS`.
- Tên file lowercase với dấu chấm: `product.controller.js`.

### 6. Response Format

Luôn trả về format nhất quán:

```javascript
// Success
{
  success: true,
  message: 'Thông báo thành công',
  data: { ... }
}

// Error
{
  success: false,
  message: 'Thông báo lỗi',
  errors: [ ... ]
}
```

### 7. Status Codes

```txt
200: OK - GET, PUT, DELETE thành công
201: Created - POST thành công
400: Bad Request - Dữ liệu không hợp lệ
401: Unauthorized - Chưa đăng nhập
403: Forbidden - Không có quyền
404: Not Found - Không tìm thấy dữ liệu
500: Internal Server Error - Lỗi server
```

---

## 📦 Dependencies chính

- **express**: Web framework cho Node.js.
- **sequelize**: ORM thao tác với database.
- **tedious**: SQL Server driver cho Sequelize.
- **express-validator**: Validate dữ liệu request.
- **jsonwebtoken**: Tạo và xác thực JWT.
- **bcryptjs**: Mã hóa mật khẩu.
- **dotenv**: Quản lý biến môi trường.
- **cors**: Cho phép Frontend gọi API.
- **multer**: Upload ảnh sản phẩm.
- **nodemon**: Tự động restart server khi code thay đổi.

Cài đặt:

```bash
npm install express sequelize tedious express-validator jsonwebtoken bcryptjs dotenv cors multer
npm install -D nodemon
```

---

## 🔧 Setup Database với SQL Server và Sequelize

### 1. Tạo file `.env`

```env
NODE_ENV=development
PORT=5000

DB_SERVER=localhost
DB_DATABASE=FurnitureShopDB
DB_USER=sa
DB_PASSWORD=your_password
DB_PORT=1433

JWT_SECRET=furniture_shop_secret_key
JWT_EXPIRE=7d
```

### 2. Chạy file database

Mở SQL Server Management Studio và chạy file:

```txt
database.sql
```

Hoặc dùng terminal:

```bash
sqlcmd -S localhost -U sa -P your_password -i database.sql
```

### 3. Khởi tạo server

File: `src/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./configs/database.config');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Furniture Shop API is running'
  });
});

app.use('/api', require('./routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

---

## 🔌 API chính

### Auth

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
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
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Cart

```txt
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
```

### Orders

```txt
POST   /api/orders
GET    /api/orders
GET    /api/orders/my-orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
DELETE /api/orders/:id
```

### Reviews

```txt
GET    /api/products/:productId/reviews
POST   /api/products/:productId/reviews
PUT    /api/reviews/:id
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

### Design Project

```txt
POST   /api/design-projects
GET    /api/design-projects
GET    /api/design-projects/:id
DELETE /api/design-projects/:id
```

### Dashboard

```txt
GET    /api/dashboard/summary
GET    /api/dashboard/revenue
GET    /api/dashboard/top-products
```

---

## 📚 Sequelize Query Examples

### Basic Queries

```javascript
const products = await Product.findAll();

const product = await Product.findByPk(id);

const user = await User.findOne({
  where: { email: 'customer@gmail.com' }
});

const newProduct = await Product.create({
  name: 'Ghế sofa phòng khách',
  slug: 'ghe-sofa-phong-khach',
  price: 3500000,
  stock: 20,
  categoryId: 1
});

await product.update({
  price: 3200000,
  stock: 15
});

await product.destroy();
```

### Query với điều kiện tìm kiếm

```javascript
const { Op } = require('sequelize');

const products = await Product.findAll({
  where: {
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
      { material: { [Op.like]: `%${search}%` } },
      { color: { [Op.like]: `%${search}%` } }
    ],
    status: 'ACTIVE'
  },
  order: [['createdAt', 'DESC']],
  limit: 12,
  offset: 0
});
```

### Query kèm relationship

```javascript
const product = await Product.findByPk(id, {
  include: [
    { model: Category, as: 'category' },
    { model: Style, as: 'style' },
    { model: Room, as: 'room' },
    { model: ProductImage, as: 'images' },
    { model: Review, as: 'reviews' }
  ]
});
```

### Transaction khi đặt hàng

```javascript
const { sequelize } = require('../models');

const transaction = await sequelize.transaction();

try {
  const order = await Order.create(orderData, { transaction });

  for (const item of items) {
    await OrderItem.create(
      {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      },
      { transaction }
    );

    const product = await Product.findByPk(item.productId, { transaction });

    await product.update(
      {
        stock: product.stock - item.quantity
      },
      { transaction }
    );
  }

  await transaction.commit();
  return order;
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

---

## 🚀 Cách thêm feature mới

Ví dụ thêm feature **Coupon**:

1. Tạo model:

```txt
src/models/coupon.model.js
```

2. Thêm relationships nếu cần vào:

```txt
src/models/index.js
```

3. Tạo service:

```txt
src/services/coupon.service.js
```

4. Tạo validator:

```txt
src/validators/coupon.validator.js
```

5. Tạo controller:

```txt
src/controllers/coupon.controller.js
```

6. Tạo route:

```txt
src/routes/coupon.route.js
```

7. Import route vào:

```txt
src/routes/index.js
```

8. Test API bằng Postman hoặc Thunder Client.

---

## ✅ Checklist khi code

- [ ] File đặt tên đúng convention
- [ ] Code đúng tầng, không viết business logic trong controller
- [ ] Có validation cho input
- [ ] Có error handling bằng try-catch
- [ ] Có error middleware xử lý lỗi tập trung
- [ ] Response format nhất quán
- [ ] Status code chính xác
- [ ] Sử dụng async/await
- [ ] Code clean, dễ đọc
- [ ] Có comment khi cần thiết
- [ ] Không hard-code giá trị quan trọng
- [ ] Sử dụng constants cho role, status, payment method
- [ ] Có kiểm tra quyền ADMIN với route quản trị
- [ ] Có kiểm tra tồn kho khi đặt hàng
- [ ] Có transaction khi tạo đơn hàng
- [ ] Không trả password trong response
- [ ] Mật khẩu được mã hóa bằng bcryptjs
- [ ] SQL injection safe thông qua ORM hoặc parameterized queries
- [ ] Không để console.log không cần thiết trong production
- [ ] Test API bằng Postman hoặc Thunder Client

---

## ▶️ Cách chạy project Backend

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo file `.env`

Dựa vào file `.env.example`, tạo `.env` và sửa thông tin database.

### 3. Tạo database

Chạy file `database.sql` trong SQL Server Management Studio.

### 4. Chạy server development

```bash
npm run dev
```

### 5. Chạy server production

```bash
npm start
```

Server mặc định chạy tại:

```txt
http://localhost:5000
```

API chính:

```txt
http://localhost:5000/api
```

---

## 👤 Phân quyền hệ thống

### ADMIN

- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý phong cách nội thất
- Quản lý đơn hàng
- Quản lý khách hàng
- Quản lý đánh giá
- Quản lý mã giảm giá
- Xem thống kê doanh thu

### STAFF

- Xử lý đơn hàng
- Cập nhật trạng thái đơn hàng
- Hỗ trợ khách hàng
- Quản lý lịch hẹn showroom

### CUSTOMER

- Xem sản phẩm
- Tìm kiếm và lọc sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng
- Theo dõi đơn hàng
- Đánh giá sản phẩm
- Lưu sản phẩm yêu thích
- So sánh sản phẩm
- Phối nội thất trong không gian cá nhân
