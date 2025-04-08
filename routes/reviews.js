// routes/reviews.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');

// CRUD operations for Reviews
router.post('/', controller.create); // Tạo Review mới
router.get('/', controller.getAll); // Lấy tất cả Reviews
router.get('/:id', controller.getById); // Lấy Review theo ID
router.put('/:id', controller.update); // Cập nhật Review theo ID
router.delete('/:id', controller.remove); // Xóa Review theo ID

module.exports = router;
