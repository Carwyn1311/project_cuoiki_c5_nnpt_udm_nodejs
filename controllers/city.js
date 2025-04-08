// controllers/city.js
const City = require('../schemas/city');

exports.create = async (req, res) => {
  try {
    const { name, province } = req.body;
    const newCity = new City({ name, province });
    await newCity.save();
    res.status(201).json({ success: true, data: newCity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const cities = await City.find().populate('province').populate('destinations'); // Populating related fields
    res.status(200).json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate('province')
      .populate('destinations');
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });
    res.status(200).json({ success: true, data: city });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedCity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
