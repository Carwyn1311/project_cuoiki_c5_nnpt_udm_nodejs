// controllers/role.js
const roleModel = require('../schemas/role');

exports.getAll = async (req, res, next) => {
  try {
    const items = await roleModel.find();
    res.status(200).json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await roleModel.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newItem = await roleModel.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updatedItem = await roleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await roleModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (err) { next(err); }
};
