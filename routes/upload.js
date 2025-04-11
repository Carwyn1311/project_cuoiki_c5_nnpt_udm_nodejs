var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        
        // Tạo thư mục uploads nếu không tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Lọc file
const fileFilter = (req, file, cb) => {
    // Chỉ chấp nhận file hình ảnh
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file hình ảnh'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// Upload một hình ảnh
router.post('/image', check_authentication, upload.single('image'), function(req, res, next) {
    try {
        if (!req.file) {
            throw new Error('Không có file nào được tải lên');
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        CreateSuccessRes(res, 201, { imageUrl });
    } catch (error) {
        next(error);
    }
});

// Upload nhiều hình ảnh (tối đa 5)
router.post('/images', check_authentication, upload.array('images', 5), function(req, res, next) {
    try {
        if (!req.files || req.files.length === 0) {
            throw new Error('Không có file nào được tải lên');
        }
        
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        CreateSuccessRes(res, 201, { imageUrls });
    } catch (error) {
        next(error);
    }
});

// Upload avatar cho người dùng
router.post('/avatar', check_authentication, upload.single('avatar'), async function(req, res, next) {
    try {
        if (!req.file) {
            throw new Error('Không có file nào được tải lên');
        }
        
        const avatarUrl = `/uploads/${req.file.filename}`;
        
        // Cập nhật avatar cho người dùng
        const userController = require('../controllers/users');
        const updatedUser = await userController.UpdateUser(req.user._id, { avata: avatarUrl });
        
        CreateSuccessRes(res, 200, { avatarUrl, user: updatedUser });
    } catch (error) {
        next(error);
    }
});

module.exports = router;