// controllers/banks.js
const Banks = require('../schemas/bank');

exports.create = async (req, res) => {
  try {
    const { name, recipientName, recipientAccountNumber, recipientBank, maDinhDanh, bankId } = req.body;
    const newBank = new Banks({ name, recipientName, recipientAccountNumber, recipientBank, maDinhDanh, bankId });
    await newBank.save();
    res.status(201).json({ success: true, data: newBank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const banks = await Banks.find().populate('qrCodes'); // Populating QRCode field
    res.status(200).json({ success: true, data: banks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const bank = await Banks.findById(req.params.id).populate('qrCodes');
    if (!bank) return res.status(404).json({ success: false, message: 'Bank not found' });
    res.status(200).json({ success: true, data: bank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedBank = await Banks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedBank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Banks.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Bank deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
