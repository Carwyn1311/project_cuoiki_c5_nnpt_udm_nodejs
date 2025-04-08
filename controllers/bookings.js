// controllers/bookings.js
const Bookings = require('../schemas/Bookings');
exports.create = async (req, res) => {
  try {
    const { booking_date, adult_tickets, child_tickets, status, days, user, destination } = req.body;
    const newBooking = new Bookings({
      booking_date,
      adult_tickets,
      child_tickets,
      status,
      days,
      user,
      destination
    });
    await newBooking.save();
    res.status(201).json({ success: true, data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const bookings = await Bookings.find()
      .populate('user')
      .populate('destination')
      .populate('paymentDetails');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id)
      .populate('user')
      .populate('destination')
      .populate('paymentDetails');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedBooking = await Bookings.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Bookings.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
