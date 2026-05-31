const userService = require('../services/user.service');

exports.getAll = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    return res.json(result);
  } catch (error) {
    console.error('[getAllUsers]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    const status = result.success ? 201 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[createUser]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUser(Number(id), req.body);
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[updateUser]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const result = await userService.resetPassword(Number(id), newPassword);
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[resetPassword]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(Number(id));
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[deleteUser]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
