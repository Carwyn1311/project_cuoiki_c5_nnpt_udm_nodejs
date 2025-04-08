const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

// CRUD operations for User

// Lấy tất cả người dùng
router.get('/', controller.getAllUsers);

// Lấy người dùng theo ID
router.get('/:id', controller.getUserInfo);

// Cập nhật thông tin người dùng
router.put('/:username', controller.updateUser);

// Cập nhật vai trò người dùng
router.put('/:userId/roles', controller.updateUserRole);

module.exports = router;
