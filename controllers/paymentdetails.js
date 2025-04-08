const PaymentDetails = require('../schemas/PaymentDetails');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Tạo PaymentDetails mới
exports.create = async (req, res) => {
  try {
    const { paymentMethodId, bookingId } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    const paymentDetails = new PaymentDetails({
      paymentMethodId,
      bookingId,
      status: "pending",  // Giả sử mặc định status là "pending"
      user: username,
    });

    const savedPayment = await paymentDetails.save();
    res.status(201).json({ success: true, data: savedPayment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật trạng thái PaymentDetails
exports.updatePaymentDetailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPayment = await PaymentDetails.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: 'PaymentDetail not found' });
    }

    res.status(200).json({ success: true, data: updatedPayment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy PaymentDetails theo ID
exports.getById = async (req, res) => {
  try {
    const payment = await PaymentDetails.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả PaymentDetails
exports.getAll = async (req, res) => {
  try {
    const payments = await PaymentDetails.find().populate('paymentMethod').populate('booking');
    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
