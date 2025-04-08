const Reviews = require('../schemas/Reviews');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Tạo mới Review
exports.create = async (req, res) => {
  try {
    const { rating, comment, destinationId } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin người dùng
    const username = decoded.id;

    const newReview = new Reviews({
      rating,
      comment,
      destinationId,
      user: username
    });

    const savedReview = await newReview.save();
    res.status(200).json({ success: true, data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error creating review: ${error.message}` });
  }
};

// Lấy tất cả reviews cho một destination
exports.getAll = async (req, res) => {
  try {
    const destinationId = req.params.id;
    const reviews = await Reviews.find({ destinationId }).populate('user');  // Giả sử có mối quan hệ với user
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy review theo ID
exports.getById = async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật review
exports.update = async (req, res) => {
  try {
    const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review updated successfully', data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa review
exports.remove = async (req, res) => {
  try {
    const review = await Reviews.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
