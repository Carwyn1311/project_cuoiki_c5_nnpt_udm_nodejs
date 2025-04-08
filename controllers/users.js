// controllers/user.js
const userModel = require('../schemas/user');

exports.getAll = async (req, res, next) => {
  try {
    const items = await userModel.find();
    res.status(200).json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await userModel.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newItem = await userModel.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updatedItem = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) { next(err); }
};
