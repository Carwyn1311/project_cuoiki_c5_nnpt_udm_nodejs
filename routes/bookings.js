// routes/bookings.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookings');

// CRUD operations for Bookings
router.post('/', controller.create); // Tạo booking mới
router.get('/', controller.getAll); // Lấy tất cả bookings
router.get('/:id', controller.getById); // Lấy booking theo ID
router.put('/:id', controller.update); // Cập nhật booking theo ID
router.delete('/:id', controller.remove); // Xóa booking theo ID

module.exports = router;
