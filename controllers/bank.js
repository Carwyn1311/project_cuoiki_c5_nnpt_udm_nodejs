const Banks = require('../schemas/bank');  // Model cho Banks

// Tạo ngân hàng mới
exports.create = async (req, res) => {
  try {
    const { name, recipientName, recipientAccountNumber, recipientBank, maDinhDanh, bankId } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !recipientName || !recipientAccountNumber || !recipientBank) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newBank = new Banks({ name, recipientName, recipientAccountNumber, recipientBank, maDinhDanh, bankId });
    await newBank.save();
    res.status(201).json({ success: true, data: newBank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả ngân hàng
exports.getAll = async (req, res) => {
  try {
    const banks = await Banks.find().populate('qrCodes');  // Populating QRCode field
    res.status(200).json({ success: true, data: banks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy thông tin ngân hàng theo ID
exports.getById = async (req, res) => {
  try {
    const bank = await Banks.findById(req.params.id).populate('qrCodes');
    if (!bank) return res.status(404).json({ success: false, message: 'Bank not found' });
    res.status(200).json({ success: true, data: bank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật thông tin ngân hàng theo ID
exports.update = async (req, res) => {
  try {
    const updatedBank = await Banks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBank) return res.status(404).json({ success: false, message: 'Bank not found' });
    res.status(200).json({ success: true, data: updatedBank });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa ngân hàng theo ID
exports.remove = async (req, res) => {
  try {
    const bank = await Banks.findByIdAndDelete(req.params.id);
    if (!bank) return res.status(404).json({ success: false, message: 'Bank not found' });
    res.status(200).json({ success: true, message: 'Bank deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
