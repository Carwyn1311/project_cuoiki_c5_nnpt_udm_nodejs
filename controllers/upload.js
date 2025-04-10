const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DestinationImages = require('../schemas/destinationimages');
const DescriptionFile = require('../schemas/descriptionfile');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer cho images
const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Cấu hình multer cho files
const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/files');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter cho images
const imageFilter = function(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Filter cho files
const fileFilter = function(req, file, cb) {
  const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Not a valid file type! Please upload only PDF or Word documents.'), false);
  }
};

// Middleware upload cho images
exports.uploadImage = multer({ 
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');

// Middleware upload cho files
exports.uploadFile = multer({ 
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');

// Controller xử lý upload image
exports.handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    const image = await DestinationImages.create({
      image_url: req.file.path,
      destination: req.body.destinationId,
      description: req.body.description,
      is_main: req.body.isMain === 'true'
    });
    
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Controller xử lý upload file
exports.handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const file = await DescriptionFile.create({
      file_url: req.file.path,
      file_name: req.file.originalname,
      file_type: req.file.mimetype,
      destination: req.body.destinationId
    });
    
    res.status(201).json({ success: true, data: file });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};