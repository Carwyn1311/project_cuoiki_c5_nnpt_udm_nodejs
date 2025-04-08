// controllers/destinations.js
const Destinations = require('../schemas/destination');

exports.create = async (req, res) => {
  try {
    const { name, description, location, city } = req.body;
    const newDestination = new Destinations({ name, description, location, city });
    await newDestination.save();
    res.status(201).json({ success: true, data: newDestination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const destinations = await Destinations.find().populate('city').populate('destinationImages');
    res.status(200).json({ success: true, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const destination = await Destinations.findById(req.params.id)
      .populate('city')
      .populate('destinationImages')
      .populate('reviewsList')
      .populate('wishlistList')
      .populate('bookingsList')
      .populate('ticketPrice')
      .populate('descriptionFile')
      .populate('itineraries');
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.status(200).json({ success: true, data: destination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedDestination = await Destinations.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedDestination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Destinations.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Destination deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
