const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentmethods');

// CRUD operations for PaymentMethods
router.post('/', controller.create); // Tạo PaymentMethod mới
router.get('/', controller.getAll); // Lấy tất cả PaymentMethods
router.get('/:id', controller.getById); // Lấy PaymentMethod theo ID
router.put('/:id', controller.update); // Cập nhật PaymentMethod theo ID
router.delete('/:id', controller.remove); // Xóa PaymentMethod theo ID

module.exports = router;
