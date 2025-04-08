// controllers/activity.js
const Activity = require('../schemas/activity'); // Đường dẫn đúng khi sử dụng thư mục schemas

exports.create = async (req, res) => {
  try {
    const { activity_name, start_time, end_time, itinerary } = req.body;
    const newActivity = new Activity({ activity_name, start_time, end_time, itinerary });
    await newActivity.save();
    res.status(201).json({ success: true, data: newActivity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const activities = await Activity.find().populate('itinerary'); // Populating the itinerary field
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('itinerary');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.status(200).json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedActivity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
