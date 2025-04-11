var express = require('express');
var router = express.Router();
var itineraryController = require('../controllers/itineraries');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả lịch trình (public)
router.get('/', async function(req, res, next) {
    try {
        const itineraries = await itineraryController.GetAllItineraries();
        CreateSuccessRes(res, 200, itineraries);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một lịch trình (public)
router.get('/:id', async function(req, res, next) {
    try {
        const itinerary = await itineraryController.GetItineraryById(req.params.id);
        CreateSuccessRes(res, 200, itinerary);
    } catch (error) {
        next(error);
    }
});

// Tạo lịch trình mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newItinerary = await itineraryController.CreateItinerary(req.body);
        CreateSuccessRes(res, 201, newItinerary);
    } catch (error) {
        next(error);
    }
});

// Cập nhật lịch trình (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedItinerary = await itineraryController.UpdateItinerary(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedItinerary);
    } catch (error) {
        next(error);
    }
});

// Xóa lịch trình (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await itineraryController.DeleteItinerary(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy lịch trình theo điểm đến (public)
router.get('/destination/:destinationId', async function(req, res, next) {
    try {
        const itineraries = await itineraryController.GetItinerariesByDestination(req.params.destinationId);
        CreateSuccessRes(res, 200, itineraries);
    } catch (error) {
        next(error);
    }
});

module.exports = router;