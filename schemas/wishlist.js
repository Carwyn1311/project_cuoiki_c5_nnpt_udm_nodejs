// models/wishlist.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Wishlist
const wishlistSchema = new Schema(
  {
    created_at: {
      type: Date,
      default: Date.now
    },
    // Mối quan hệ với User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User
      required: true
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

// Export model Wishlist
module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
