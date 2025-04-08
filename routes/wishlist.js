// routes/wishlist.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/wishlist');

// CRUD operations for Wishlist
router.post('/', controller.create); // Tạo Wishlist mới
router.get('/', controller.getAll); // Lấy tất cả Wishlist
router.get('/:id', controller.getById); // Lấy Wishlist theo ID
router.put('/:id', controller.update); // Cập nhật Wishlist theo ID
router.delete('/:id', controller.remove); // Xóa Wishlist theo ID

module.exports = router;
