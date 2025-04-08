// routes/qrcode.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/qrcode');

// CRUD operations for QRCode
router.post('/', controller.create); // Tạo QRCode mới
router.get('/', controller.getAll); // Lấy tất cả QRCode
router.get('/:id', controller.getById); // Lấy QRCode theo ID
router.put('/:id', controller.update); // Cập nhật QRCode theo ID
router.delete('/:id', controller.remove); // Xóa QRCode theo ID

module.exports = router;
