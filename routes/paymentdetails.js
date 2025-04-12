const express = require('express');
const router = express.Router();
const paymentDetailController = require('../controllers/paymentDetails');
const { CreateSuccessRes } = require('../utils/ResHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// Lấy tất cả chi tiết thanh toán (Admin & CSKH)
router.get('/', check_authentication, async (req, res, next) => {
  try {
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
router.get('/:id', check_authentication, async (req, res, next) => {
  try {
    const paymentDetail = await paymentDetailController.GetPaymentDetailById(req.params.id);
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
      // Kiểm tra payment_method có được cung cấp không
      if (!req.body.payment_method) {
        return CreateErrorRes(res, 400, new Error('Phương thức thanh toán không được để trống'));
      }
  
      // Kiểm tra payment_method có hợp lệ không
      const validPaymentMethods = ['credit_card', 'bank_transfer', 'cash', 'momo', 'zalopay'];
      if (!validPaymentMethods.includes(req.body.payment_method)) {
        return CreateErrorRes(res, 400, new Error('Phương thức thanh toán không hợp lệ'));
      }
  
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

// Cập nhật chi tiết thanh toán (Admin & CSKH)
router.put('/:id', check_authentication, async (req, res, next) => {
  try {
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

// Cập nhật trạng thái thanh toán (Admin & CSKH)
router.put('/:id/status', check_authentication, async (req, res, next) => {
    try {
      const userRoles = req.user.roles.map(role => role.name);
      if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
        const updatedPaymentDetail = await paymentDetailController.UpdatePaymentDetail(req.params.id, {
          status: req.body.status
        });
        CreateSuccessRes(res, 200, updatedPaymentDetail);
      } else {
        throw new Error('Bạn không có quyền cập nhật trạng thái thanh toán');
      }
    } catch (error) {
      next(error);
    }
  });
  

// Xóa chi tiết thanh toán (Chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async (req, res, next) => {
  try {
    const result = await paymentDetailController.DeletePaymentDetail(req.params.id);
    CreateSuccessRes(res, 200, result);
  } catch (error) {
    next(error);
  }
});

// Lấy chi tiết thanh toán theo người dùng
router.get('/user/:userId', check_authentication, async (req, res, next) => {
  try {
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

module.exports = router;
