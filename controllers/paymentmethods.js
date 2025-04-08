const PaymentMethods = require('../schemas/paymentmethods');

exports.create = async (req, res) => {
  try {
    const { method_name } = req.body;
    const newPaymentMethod = new PaymentMethods({ method_name });
    await newPaymentMethod.save();
    res.status(201).json({ success: true, data: newPaymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethods.find().populate('paymentDetails');
    res.status(200).json({ success: true, data: paymentMethods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethods.findById(req.params.id).populate('paymentDetails');
    if (!paymentMethod) return res.status(404).json({ success: false, message: 'PaymentMethod not found' });
    res.status(200).json({ success: true, data: paymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedPaymentMethod = await PaymentMethods.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedPaymentMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await PaymentMethods.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'PaymentMethod deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};