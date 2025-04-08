const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketprices');
const { check_authentication } = require('../utils/check_auth'); // Đảm bảo xác thực người dùng

// Tạo TicketPrice mới
router.post('/', check_authentication, controller.create); // Tạo TicketPrice mới

// Lấy tất cả TicketPrices
router.get('/', controller.getAll); // Lấy tất cả TicketPrices

// Lấy TicketPrice theo ID
router.get('/:id', controller.getById); // Lấy TicketPrice theo ID

// Cập nhật TicketPrice theo ID
router.put('/:id', check_authentication, controller.update); // Cập nhật TicketPrice theo ID

// Xóa TicketPrice theo ID
router.delete('/:id', check_authentication, controller.remove); // Xóa TicketPrice theo ID

module.exports = router;
