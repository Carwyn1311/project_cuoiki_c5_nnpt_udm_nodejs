const Activity = require('../schemas/activity'); 

exports.create = async (req, res) => {
  try {
    const { activity_name, start_time, end_time, itinerary } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!activity_name || !start_time || !end_time || !itinerary) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newActivity = new Activity({ activity_name, start_time, end_time, itinerary });
    await newActivity.save();
    res.status(201).json({ success: true, data: newActivity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving activity: ' + err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const activities = await Activity.find().populate('itinerary');
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching activities: ' + err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('itinerary');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.status(200).json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching activity: ' + err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { activity_name, start_time, end_time, itinerary } = req.body;
    if (!activity_name || !start_time || !end_time || !itinerary) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedActivity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, data: updatedActivity });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating activity: ' + err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting activity: ' + err.message });
  }
};
