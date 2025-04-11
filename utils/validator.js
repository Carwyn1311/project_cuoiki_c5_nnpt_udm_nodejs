const { body, validationResult } = require('express-validator');
const constants = require('./constants');

module.exports = {
    // Middleware kiểm tra lỗi từ express-validator
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
    
    // Validation cho đăng ký
    validationSiginUp: [
        body('username')
            .notEmpty().withMessage('Username không được để trống')
            .isLength({ min: 3 }).withMessage('Username phải có ít nhất 3 ký tự')
            .matches(/^[a-zA-Z0-9_]+$/).withMessage(constants.ERROR_USERNAME),
            
        body('password')
            .notEmpty().withMessage('Password không được để trống')
            .isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
            .withMessage('Password phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số'),
            
        body('email')
            .notEmpty().withMessage('Email không được để trống')
            .isEmail().withMessage(constants.ERROR_EMAIL)
    ],
    
    // Validation cho đăng nhập
    validationLogin: [
        body('username')
            .notEmpty().withMessage('Username không được để trống'),
            
        body('password')
            .notEmpty().withMessage('Password không được để trống')
    ],
    
    // Validation cho tạo tour
    validationCreateDestination: [
        body('name')
            .notEmpty().withMessage('Tên tour không được để trống')
            .isLength({ min: 3, max: 255 }).withMessage('Tên tour phải từ 3 đến 255 ký tự'),
            
        body('description')
            .notEmpty().withMessage('Mô tả không được để trống'),
            
        body('location')
            .notEmpty().withMessage('Địa điểm không được để trống'),
            
        body('province_id')
            .notEmpty().withMessage('Tỉnh không được để trống'),
            
        body('city_id')
            .notEmpty().withMessage('Thành phố không được để trống')
    ],
    
    // Validation cho tạo booking
    validationCreateBooking: [
        body('adult_tickets')
            .notEmpty().withMessage('Số vé người lớn không được để trống')
            .isInt({ min: 1 }).withMessage('Số vé người lớn phải là số nguyên và lớn hơn 0'),
            
        body('child_tickets')
            .isInt({ min: 0 }).withMessage('Số vé trẻ em phải là số nguyên và không âm'),
            
        body('days')
            .notEmpty().withMessage('Số ngày không được để trống')
            .isInt({ min: 1 }).withMessage('Số ngày phải là số nguyên và lớn hơn 0'),
            
        body('destination_id')
            .notEmpty().withMessage('ID điểm đến không được để trống')
    ],
    
    // Validation cho tạo đánh giá
    validationCreateReview: [
        body('rating')
            .notEmpty().withMessage('Đánh giá không được để trống')
            .isInt({ min: 1, max: 5 }).withMessage('Đánh giá phải từ 1 đến 5 sao'),
            
        body('destination_id')
            .notEmpty().withMessage('ID điểm đến không được để trống')
    ],
    
    // Validation cho tạo lịch trình
    validationCreateItinerary: [
        body('start_date')
            .notEmpty().withMessage('Ngày bắt đầu không được để trống')
            .isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
            
        body('end_date')
            .notEmpty().withMessage('Ngày kết thúc không được để trống')
            .isISO8601().withMessage('Ngày kết thúc không hợp lệ')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.start_date)) {
                    throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
                }
                return true;
            }),
            
        body('destination_id')
            .notEmpty().withMessage('ID điểm đến không được để trống')
    ],
    
    // Validation cho tạo hoạt động
    validationCreateActivity: [
        body('activity_name')
            .notEmpty().withMessage('Tên hoạt động không được để trống'),
            
        body('start_time')
            .notEmpty().withMessage('Thời gian bắt đầu không được để trống')
            .isISO8601().withMessage('Thời gian bắt đầu không hợp lệ'),
            
        body('end_time')
            .notEmpty().withMessage('Thời gian kết thúc không được để trống')
            .isISO8601().withMessage('Thời gian kết thúc không hợp lệ')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.start_time)) {
                    throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
                }
                return true;
            }),
            
        body('itinerary_id')
            .notEmpty().withMessage('ID lịch trình không được để trống')
    ],
    
    // Validation cho tạo thanh toán
    validationCreatePayment: [
        body('amount')
            .notEmpty().withMessage('Số tiền không được để trống')
            .isFloat({ min: 0 }).withMessage('Số tiền phải là số dương'),
            
        body('booking_id')
            .notEmpty().withMessage('ID đơn đặt vé không được để trống')
    ]
};