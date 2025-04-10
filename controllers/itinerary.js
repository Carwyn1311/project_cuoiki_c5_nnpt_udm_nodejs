const Itinerary = require('../schemas/Itinerary');
const Destinations = require('../schemas/Destinations');
const Activity = require('../schemas/activity');

// Lấy tất cả itineraries
exports.getAll = async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate('destination')
      .populate('activities');
    res.status(200).json({ success: true, data: itineraries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching itineraries: ' + err.message });
  }
};

// Lấy thông tin itinerary theo ID
exports.getById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate('destination')
      .populate('activities');
    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }
    res.status(200).json({ success: true, data: itinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching itinerary: ' + err.message });
  }
};

// Tạo mới itinerary
exports.create = async (req, res) => {
  try {
    const { start_date, end_date, destination, activities } = req.body;

    // Tìm destination theo ID
    const destinationObj = await Destinations.findById(destination);
    if (!destinationObj) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Tạo mới itinerary
    const newItinerary = new Itinerary({
      start_date,
      end_date,
      destination: destinationObj,
      activities: activities
    });

    // Lưu itinerary
    await newItinerary.save();

    // Cập nhật các activity với itinerary mới
    for (let activity of activities) {
      await Activity.findByIdAndUpdate(activity._id, { itinerary: newItinerary._id });
    }

    res.status(201).json({ success: true, message: 'Itinerary saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving itinerary: ' + err.message });
  }
};

// Cập nhật itinerary theo ID
exports.update = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, {
      start_date,
      end_date
    }, { new: true });

    if (!updatedItinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    res.status(200).json({ success: true, message: 'Itinerary updated successfully', data: updatedItinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating itinerary: ' + err.message });
  }
};

// Xóa itinerary theo ID
exports.remove = async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.status(204).json({ success: true, message: 'Itinerary deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting itinerary: ' + err.message });
  }
};