const productService = require('../services/product.service');

exports.getAll = async (req, res) => {
  try {
    const result = await productService.getAllProducts();
    return res.json(result);
  } catch (error) {
    console.error('[getAllProducts]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductById(Number(id));
    const status = result.success ? 200 : 404;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[getProductById]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    const status = result.success ? 201 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[createProduct]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.updateProduct(Number(id), req.body);
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[updateProduct]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(Number(id));
    const status = result.success ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    console.error('[deleteProduct]', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
