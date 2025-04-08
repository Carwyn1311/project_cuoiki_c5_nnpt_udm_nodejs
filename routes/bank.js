const express = require('express');
const router = express.Router();
const controller = require('../controllers/bank');

// CRUD operations for Banks
router.post('/', controller.create);  // Tạo ngân hàng mới
router.get('/', controller.getAll);  // Lấy tất cả ngân hàng
router.get('/:id', controller.getById);  // Lấy ngân hàng theo ID
router.put('/:id', controller.update);  // Cập nhật ngân hàng theo ID
router.delete('/:id', controller.remove);  // Xóa ngân hàng theo ID

module.exports = router;
