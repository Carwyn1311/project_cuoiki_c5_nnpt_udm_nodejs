const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  adult_tickets: {
    type: Number,
    required: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  child_tickets: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid'],
    default: 'pending'
  },
  destination_id: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment_details: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentDetail'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);