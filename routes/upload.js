const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');

// Route để upload image
router.post('/image', uploadController.uploadImage, uploadController.handleImageUpload);

// Route để upload file
router.post('/file', uploadController.uploadFile, uploadController.handleFileUpload);

module.exports = router;