const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Tạo schema cho User
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      maxlength: 100
    },
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 70
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    provider: String,
    providerId: String,
    address: String,
    dateYear: {
      type: Date,
      default: Date.now
    },
    avata: String,
    phone: String,
    code: String,
    expiresAt: Date,
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ],
    paymentDetails: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PaymentDetails'
      }
    ],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bookings'
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
    ]
  },
  {
    timestamps: true
  }
);

// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// So sánh mật khẩu với mật khẩu đã mã hóa
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Xác định các quyền của người dùng (tương tự `getAuthorities()` trong Java)
userSchema.methods.getRoles = function () {
  return this.roles.map(role => role.name);  // Giả sử "role" là một schema khác
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
