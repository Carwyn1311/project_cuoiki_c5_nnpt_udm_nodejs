const mongoose = require('mongoose');
const { Schema } = mongoose;

const destinationImageSchema = new Schema({
  image_url: {
    type: String,
    required: true
  },
  destination_id: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  }
});

module.exports = mongoose.models.DestinationImage || mongoose.model('DestinationImage', destinationImageSchema);