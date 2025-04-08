// routes/province.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/province');

// CRUD operations for Province
router.post('/', controller.create); // Tạo Province mới
router.get('/', controller.getAll); // Lấy tất cả Provinces
router.get('/:id', controller.getById); // Lấy Province theo ID
router.put('/:id', controller.update); // Cập nhật Province theo ID
router.delete('/:id', controller.remove); // Xóa Province theo ID

module.exports = router;
