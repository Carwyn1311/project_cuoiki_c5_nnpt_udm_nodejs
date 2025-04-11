const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  province_id: {
    type: Schema.Types.ObjectId,
    ref: 'Province',
    required: true
  }
});

module.exports = mongoose.models.City || mongoose.model('City', citySchema);