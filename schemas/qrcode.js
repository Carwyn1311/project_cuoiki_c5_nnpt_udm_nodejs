// models/qrcode.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho QRCode
const qrcodeSchema = new Schema(
  {
    qr_code_url: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Mối quan hệ với Banks
    bank: {
      type: Schema.Types.ObjectId,
      ref: 'Banks', // Liên kết với model Banks
      required: true
    },
    // Mối quan hệ với PaymentDetails
    paymentDetails: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentDetails', // Liên kết với model PaymentDetails
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model QRCode
module.exports = mongoose.models.QRCode || mongoose.model('QRCode', qrcodeSchema);
