const express = require('express');
const router = express.Router();
const controller = require('../controllers/itinerary');

// CRUD operations for Itinerary
router.post('/', controller.create); // Tạo Itinerary mới
router.get('/', controller.getAll); // Lấy tất cả Itineraries
router.get('/:id', controller.getById); // Lấy Itinerary theo ID
router.put('/:id', controller.update); // Cập nhật Itinerary theo ID
router.delete('/:id', controller.remove); // Xóa Itinerary theo ID

module.exports = router;