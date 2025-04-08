const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentdetails');

// CRUD operations for PaymentDetails
router.post('/', controller.create); // Tạo PaymentDetails mới
router.get('/', controller.getAll); // Lấy tất cả PaymentDetails
router.get('/:id', controller.getById); // Lấy PaymentDetails theo ID
router.put('/:id/status', controller.updatePaymentDetailStatus); // Cập nhật trạng thái PaymentDetails
router.delete('/:id', controller.remove); // Xóa PaymentDetails theo ID

module.exports = router;
