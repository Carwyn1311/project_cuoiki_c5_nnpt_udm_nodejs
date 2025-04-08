const User = require('../schemas/User'); // Giả sử bạn có schema cho User
const jwt = require('jsonwebtoken');

// Lấy thông tin người dùng
exports.getUserInfo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tìm người dùng theo username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Lấy tất cả người dùng từ cơ sở dữ liệu
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { username } = req.params; // Tên người dùng muốn cập nhật
    const { email, password } = req.body;

    const updatedUser = await User.findOneAndUpdate({ username }, { email, password }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật vai trò người dùng
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roles } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.roles = roles; // Cập nhật vai trò cho người dùng
    await user.save();

    res.status(200).json({ success: true, message: 'User roles updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
