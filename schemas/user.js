const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Schema User (Người dùng)
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Vui lòng sử dụng địa chỉ email hợp lệ']
  },
  fullname: {
    type: String,
    maxlength: 100
  },
  password: {
    type: String,
    required: true
  },
  provider: {
    type: String
  },
  provider_id: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 70
  },
  address: {
    type: String
  },
  avata: {
    type: String
  },
  date_year: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String
  },
  expires_at: {
    type: Date
  },
  code: {
    type: String
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }],
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);