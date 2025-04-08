const Province = require('../schemas/Province');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Tạo mới Province
exports.create = async (req, res) => {
  try {
    const { name, country } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tạo đối tượng Province từ dữ liệu yêu cầu
    const newProvince = new Province({
      name,
      country,
      createdBy: username, // Assuming you are storing the creator's user id
    });

    const savedProvince = await newProvince.save();
    res.status(201).json({ success: true, data: savedProvince });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật Province theo ID
exports.update = async (req, res) => {
  try {
    const { name, country } = req.body;

    // Cập nhật Province theo ID
    const updatedProvince = await Province.findByIdAndUpdate(req.params.id, {
      name,
      country,
    }, { new: true });

    if (!updatedProvince) {
      return res.status(404).json({ success: false, message: 'Province not found' });
    }

    res.status(200).json({ success: true, message: 'Province updated successfully', data: updatedProvince });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy Province theo ID
exports.getById = async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) return res.status(404).json({ success: false, message: 'Province not found' });
    res.status(200).json({ success: true, data: province });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả Provinces
exports.getAll = async (req, res) => {
  try {
    const provinces = await Province.find();
    res.status(200).json({ success: true, data: provinces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa Province theo ID
exports.remove = async (req, res) => {
  try {
    const province = await Province.findByIdAndDelete(req.params.id);
    if (!province) return res.status(404).json({ success: false, message: 'Province not found' });
    res.status(200).json({ success: true, message: 'Province deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
