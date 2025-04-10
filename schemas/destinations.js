const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Destinations
const destinationsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    destinationImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DestinationImages'
      }
    ],
    reviewsList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reviews'
      }
    ],
    wishlistList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Wishlist'
      }
    ],
    bookingsList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bookings'
      }
    ],
    ticketPrice: {
      type: Schema.Types.ObjectId,
      ref: 'TicketPrices'
    },
    descriptionFile: {
      type: Schema.Types.ObjectId,
      ref: 'DescriptionFile'
    },
    itineraries: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Itinerary'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.models.Destination || mongoose.model('Destination', destinationsSchema);