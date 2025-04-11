var express = require('express');
var router = express.Router();
var activityController = require('../controllers/activities');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả hoạt động (public)
router.get('/', async function(req, res, next) {
    try {
        const activities = await activityController.GetAllActivities();
        CreateSuccessRes(res, 200, activities);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một hoạt động (public)
router.get('/:id', async function(req, res, next) {
    try {
        const activity = await activityController.GetActivityById(req.params.id);
        CreateSuccessRes(res, 200, activity);
    } catch (error) {
        next(error);
    }
});

// Tạo hoạt động mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newActivity = await activityController.CreateActivity(req.body);
        CreateSuccessRes(res, 201, newActivity);
    } catch (error) {
        next(error);
    }
});

// Cập nhật hoạt động (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedActivity = await activityController.UpdateActivity(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedActivity);
    } catch (error) {
        next(error);
    }
});

// Xóa hoạt động (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await activityController.DeleteActivity(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy hoạt động theo lịch trình (public)
router.get('/itinerary/:itineraryId', async function(req, res, next) {
    try {
        const activities = await activityController.GetActivitiesByItinerary(req.params.itineraryId);
        CreateSuccessRes(res, 200, activities);
    } catch (error) {
        next(error);
    }
});

module.exports = router;