// controllers/province.js
const Province = require('../schemas/province');

exports.create = async (req, res) => {
  try {
    const { name, country } = req.body;
    const newProvince = new Province({ name, country });
    await newProvince.save();
    res.status(201).json({ success: true, data: newProvince });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const provinces = await Province.find().populate('cities');
    res.status(200).json({ success: true, data: provinces });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const province = await Province.findById(req.params.id).populate('cities');
    if (!province) return res.status(404).json({ success: false, message: 'Province not found' });
    res.status(200).json({ success: true, data: province });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedProvince = await Province.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedProvince });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Province.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Province deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};