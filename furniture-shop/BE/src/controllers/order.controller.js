const orderService = require('../services/order.service');

// POST /api/orders  — tạo đơn hàng (khách vãng lai hoặc đã đăng nhập)
exports.create = async (req, res) => {
  try {
    const userId = req.user?.id || null;   // null nếu chưa đăng nhập
    const userEmail = req.user?.email || null;
    const result = await orderService.createOrder(req.body, userId, userEmail);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('[order.create]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const result = await orderService.validateCoupon(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[order.validateCoupon]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ, vui lòng thử lại.' });
  }
};

// GET /api/orders/my  — danh sách đơn hàng của user đã đăng nhập
exports.getMyOrders = async (req, res) => {
  try {
    const result = await orderService.getMyOrders(req.user.id);
    return res.json(result);
  } catch (error) {
    console.error('[order.getMyOrders]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

// GET /api/orders/:id  — chi tiết đơn hàng
exports.getDetail = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const result = await orderService.getOrderDetail(req.params.id, userId);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('[order.getDetail]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

// PATCH /api/orders/:id/cancel  — huỷ đơn hàng
exports.cancel = async (req, res) => {
  try {
    const result = await orderService.cancelOrder(Number(req.params.id), req.user.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[order.cancel]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

// GET /api/orders  — lấy toàn bộ đơn hàng (Admin chỉ định)
exports.getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders();
    return res.json(result);
  } catch (error) {
    console.error('[order.getAllOrders]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

// PATCH /api/orders/:id/status — Cập nhật trạng thái đơn hàng (Admin chỉ định)
exports.updateStatus = async (req, res) => {
  try {
    const result = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[order.updateStatus]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
