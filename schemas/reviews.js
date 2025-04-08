// models/reviews.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Reviews
const reviewsSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Mối quan hệ với User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User
      required: true
    },
    // Mối quan hệ với Destinations
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations', // Liên kết với model Destinations
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model Reviews
module.exports = mongoose.model('Reviews', reviewsSchema);
