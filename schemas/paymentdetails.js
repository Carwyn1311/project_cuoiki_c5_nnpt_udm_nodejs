const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  booking_id: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  payment_method: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash', 'momo', 'zalopay'],
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoice_code: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.PaymentDetail || mongoose.model('PaymentDetail', paymentDetailSchema);