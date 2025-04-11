const mongoose = require('mongoose');
const { Schema } = mongoose;

const destinationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  image: {
    type: String
  },
  ticket_prices_id: {
    type: Schema.Types.ObjectId,
    ref: 'TicketPrices'
  },
  province_id: {
    type: Schema.Types.ObjectId,
    ref: 'Province'
  },
  city_id: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  itineraries: [{
      type: Schema.Types.ObjectId,
      ref: 'Itinerary'
  }],
  destination_images: [{
      type: Schema.Types.ObjectId,
      ref: 'DestinationImage'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);