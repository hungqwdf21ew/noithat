exports.getAll = async (req, res) => {
  res.json({ success: true, message: 'Product list endpoint' });
};

exports.getById = async (req, res) => {
  res.json({ success: true, message: 'Get product by id', data: { id: req.params.id } });
};
