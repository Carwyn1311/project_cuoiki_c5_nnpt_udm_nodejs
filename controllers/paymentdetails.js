const PaymentDetails = require('../schemas/paymentdetails');

exports.create = async (req, res) => {
  try {
    const { amount, payment_date, status, invoiceCode, payment_mth, user, booking } = req.body;
    const newPaymentDetail = new PaymentDetails({
      amount, payment_date, status, invoiceCode, payment_mth, user, booking
    });
    await newPaymentDetail.save();
    res.status(201).json({ success: true, data: newPaymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const paymentDetails = await PaymentDetails.find()
      .populate('payment_mth')
      .populate('user')
      .populate('qrCodes')
      .populate('booking');
    res.status(200).json({ success: true, data: paymentDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const paymentDetail = await PaymentDetails.findById(req.params.id)
      .populate('payment_mth')
      .populate('user')
      .populate('qrCodes')
      .populate('booking');
    if (!paymentDetail) return res.status(404).json({ success: false, message: 'PaymentDetail not found' });
    res.status(200).json({ success: true, data: paymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedPaymentDetail = await PaymentDetails.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedPaymentDetail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await PaymentDetails.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'PaymentDetail deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};