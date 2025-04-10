// models/city.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho City
const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: 'Province', // Liên kết với Province model
      required: true
    },
    destinations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Destinations' // Liên kết với Destinations model
      }
    ]
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model City
module.exports = mongoose.models.City || mongoose.model('City', citySchema);
