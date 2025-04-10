// models/descriptionfile.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Tạo schema cho DescriptionFile
const descriptionFileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    // Mối quan hệ một-một với Destinations
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destinations', // Liên kết với model Destinations
      required: true
    }
  },
  { timestamps: true } // Tạo `createdAt` và `updatedAt` tự động
);

// Export model DescriptionFile
module.exports = mongoose.models.DescriptionFile || mongoose.model('DescriptionFile', descriptionFileSchema);
