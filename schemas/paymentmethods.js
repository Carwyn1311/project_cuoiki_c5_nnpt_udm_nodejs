// models/paymentmethods.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho PaymentMethods
const paymentMethodsSchema = new Schema(
  {
    method_name: {
      type: String,
      required: true
    },
    // Mối quan hệ với PaymentDetails
    paymentDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PaymentDetails', // Liên kết với model PaymentDetails
        required: true
      }
    ]
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model PaymentMethods
module.exports = mongoose.model('PaymentMethods', paymentMethodsSchema);
