const TicketPrices = require('../schemas/TicketPrices');

// Tạo mới TicketPrice
exports.create = async (req, res) => {
  try {
    const { price, type, destination } = req.body;

    // Tạo TicketPrice từ dữ liệu yêu cầu
    const newTicketPrice = new TicketPrices({
      price,
      type,
      destination
    });

    const savedTicketPrice = await newTicketPrice.save();
    res.status(201).json({ success: true, data: savedTicketPrice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật TicketPrice theo ID
exports.update = async (req, res) => {
  try {
    const { price, type, destination } = req.body;

    // Cập nhật TicketPrice theo ID
    const updatedTicketPrice = await TicketPrices.findByIdAndUpdate(
      req.params.id, 
      { price, type, destination }, 
      { new: true }
    );

    if (!updatedTicketPrice) {
      return res.status(404).json({ success: false, message: 'TicketPrice not found' });
    }

    res.status(200).json({ success: true, message: 'TicketPrice updated successfully', data: updatedTicketPrice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy TicketPrice theo ID
exports.getById = async (req, res) => {
  try {
    const ticketPrice = await TicketPrices.findById(req.params.id);
    if (!ticketPrice) {
      return res.status(404).json({ success: false, message: 'TicketPrice not found' });
    }
    res.status(200).json({ success: true, data: ticketPrice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả TicketPrices
exports.getAll = async (req, res) => {
  try {
    const ticketPrices = await TicketPrices.find();
    res.status(200).json({ success: true, data: ticketPrices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa TicketPrice theo ID
exports.remove = async (req, res) => {
  try {
    const ticketPrice = await TicketPrices.findByIdAndDelete(req.params.id);
    if (!ticketPrice) {
      return res.status(404).json({ success: false, message: 'TicketPrice not found' });
    }
    res.status(200).json({ success: true, message: 'TicketPrice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
