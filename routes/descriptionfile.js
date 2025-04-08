// routes/descriptionfile.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/descriptionfile');

// CRUD operations for DescriptionFile
router.post('/', controller.create); // Tạo DescriptionFile mới
router.get('/', controller.getAll); // Lấy tất cả DescriptionFiles
router.get('/:id', controller.getById); // Lấy DescriptionFile theo ID
router.put('/:id', controller.update); // Cập nhật DescriptionFile theo ID
router.delete('/:id', controller.remove); // Xóa DescriptionFile theo ID

module.exports = router;
