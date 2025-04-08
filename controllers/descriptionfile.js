const DescriptionFile = require('../schemas/descriptionfile');

exports.create = async (req, res) => {
  try {
    const { fileName, filePath, destination } = req.body;
    const newDescriptionFile = new DescriptionFile({ fileName, filePath, destination });
    await newDescriptionFile.save();
    res.status(201).json({ success: true, data: newDescriptionFile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const descriptionFiles = await DescriptionFile.find().populate('destination'); // Populating related Destination
    res.status(200).json({ success: true, data: descriptionFiles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const descriptionFile = await DescriptionFile.findById(req.params.id).populate('destination');
    if (!descriptionFile) return res.status(404).json({ success: false, message: 'DescriptionFile not found' });
    res.status(200).json({ success: true, data: descriptionFile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedDescriptionFile = await DescriptionFile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedDescriptionFile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await DescriptionFile.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'DescriptionFile deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};