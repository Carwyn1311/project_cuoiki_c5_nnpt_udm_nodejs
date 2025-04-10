// routes/city.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/city');

// CRUD operations for City
router.post('/', controller.create); // Tạo city mới
router.get('/', controller.getAll); // Lấy tất cả cities
router.get('/:id', controller.getById); // Lấy city theo ID
router.put('/:id', controller.update); // Cập nhật city theo ID
router.delete('/:id', controller.delete); // Xóa city theo ID

module.exports = router;
