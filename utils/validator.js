let { body, validationResult } = require('express-validator');
const { ERROR_USERNAME, ERROR_EMAIL, ERROR_PASSWORD } = require('./constants');
let util = require('util');
let { CreateSuccessRes, CreateErrorRes } = require('./ResHandler');

let constants = require('./constants');
let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
};

module.exports = {
    // Hàm kiểm tra lỗi trong request
    validate: function (req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            CreateErrorRes(res, 404, errors.array());
        } else {
            next();
        }
    },

    // Hàm validate đăng ký người dùng
    validationSignUp: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(util.format(ERROR_PASSWORD,
            options.password.minLength,
            options.password.minLowercase,
            options.password.minUppercase,
            options.password.minNumbers,
            options.password.minSymbols,
        )),
        body("email").isEmail().withMessage(constants.ERROR_EMAIL)
    ],

    // Hàm validate khi tạo người dùng mới
    validationCreateUser: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(ERROR_PASSWORD),
        body("email").isEmail().withMessage(constants.ERROR_EMAIL),
        body('role').isIn(['user', 'admin', 'mod']).withMessage("Role không hợp lệ")
    ],

    // Hàm validate khi thay đổi mật khẩu
    validationChangePassword: [
        body("password").isStrongPassword(options.password).withMessage(ERROR_PASSWORD)
    ],

    // Hàm validate khi đăng nhập
    validationLogin: [
        body("password").isStrongPassword(options.password).withMessage("Tên người dùng hoặc mật khẩu không đúng")
    ],

    // Hàm validate số lượng chỗ ngồi khi đặt tour
    validateBooking: [
        body('seatsBooked').custom((value, { req }) => {
            const availableSeats = req.body.availableSeats;  // lấy số lượng chỗ ngồi còn lại từ request
            if (value > availableSeats) {
                throw new Error("Số lượng chỗ ngồi không đủ.");
            }
            return true;
        })
    ]
};
