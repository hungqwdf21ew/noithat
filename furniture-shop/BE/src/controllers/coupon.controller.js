const couponService = require('../services/coupon.service');

exports.getAll = async (req, res) => {
  try {
    const result = await couponService.getAll();
    return res.json(result);
  } catch (error) {
    console.error('[coupon.getAll]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await couponService.getById(Number(req.params.id));
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('[coupon.getById]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await couponService.create(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('[coupon.create]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await couponService.update(Number(req.params.id), req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[coupon.update]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await couponService.remove(Number(req.params.id));
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[coupon.remove]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
