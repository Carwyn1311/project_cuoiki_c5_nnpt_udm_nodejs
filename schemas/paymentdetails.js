// models/paymentdetails.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho PaymentDetails
const paymentDetailsSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    payment_date: {
      type: Date,
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
    invoiceCode: {
      type: String,
      required: true
    },
    // Mối quan hệ với PaymentMethods
    payment_mth: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethods', // Liên kết với model PaymentMethods
      required: true
    },
    // Mối quan hệ với User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User
      required: true
    },
    // Mối quan hệ với QRCode
    qrCodes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'QRCode' // Liên kết với model QRCode
      }
    ],
    // Mối quan hệ với Bookings
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Bookings', // Liên kết với model Bookings
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model PaymentDetails
module.exports = mongoose.models.PaymentDetails || mongoose.model('PaymentDetails', paymentDetailsSchema);
