const mongoose = require('mongoose');
const { Schema } = mongoose;

const provinceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Vietnam'
  },
  cities: [{
    type: Schema.Types.ObjectId,
    ref: 'City'
  }]
});

module.exports = mongoose.models.Province || mongoose.model('Province', provinceSchema);