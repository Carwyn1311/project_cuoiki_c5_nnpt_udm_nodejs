// models/activity.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Activity
const activitySchema = new Schema(
  {
    activity_name: {
      type: String,
      required: true
    },
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    },
    itinerary: {
      type: Schema.Types.ObjectId,
      ref: 'Itinerary', // Liên kết với Itinerary model
      required: true
    }
  },
  { timestamps: true } // Mongoose sẽ tự động tạo createdAt và updatedAt
);

// Export model Activity
module.exports = mongoose.model('Activity', activitySchema);
