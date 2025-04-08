// models/itinerary.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Itinerary
const itinerarySchema = new Schema(
  {
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    // Mối quan hệ một-nhiều với Activity
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Activity' // Liên kết với model Activity
      }
    ],
    // Mối quan hệ nhiều-một với Destinations
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations', // Liên kết với model Destinations
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model Itinerary
module.exports = mongoose.model('Itinerary', itinerarySchema);
