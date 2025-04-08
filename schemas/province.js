// models/province.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Province
const provinceSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    // Mối quan hệ với City (Một province có nhiều city)
    cities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'City' // Liên kết với model City
      }
    ]
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model Province
module.exports = mongoose.model('Province', provinceSchema);
