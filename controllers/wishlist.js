const Wishlist = require('../schemas/Wishlist'); // Mẫu schema cho Wishlist

// Tạo Wishlist mới
exports.create = async (req, res) => {
  try {
    const { destinationId } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tạo đối tượng Wishlist từ dữ liệu nhận được
    const newWishlist = new Wishlist({
      user: username,
      destination: destinationId,
    });

    // Lưu wishlist vào cơ sở dữ liệu
    const savedWishlist = await newWishlist.save();
    res.status(200).json({ success: true, data: savedWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả Wishlist của người dùng
exports.getAll = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tìm tất cả Wishlist của người dùng
    const wishlists = await Wishlist.find({ user: username }).populate('destination');
    res.status(200).json({ success: true, data: wishlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Kiểm tra Wishlist theo ID
exports.checkWish = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Kiểm tra xem item này có trong Wishlist của người dùng không
    const isLiked = await Wishlist.exists({ user: username, destination: id });
    res.status(200).json({ liked: isLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa Wishlist theo destinationId
exports.deleteWish = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Xóa Wishlist nếu có trong cơ sở dữ liệu
    const result = await Wishlist.deleteOne({ user: username, destination: destinationId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Wishlist item not found" });
    }

    res.status(200).json({ success: true, message: "Wishlist item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
