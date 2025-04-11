var express = require('express');
var router = express.Router();
var destinationImageController = require('../controllers/destinationImages');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả hình ảnh điểm đến (public)
router.get('/', async function(req, res, next) {
    try {
        const images = await destinationImageController.GetAllDestinationImages();
        CreateSuccessRes(res, 200, images);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một hình ảnh (public)
router.get('/:id', async function(req, res, next) {
    try {
        const image = await destinationImageController.GetDestinationImageById(req.params.id);
        CreateSuccessRes(res, 200, image);
    } catch (error) {
        next(error);
    }
});

// Tạo hình ảnh mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newImage = await destinationImageController.CreateDestinationImage(req.body.image_url, req.body.destination_id);
        CreateSuccessRes(res, 201, newImage);
    } catch (error) {
        next(error);
    }
});

// Cập nhật hình ảnh (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedImage = await destinationImageController.UpdateDestinationImage(req.params.id, req.body.image_url);
        CreateSuccessRes(res, 200, updatedImage);
    } catch (error) {
        next(error);
    }
});

// Xóa hình ảnh (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await destinationImageController.DeleteDestinationImage(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy hình ảnh theo điểm đến (public)
router.get('/destination/:destinationId', async function(req, res, next) {
    try {
        const images = await destinationImageController.GetImagesByDestination(req.params.destinationId);
        CreateSuccessRes(res, 200, images);
    } catch (error) {
        next(error);
    }
});

module.exports = router;