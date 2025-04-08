// routes/activity.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/activity');

// CRUD operations for Activity
router.post('/', controller.create); // Tạo activity mới
router.get('/', controller.getAll); // Lấy tất cả activities
router.get('/:id', controller.getById); // Lấy activity theo ID
router.put('/:id', controller.update); // Cập nhật activity theo ID
router.delete('/:id', controller.remove); // Xóa activity theo ID

module.exports = router;
