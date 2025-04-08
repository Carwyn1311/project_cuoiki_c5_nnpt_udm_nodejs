// controllers/ticketprices.js
const TicketPrices = require('../schemas/ticketprices');

exports.create = async (req, res) => {
  try {
    const { adult_price, child_price, destination } = req.body;
    const newTicketPrice = new TicketPrices({ adult_price, child_price, destination });
    await newTicketPrice.save();
    res.status(201).json({ success: true, data: newTicketPrice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const ticketPrices = await TicketPrices.find().populate('destination');
    res.status(200).json({ success: true, data: ticketPrices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ticketPrice = await TicketPrices.findById(req.params.id).populate('destination');
    if (!ticketPrice) return res.status(404).json({ success: false, message: 'TicketPrice not found' });
    res.status(200).json({ success: true, data: ticketPrice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedTicketPrice = await TicketPrices.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedTicketPrice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await TicketPrices.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'TicketPrice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};