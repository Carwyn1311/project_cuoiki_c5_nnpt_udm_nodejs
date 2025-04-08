const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');
const { check_authentication } = require('../utils/check_auth');  

// Tạo review mới (yêu cầu xác thực)
router.post('/', check_authentication, controller.create); // Tạo Review mới

// Lấy tất cả Reviews theo destinationId
router.get('/', controller.getAll); // Lấy tất cả Reviews cho một destination

// Lấy review theo ID
router.get('/:id', controller.getById); // Lấy Review theo ID

// Cập nhật review theo ID (yêu cầu xác thực)
router.put('/:id', check_authentication, controller.update); // Cập nhật Review theo ID

// Xóa review theo ID (yêu cầu xác thực)
router.delete('/:id', check_authentication, controller.remove); // Xóa Review theo ID

module.exports = router;
