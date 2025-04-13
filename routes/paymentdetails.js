const express = require('express');
const router = express.Router();
const paymentDetailController = require('../controllers/paymentdetails');
const { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');
const mailer = require('../utils/mailer');
const Booking = require('../schemas/Bookings');
const Destination = require('../schemas/destinations');

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

        // Kiểm tra booking_id có được cung cấp không
        if (!req.body.booking_id) {
            return CreateErrorRes(res, 400, new Error('ID đơn đặt vé không được để trống'));
        }

        // Lấy thông tin Booking
        const booking = await Booking.findById(req.body.booking_id);
        if (!booking) {
            return CreateErrorRes(res, 400, new Error('Đơn đặt vé không tồn tại'));
        }

        // Lấy thông tin Destination từ Booking
        const destination = await Destination.findById(booking.destination_id);
        if (!destination) {
            return CreateErrorRes(res, 400, new Error('Điểm đến không tồn tại'));
        }

        // Tính tổng tiền dựa trên số vé và giá vé từ Destination
        const calculatedAmount = booking.adult_tickets * destination.adult_price + booking.child_tickets * destination.child_price;

        // Nếu client gửi amount, kiểm tra xem có khớp không
        if (req.body.amount && req.body.amount !== calculatedAmount) {
            return CreateErrorRes(res, 400, new Error(`Số tiền không hợp lệ. Số tiền phải là ${calculatedAmount} VND dựa trên số vé và giá vé của điểm đến`));
        }

        // Nếu là Admin hoặc CSKH, có thể tạo thanh toán cho người khác
        const userRoles = req.user.roles.map(role => role.name);
        let newPaymentDetail;
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const userId = req.body.user_id || req.user._id;
            const paymentData = {
                ...req.body,
                user_id: userId,
                amount: calculatedAmount // Ghi đè amount bằng giá trị tính toán
            };
            newPaymentDetail = await paymentDetailController.CreatePaymentDetail(paymentData);
        } else {
            // Người dùng thường chỉ có thể tạo thanh toán cho chính mình
            if (booking.user_id.toString() !== req.user._id.toString()) {
                return CreateErrorRes(res, 403, new Error('Bạn chỉ được phép tạo thanh toán cho đơn đặt vé của chính mình'));
            }
            const paymentData = {
                ...req.body,
                user_id: req.user._id,
                amount: calculatedAmount // Ghi đè amount bằng giá trị tính toán
            };
            newPaymentDetail = await paymentDetailController.CreatePaymentDetail(paymentData);
        }

        CreateSuccessRes(res, 201, newPaymentDetail);
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
                status: req.body.status,
                payment_date: req.body.status === 'completed' ? new Date() : undefined
            });
            
            // Nếu trạng thái là "completed", gửi email xác nhận thanh toán
            if (req.body.status === 'completed') {
                const booking = await Booking.findById(updatedPaymentDetail.booking_id).populate('user_id');
                if (!booking) {
                    throw new Error('Đơn đặt tour không tồn tại');
                }
                await mailer.sendPaymentConfirmation(booking.user_id.email, {
                    invoiceCode: updatedPaymentDetail._id.toString(),
                    bookingId: updatedPaymentDetail.booking_id.toString(),
                    paymentDate: updatedPaymentDetail.payment_date,
                    amount: updatedPaymentDetail.amount,
                    paymentMethod: updatedPaymentDetail.payment_method,
                    status: updatedPaymentDetail.status
                });
            }
            
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