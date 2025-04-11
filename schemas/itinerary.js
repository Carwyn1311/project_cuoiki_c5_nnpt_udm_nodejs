const mongoose = require('mongoose');
const { Schema } = mongoose;

const itinerarySchema = new Schema({
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  destination_id: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  activities: [{
      type: Schema.Types.ObjectId,
      ref: 'Activity'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);