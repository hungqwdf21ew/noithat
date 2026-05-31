const collectionService = require('../services/collection.service');

exports.getAll = async (req, res) => {
  try {
    const result = await collectionService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.error('[collection.getAll]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await collectionService.getById(req.params.id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('[collection.getById]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await collectionService.create(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('[collection.create]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await collectionService.update(req.params.id, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[collection.update]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await collectionService.delete(req.params.id);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('[collection.delete]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
