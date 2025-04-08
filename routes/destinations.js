// routes/destinations.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/destinations');

// CRUD operations for Destinations
router.post('/', controller.create); // Tạo mới Destination
router.get('/', controller.getAll); // Lấy tất cả Destinations
router.get('/:id', controller.getById); // Lấy Destination theo ID
router.put('/:id', controller.update); // Cập nhật Destination theo ID
router.delete('/:id', controller.remove); // Xóa Destination theo ID

// Routes for Images
router.post('/img', controller.createImg); // Thêm ảnh mới cho Destination
router.delete('/img/:id', controller.deleteImg); // Xóa ảnh của Destination

// Routes for Domestic and International Destinations
router.get('/domestic', controller.getDomesticDestinations); // Lấy Destinations trong nước
router.get('/international', controller.getInternationalDestinations); // Lấy Destinations quốc tế

module.exports = router;
