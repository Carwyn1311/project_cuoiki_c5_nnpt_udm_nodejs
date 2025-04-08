// controllers/destinationImages.js
const DestinationImages = require('../schemas/destinationimages');

exports.create = async (req, res) => {
  try {
    const { image_url, destination } = req.body;
    const newImage = new DestinationImages({ image_url, destination });
    await newImage.save();
    res.status(201).json({ success: true, data: newImage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const images = await DestinationImages.find();
    res.status(200).json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const image = await DestinationImages.findById(req.params.id).populate('destination');
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.status(200).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedImage = await DestinationImages.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedImage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await DestinationImages.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
