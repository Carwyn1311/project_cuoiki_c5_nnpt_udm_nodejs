// routes/ticketprices.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticketprices');

// CRUD operations for TicketPrices
router.post('/', controller.create); // Tạo TicketPrice mới
router.get('/', controller.getAll); // Lấy tất cả TicketPrices
router.get('/:id', controller.getById); // Lấy TicketPrice theo ID
router.put('/:id', controller.update); // Cập nhật TicketPrice theo ID
router.delete('/:id', controller.remove); // Xóa TicketPrice theo ID

module.exports = router;
