const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho Role
const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'  // Liên kết với User model
      }
    ]
  },
  {
    timestamps: true
  }
);

// Phương thức getAuthority - trả về tên role
roleSchema.methods.getAuthority = function () {
  return this.name;  // Trả về tên của role như trong Java
};

// Cập nhật phương thức so sánh (tương tự `equals` trong Java)
roleSchema.methods.equals = function (otherRole) {
  return this.id === otherRole.id;
};

// Cập nhật phương thức hashCode (tương tự trong Java)
roleSchema.methods.hashCode = function () {
  return this.id.toString();  // Dùng id của role làm hash
};

// Export model
module.exports = mongoose.model('Role', roleSchema);
