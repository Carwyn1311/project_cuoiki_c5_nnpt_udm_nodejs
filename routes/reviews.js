var express = require('express');
var router = express.Router();
var reviewController = require('../controllers/reviews');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả đánh giá (public)
router.get('/', async function(req, res, next) {
    try {
        const reviews = await reviewController.GetAllReviews();
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một đánh giá (public)
router.get('/:id', async function(req, res, next) {
    try {
        const review = await reviewController.GetReviewById(req.params.id);
        CreateSuccessRes(res, 200, review);
    } catch (error) {
        next(error);
    }
});

// Tạo đánh giá mới (yêu cầu đăng nhập và đã đặt tour)
router.post('/', check_authentication, async function(req, res, next) {
    try {
        const reviewData = {
            ...req.body,
            user_id: req.user._id
        };
        const newReview = await reviewController.CreateReview(reviewData);
        CreateSuccessRes(res, 201, newReview);
    } catch (error) {
        next(error);
    }
});

// Cập nhật đánh giá (chỉ người tạo đánh giá)
router.put('/:id', check_authentication, async function(req, res, next) {
    try {
        const updatedReview = await reviewController.UpdateReview(req.params.id, req.body, req.user._id.toString());
        CreateSuccessRes(res, 200, updatedReview);
    } catch (error) {
        next(error);
    }
});

// Xóa đánh giá (người tạo đánh giá hoặc Admin)
router.delete('/:id', check_authentication, async function(req, res, next) {
    try {
        const userRoles = req.user.roles.map(role => role.name);
        const isAdmin = userRoles.includes('Admin');
        const result = await reviewController.DeleteReview(req.params.id, req.user._id.toString(), isAdmin);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy đánh giá theo người dùng (public)
router.get('/user/:userId', async function(req, res, next) {
    try {
        const reviews = await reviewController.GetReviewsByUser(req.params.userId);
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

// Lấy đánh giá theo điểm đến (public)
router.get('/destination/:destinationId', async function(req, res, next) {
    try {
        const reviews = await reviewController.GetReviewsByDestination(req.params.destinationId);
        CreateSuccessRes(res, 200, reviews);
    } catch (error) {
        next(error);
    }
});

module.exports = router;