const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho DestinationImages
const destinationImagesSchema = new Schema(
  {
    image_url: {
      type: String,
      required: true
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DestinationImages', destinationImagesSchema);