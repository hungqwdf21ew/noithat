exports.getCompare = async (req, res) => {
  res.json({ success: true, message: 'Compare detail endpoint' });
};

exports.deleteCompare = async (req, res) => {
  res.json({ success: true, message: 'Delete compare item endpoint', id: req.params.id });
};
