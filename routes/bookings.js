var express = require('express');
var router = express.Router();
var bookingController = require('../controllers/bookings');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication } = require('../utils/check_auth');
var mailer = require('../utils/mailer');
var Destination = require('../schemas/destinations');

// Lấy danh sách tất cả đơn đặt vé (Admin và CSKH)
router.get('/', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const bookings = await bookingController.GetAllBookings();
            CreateSuccessRes(res, 200, bookings);
        } else {
            throw new Error('Bạn không có quyền xem danh sách đơn đặt vé');
        }
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một đơn đặt vé
router.get('/:id', check_authentication, async function(req, res, next) {
    try {
        const booking = await bookingController.GetBookingById(req.params.id);
        
        // Kiểm tra quyền: Admin, CSKH hoặc chính người đặt
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH') || booking.user_id.toString() === req.user._id.toString()) {
            CreateSuccessRes(res, 200, booking);
        } else {
            throw new Error('Bạn không có quyền xem đơn đặt vé này');
        }
    } catch (error) {
        next(error);
    }
});

// Tạo đơn đặt vé mới
router.post('/', check_authentication, async function(req, res, next) {
    try {
        const { destination_id, adult_tickets, child_tickets, days } = req.body;
        
        // Kiểm tra điểm đến
        const destination = await Destination.findById(destination_id);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }

        // Nếu là Admin hoặc CSKH, có thể đặt vé cho người khác
        const userRoles = req.user.roles.map(role => role.name);
        let newBooking;
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            // Sử dụng user_id từ request body nếu có
            const userId = req.body.user_id || req.user._id;
            const bookingData = {
                destination_id,
                adult_tickets,
                child_tickets,
                days,
                user_id: userId
            };
            newBooking = await bookingController.CreateBooking(bookingData);
        } else {
            // Người dùng thường chỉ có thể đặt vé cho chính mình
            const bookingData = {
                destination_id,
                adult_tickets,
                child_tickets,
                days,
                user_id: req.user._id
            };
            newBooking = await bookingController.CreateBooking(bookingData);
        }
        
        // Gửi email xác nhận đặt tour
        await mailer.sendBookingConfirmation(req.user.email, {
            id: newBooking._id.toString(),
            destinationName: destination.name,
            bookingDate: newBooking.createdAt,
            adultTickets: newBooking.adult_tickets,
            childTickets: newBooking.child_tickets,
            days: newBooking.days,
            totalAmount: (adult_tickets * 100000 + child_tickets * 50000), // Giả định giá vé
            status: newBooking.status
        });
        
        CreateSuccessRes(res, 201, newBooking);
    } catch (error) {
        next(error);
    }
});

// Cập nhật đơn đặt vé
router.put('/:id', check_authentication, async function(req, res, next) {
    try {
        const booking = await bookingController.GetBookingById(req.params.id);
        // Kiểm tra quyền: Admin, CSKH hoặc chính người đặt (nếu đơn chưa được xác nhận)
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const updatedBooking = await bookingController.UpdateBooking(req.params.id, req.body);
            CreateSuccessRes(res, 200, updatedBooking);
        } else if (booking.user_id.toString() === req.user._id.toString() && booking.status === 'pending') {
            const updatedBooking = await bookingController.UpdateBooking(req.params.id, req.body);
            CreateSuccessRes(res, 200, updatedBooking);
        } else {
            throw new Error('Bạn không có quyền cập nhật đơn đặt vé này hoặc đơn đã được xác nhận');
        }
    } catch (error) {
        next(error);
    }
});

// Xóa đơn đặt vé
router.delete('/:id', check_authentication, async function(req, res, next) {
    try {
        const booking = await bookingController.GetBookingById(req.params.id);
        
        // Kiểm tra quyền: Admin, CSKH hoặc chính người đặt (nếu đơn chưa được xác nhận)
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const result = await bookingController.DeleteBooking(req.params.id);
            CreateSuccessRes(res, 200, result);
        } else if (booking.user_id.toString() === req.user._id.toString() && booking.status === 'pending') {
            const result = await bookingController.DeleteBooking(req.params.id);
            CreateSuccessRes(res, 200, result);
        } else {
            throw new Error('Bạn không có quyền xóa đơn đặt vé này hoặc đơn đã được xác nhận');
        }
    } catch (error) {
        next(error);
    }
});

// Cập nhật trạng thái đơn đặt vé (Admin và CSKH)
router.put('/:id/status', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const updatedBooking = await bookingController.UpdateBookingStatus(req.params.id, req.body.status);
            CreateSuccessRes(res, 200, updatedBooking);
        } else {
            throw new Error('Bạn không có quyền cập nhật trạng thái đơn đặt vé');
        }
    } catch (error) {
        next(error);
    }
});

// Lấy đơn đặt vé theo người dùng
router.get('/user/:userId', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin, CSKH hoặc chính người đặt
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH') || req.params.userId === req.user._id.toString()) {
            const bookings = await bookingController.GetBookingsByUser(req.params.userId);
            CreateSuccessRes(res, 200, bookings);
        } else {
            throw new Error('Bạn không có quyền xem đơn đặt vé của người dùng này');
        }
    } catch (error) {
        next(error);
    }
});

// Lấy đơn đặt vé theo trạng thái (Admin và CSKH)
router.get('/status/:status', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: Admin hoặc CSKH
        const userRoles = req.user.roles.map(role => role.name);
        if (userRoles.includes('Admin') || userRoles.includes('CSKH')) {
            const bookings = await bookingController.GetBookingsByStatus(req.params.status);
            CreateSuccessRes(res, 200, bookings);
        } else {
            throw new Error('Bạn không có quyền xem danh sách đơn đặt vé theo trạng thái');
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;