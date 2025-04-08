const PaymentMethods = require('../schemas/PaymentMethods');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Tạo mới PaymentMethod
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tạo đối tượng PaymentMethod từ dữ liệu yêu cầu
    const newPaymentMethod = new PaymentMethods({
      name,
      description,
      createdBy: username, // Assuming you are storing the creator's user id
    });

    const savedPaymentMethod = await newPaymentMethod.save();
    res.status(201).json({ success: true, data: savedPaymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật PaymentMethod theo ID
exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Cập nhật PaymentMethod theo ID
    const updatedPaymentMethod = await PaymentMethods.findByIdAndUpdate(req.params.id, {
      name,
      description,
    }, { new: true });

    if (!updatedPaymentMethod) {
      return res.status(404).json({ success: false, message: 'PaymentMethod not found' });
    }

    res.status(200).json({ success: true, message: 'PaymentMethod updated successfully', data: updatedPaymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy PaymentMethod theo ID
exports.getById = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethods.findById(req.params.id);
    if (!paymentMethod) return res.status(404).json({ success: false, message: 'PaymentMethod not found' });
    res.status(200).json({ success: true, data: paymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả PaymentMethods
exports.getAll = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethods.find();
    res.status(200).json({ success: true, data: paymentMethods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa PaymentMethod theo ID
exports.remove = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethods.findByIdAndDelete(req.params.id);
    if (!paymentMethod) return res.status(404).json({ success: false, message: 'PaymentMethod not found' });
    res.status(200).json({ success: true, message: 'PaymentMethod deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
