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

// Kiểm tra xem model đã tồn tại chưa trước khi định nghĩa
module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);