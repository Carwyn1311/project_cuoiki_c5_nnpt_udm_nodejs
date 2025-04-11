var express = require('express');
var router = express.Router();
var destinationController = require('../controllers/destinations');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả điểm đến (public)
router.get('/', async function(req, res, next) {
    try {
        const destinations = await destinationController.GetAllDestinations();
        CreateSuccessRes(res, 200, destinations);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một điểm đến (public)
router.get('/:id', async function(req, res, next) {
    try {
        const destination = await destinationController.GetDestinationById(req.params.id);
        CreateSuccessRes(res, 200, destination);
    } catch (error) {
        next(error);
    }
});

// Tạo điểm đến mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newDestination = await destinationController.CreateDestination(req.body);
        CreateSuccessRes(res, 201, newDestination);
    } catch (error) {
        next(error);
    }
});

// Cập nhật điểm đến (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedDestination = await destinationController.UpdateDestination(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedDestination);
    } catch (error) {
        next(error);
    }
});

// Xóa điểm đến (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await destinationController.DeleteDestination(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Thêm hình ảnh cho điểm đến (chỉ Admin)
router.post('/:id/images', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newImage = await destinationController.AddDestinationImage(req.params.id, req.body.image_url);
        CreateSuccessRes(res, 201, newImage);
    } catch (error) {
        next(error);
    }
});

// Lấy điểm đến theo tỉnh (public)
router.get('/province/:provinceId', async function(req, res, next) {
    try {
        const destinations = await destinationController.GetDestinationsByProvince(req.params.provinceId);
        CreateSuccessRes(res, 200, destinations);
    } catch (error) {
        next(error);
    }
});

// Lấy điểm đến theo thành phố (public)
router.get('/city/:cityId', async function(req, res, next) {
    try {
        const destinations = await destinationController.GetDestinationsByCity(req.params.cityId);
        CreateSuccessRes(res, 200, destinations);
    } catch (error) {
        next(error);
    }
});

// Tìm kiếm điểm đến theo tên (public)
router.get('/search/:keyword', async function(req, res, next) {
    try {
        const destinations = await destinationController.SearchDestinations(req.params.keyword);
        CreateSuccessRes(res, 200, destinations);
    } catch (error) {
        next(error);
    }
});

module.exports = router;