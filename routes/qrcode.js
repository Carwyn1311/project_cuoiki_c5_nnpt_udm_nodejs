const express = require('express');
const router = express.Router();
const controller = require('../controllers/qrcode');

// CRUD operations for QRCode
router.post('/', controller.create); // Tạo QRCode mới
router.get('/:id', controller.getById); // Lấy QRCode theo ID

module.exports = router;
