var express = require('express');
var router = express.Router();
var paymentDetailController = require('../controllers/paymentDetails');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả chi tiết thanh toán (Admin và CSKH)
router.get('/', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const paymentDetails = await paymentDetailController.GetAllPaymentDetails();
            CreateSuccessRes(res, 200, paymentDetails);
        } else {
            throw new Error('Bạn không có quyền xem danh sách chi tiết thanh toán');
        }
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một thanh toán
router.get('/:id', check_authentication, async function(req, res, next) {
    try {
        const paymentDetail = await paymentDetailController.GetPaymentDetailById(req.params.id);
        
        // Kiểm tra quyền: Admin, CSKH hoặc chính người thanh toán
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH') || paymentDetail.user_id.toString() === req.user._id.toString()) {
            CreateSuccessRes(res, 200, paymentDetail);
        } else {
            throw new Error('Bạn không có quyền xem chi tiết thanh toán này');
        }
    } catch (error) {
        next(error);
    }
});

// Tạo chi tiết thanh toán mới
router.post('/', check_authentication, async function(req, res, next) {
    try {
        // Nếu là Admin hoặc CSKH, có thể tạo thanh toán cho người khác
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            // Sử dụng user_id từ request body nếu có
            const userId = req.body.user_id || req.user._id;
            const paymentData = {
                ...req.body,
                user_id: userId
            };
            const newPaymentDetail = await paymentDetailController.CreatePaymentDetail(paymentData);
            CreateSuccessRes(res, 201, newPaymentDetail);
        } else {
            // Người dùng thường chỉ có thể tạo thanh toán cho chính mình
            const paymentData = {
                ...req.body,
                user_id: req.user._id
            };
            const newPaymentDetail = await paymentDetailController.CreatePaymentDetail(paymentData);
            CreateSuccessRes(res, 201, newPaymentDetail);
        }
    } catch (error) {
        next(error);
    }
});

// Cập nhật chi tiết thanh toán (Admin và CSKH)
router.put('/:id', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const updatedPaymentDetail = await paymentDetailController.UpdatePaymentDetail(req.params.id, req.body);
            CreateSuccessRes(res, 200, updatedPaymentDetail);
        } else {
            throw new Error('Bạn không có quyền cập nhật chi tiết thanh toán');
        }
    } catch (error) {
        next(error);
    }
});

// Xóa chi tiết thanh toán (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await paymentDetailController.DeletePaymentDetail(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết thanh toán theo người dùng
router.get('/user/:userId', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin, CSKH hoặc chính người thanh toán
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH') || req.params.userId === req.user._id.toString()) {
            const paymentDetails = await paymentDetailController.GetPaymentDetailsByUser(req.params.userId);
            CreateSuccessRes(res, 200, paymentDetails);
        } else {
            throw new Error('Bạn không có quyền xem chi tiết thanh toán của người dùng này');
        }
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết thanh toán theo trạng thái (Admin và CSKH)
router.get('/status/:status', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const paymentDetails = await paymentDetailController.GetPaymentDetailsByStatus(req.params.status);
            CreateSuccessRes(res, 200, paymentDetails);
        } else {
            throw new Error('Bạn không có quyền xem danh sách chi tiết thanh toán theo trạng thái');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;