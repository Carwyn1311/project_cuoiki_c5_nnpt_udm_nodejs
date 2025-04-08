const Bookings = require('../schemas/Bookings');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Tạo mới booking
exports.create = async (req, res) => {
  try {
    const { booking_date, adult_tickets, child_tickets, status, days, destination_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Tạo đối tượng Bookings từ dữ liệu yêu cầu
    const newBooking = new Bookings({
      booking_date,
      adult_tickets,
      child_tickets,
      status,
      days,
      user: username,
      destination: destination_id
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, data: savedBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy thông tin booking theo ID
exports.getById = async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id)
      .populate('user')
      .populate('destination')
      .populate('paymentDetails'); // Nếu bạn có các mối quan hệ khác
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả bookings
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

// Cập nhật booking theo ID
exports.update = async (req, res) => {
  try {
    const { booking_date, adult_tickets, child_tickets, status, days, destination_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
    const decoded = jwt.verify(token, constants.SECRET_KEY);  // Giải mã token để lấy thông tin user
    const username = decoded.id;

    // Cập nhật booking theo ID
    const updatedBooking = await Bookings.findByIdAndUpdate(req.params.id, {
      booking_date,
      adult_tickets,
      child_tickets,
      status,
      days,
      user: username,
      destination: destination_id
    }, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa booking theo ID
exports.remove = async (req, res) => {
  try {
    const booking = await Bookings.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
