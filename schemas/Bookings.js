// models/bookings.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Bookings
const bookingsSchema = new Schema(
  {
    booking_date: {
      type: Date,
      required: true
    },
    adult_tickets: {
      type: Number,
      required: true
    },
    child_tickets: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    days: {
      type: Number,
      required: true
    },
    // Mối quan hệ với PaymentDetails
    paymentDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PaymentDetails'
      }
    ],
    // Mối quan hệ với User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Mối quan hệ với Destinations
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations',
      required: true
    }
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

// Export model Bookings
module.exports = mongoose.models.Bookings || mongoose.model('Bookings', bookingsSchema);