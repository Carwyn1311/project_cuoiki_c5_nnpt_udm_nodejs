// models/banks.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Banks
const banksSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    recipientName: {
      type: String,
      required: true
    },
    recipientAccountNumber: {
      type: String,
      required: true
    },
    recipientBank: {
      type: String,
      required: true
    },
    maDinhDanh: {
      type: String,
      required: true
    },
    bankId: {
      type: String,
      required: true
    },
    qrCodes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'QRCode'  // Liên kết với model QRCode
      }
    ]
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model Banks
module.exports = mongoose.models.Banks || mongoose.model('Banks', banksSchema);