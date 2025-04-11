const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
  activity_name: {
    type: String,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  start_time: {
    type: Date,
    required: true
  },
  itinerary_id: {
    type: Schema.Types.ObjectId,
    ref: 'Itinerary',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);