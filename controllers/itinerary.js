const Itinerary = require('../schemas/itinerary');

exports.create = async (req, res) => {
  try {
    const { start_date, end_date, activities, destination } = req.body;
    const newItinerary = new Itinerary({ start_date, end_date, activities, destination });
    await newItinerary.save();
    res.status(201).json({ success: true, data: newItinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('activities').populate('destination');
    res.status(200).json({ success: true, data: itineraries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('activities').populate('destination');
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
    res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedItinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Itinerary deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};