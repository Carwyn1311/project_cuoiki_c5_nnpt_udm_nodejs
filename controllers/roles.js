const Role = require('../schemas/role');

// Lấy tất cả roles
exports.getAll = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy role theo ID
exports.getById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tạo role mới
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRole = await Role.create({ name, description });
    res.status(201).json({ success: true, data: newRole });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật role
exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa role
exports.delete = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};