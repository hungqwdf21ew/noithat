exports.getByProduct = async (req, res) => {
  res.json({ success: true, message: 'Reviews for product', productId: req.params.productId });
};
