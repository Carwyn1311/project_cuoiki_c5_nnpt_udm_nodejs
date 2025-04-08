// controllers/reviews.js
const Reviews = require('../schemas/reviews');

exports.create = async (req, res) => {
  try {
    const { rating, comment, user, destination } = req.body;
    const newReview = new Reviews({ rating, comment, user, destination });
    await newReview.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const reviews = await Reviews.find()
      .populate('user')
      .populate('destination');
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id)
      .populate('user')
      .populate('destination');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Reviews.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
