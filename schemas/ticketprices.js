// models/ticketprices.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho TicketPrices
const ticketPricesSchema = new Schema(
  {
    adult_price: {
      type: Number,
      required: true
    },
    child_price: {
      type: Number,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Mối quan hệ với Destinations
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations', // Liên kết với model Destinations
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model TicketPrices
module.exports = mongoose.models.TicketPrices || mongoose.model('TicketPrices', ticketPricesSchema)
