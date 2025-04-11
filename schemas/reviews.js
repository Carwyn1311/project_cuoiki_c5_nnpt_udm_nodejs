const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);