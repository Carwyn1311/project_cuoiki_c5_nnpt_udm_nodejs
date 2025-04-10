const PaymentDetails = require('../schemas/PaymentDetails');

// Lấy tất cả payment details
exports.getAll = async (req, res) => {
  try {
    const paymentDetails = await PaymentDetails.find();
    res.status(200).json({ success: true, data: paymentDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy payment detail theo ID
exports.getById = async (req, res) => {
  try {
    const paymentDetail = await PaymentDetails.findById(req.params.id);
    if (!paymentDetail) {
      return res.status(404).json({ success: false, message: 'Payment detail not found' });
    }
    res.status(200).json({ success: true, data: paymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tạo payment detail mới
exports.create = async (req, res) => {
  try {
    const newPaymentDetail = await PaymentDetails.create(req.body);
    res.status(201).json({ success: true, data: newPaymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật payment detail
exports.update = async (req, res) => {
  try {
    const paymentDetail = await PaymentDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paymentDetail) {
      return res.status(404).json({ success: false, message: 'Payment detail not found' });
    }
    res.status(200).json({ success: true, data: paymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa payment detail
exports.deletePaymentDetail = async (req, res) => {
  try {
    const paymentDetail = await PaymentDetails.findByIdAndDelete(req.params.id);
    if (!paymentDetail) {
      return res.status(404).json({ success: false, message: 'Payment detail not found' });
    }
    res.status(200).json({ success: true, message: 'Payment detail deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};