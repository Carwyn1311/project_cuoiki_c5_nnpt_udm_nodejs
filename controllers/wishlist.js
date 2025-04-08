// controllers/wishlist.js
const Wishlist = require('../schemas/wishlist');

exports.create = async (req, res) => {
  try {
    const { user, destination } = req.body;
    const newWishlist = new Wishlist({ user, destination });
    await newWishlist.save();
    res.status(201).json({ success: true, data: newWishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate('user').populate('destination');
    res.status(200).json({ success: true, data: wishlists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id).populate('user').populate('destination');
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    res.status(200).json({ success: true, data: wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedWishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Wishlist deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};