const City = require('../schemas/City');

// Tạo mới city
exports.create = async (req, res) => {
  try {
    const { name, province } = req.body;

    // Tạo đối tượng City từ dữ liệu yêu cầu
    const newCity = new City({
      name,
      province,
    });

    const savedCity = await newCity.save();
    res.status(201).json({ success: true, data: savedCity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật city theo ID
exports.update = async (req, res) => {
  try {
    const { name, province } = req.body;

    // Cập nhật city theo ID
    const updatedCity = await City.findByIdAndUpdate(req.params.id, {
      name,
      province,
    }, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.status(200).json({ success: true, message: 'City updated successfully', data: updatedCity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy thông tin city theo ID
exports.getById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });

    res.status(200).json({ success: true, data: city });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả cities
exports.getAll = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa city theo ID
exports.delete = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    
    if (!deletedCity) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.status(200).json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
