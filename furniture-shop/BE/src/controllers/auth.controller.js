const authService = require('../services/auth.service');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    const status = result.success ? 201 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[register]', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ, vui lòng thử lại sau.',
    });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    const status = result.success ? 200 : 401;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[login]', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ, vui lòng thử lại sau.',
    });
  }
};

// GET /api/auth/me  (cần token)
exports.me = async (req, res) => {
  try {
    // req.user được gán bởi authMiddleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    }
    const result = await authService.getMe(req.user.id);
    return res.json(result);
  } catch (error) {
    console.error('[me]', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ, vui lòng thử lại sau.',
    });
  }
};

// PUT /api/auth/profile  (cần token)
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    }
    const result = await authService.updateProfile(req.user.id, req.body);
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[updateProfile]', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ, vui lòng thử lại sau.',
    });
  }
};
