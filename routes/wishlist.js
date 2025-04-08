const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist');

// CRUD operations for Wishlist

// Tạo Wishlist mới
router.post('/', wishlistController.create);

// Lấy tất cả Wishlist của người dùng
router.get('/', wishlistController.getAll);

// Kiểm tra Wishlist theo ID
router.get('/check/:id', wishlistController.checkWish);

// Xóa Wishlist theo destinationId
router.delete('/delete/:destinationId', wishlistController.deleteWish);

module.exports = router;
