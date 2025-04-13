const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DestinationImage = require('../schemas/destinationimages');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Đảm bảo thư mục uploads/images tồn tại
const imageDir = 'uploads/images';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Đảm bảo thư mục uploads/files tồn tại
const fileDir = 'uploads/files';
if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir, { recursive: true });
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
        let imageUrl;

        // Kiểm tra xem có file ảnh được upload không
        if (req.file) {
            imageUrl = req.file.path; // Nếu có file upload, dùng đường dẫn file
        } else if (req.body.image_url) {
            imageUrl = req.body.image_url; // Nếu không có file, dùng link ảnh từ body
        } else {
            return res.status(400).json({ success: false, message: 'Phải cung cấp file ảnh hoặc link ảnh (image_url)' });
        }

        // Kiểm tra destination_id
        if (!req.body.destinationId) {
            return res.status(400).json({ success: false, message: 'Thiếu destinationId' });
        }

        // Tạo bản ghi DestinationImage
        const image = await DestinationImage.create({
            image_url: imageUrl,
            destination_id: req.body.destinationId
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
        
        // Vì không có model DescriptionFile trong schema mới, bạn có thể lưu thông tin file vào một collection khác
        // hoặc chỉ trả về đường dẫn file
        res.status(201).json({ 
            success: true, 
            data: {
                file_url: req.file.path,
                file_name: req.file.originalname,
                file_type: req.file.mimetype,
                destination_id: req.body.destinationId
            } 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};