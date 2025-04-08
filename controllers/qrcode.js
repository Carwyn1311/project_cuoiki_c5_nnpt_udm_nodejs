// controllers/qrcode.js
const QRCode = require('../schemas/qrcode');

exports.create = async (req, res) => {
  try {
    const { qr_code_url, bank, paymentDetails } = req.body;
    const newQRCode = new QRCode({ qr_code_url, bank, paymentDetails });
    await newQRCode.save();
    res.status(201).json({ success: true, data: newQRCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const qrCodes = await QRCode.find().populate('bank').populate('paymentDetails');
    res.status(200).json({ success: true, data: qrCodes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id).populate('bank').populate('paymentDetails');
    if (!qrCode) return res.status(404).json({ success: false, message: 'QRCode not found' });
    res.status(200).json({ success: true, data: qrCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedQRCode = await QRCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedQRCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await QRCode.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'QRCode deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
