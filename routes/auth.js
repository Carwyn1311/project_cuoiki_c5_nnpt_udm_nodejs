var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let { check_authentication } = require('../utils/check_auth');
let bcrypt = require('bcrypt');
let { validate, validationLogin, validationSiginUp } = require('../utils/validator');
let crypto = require('crypto');
let mailer = require('../utils/mailer');

// Login route
router.post('/login', validationLogin, validate, async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userController.Login(username, password);
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY);
        CreateSuccessRes(res, 200, { token, user: { 
            id: result._id,
            username: result.username,
            email: result.email,
            fullname: result.fullname,
            roles: result.roles.map(role => role.name)
        }});
    } catch (error) {
        next(error);
    }
});

// Signup route
router.post('/signup', validationSiginUp, validate, async function (req, res, next) {
    try {
        let { username, password, email, fullname, phone } = req.body;
        let result = await userController.CreateAnUser(username, password, email, 'User');
        
        // Cập nhật thông tin thêm nếu có
        if (fullname || phone) {
            let updateData = {};
            if (fullname) updateData.fullname = fullname;
            if (phone) updateData.phone = phone;
            
            await userController.UpdateUser(result._id, updateData);
        }
        
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY);
        
        CreateSuccessRes(res, 201, { token, user: { 
            id: result._id,
            username: result.username,
            email: result.email,
            fullname: result.fullname || '',
            roles: ['User']
        }});
    } catch (error) {
        next(error);
    }
});

// Get current user
router.get("/me", check_authentication, async function (req, res, next) {
    try {
        // Lấy thông tin user mới nhất từ database
        const user = await userController.GetUserById(req.user._id);
        
        // Trả về thông tin cần thiết
        CreateSuccessRes(res, 200, {
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            address: user.address,
            avata: user.avata,
            date_year: user.date_year,
            roles: user.roles.map(role => role.name)
        });
    } catch (error) {
        next(error);
    }
});

// Change password
router.post('/changepassword', check_authentication, async function (req, res, next) {
    try {
        let { oldpassword, newpassword } = req.body;
        
        // Kiểm tra password cũ
        const isMatch = await bcrypt.compare(oldpassword, req.user.password);
        if (!isMatch) {
            throw new Error("Mật khẩu cũ không chính xác");
        }
        
        // Cập nhật password mới
        let user = req.user;
        user.password = newpassword;
        await user.save();
        
        CreateSuccessRes(res, 200, { message: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
});

// Forgot password - gửi mã xác minh
router.post('/forgotpassword', async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new Error("Email không được để trống");
        }
        
        const user = await userController.GetUserByEmail(email);
        
        // Tạo mã xác minh và lưu trữ tạm thời
        const verificationCode = crypto.randomBytes(3).toString('hex'); // Mã 6 ký tự
        user.tokenResetPassword = verificationCode;
        user.tokenResetPasswordExp = Date.now() + 10 * 60 * 1000;  // Mã hết hạn trong 10 phút
        await user.save();

        // Gửi mã xác minh qua email
        await mailer.sendVerificationCode(email, verificationCode);

        CreateSuccessRes(res, 200, { message: "Mã xác minh đã được gửi đến email của bạn" });
    } catch (error) {
        next(error);
    }
});

// Verify code - xác minh mã xác minh
router.post('/verify-code', async (req, res, next) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            throw new Error("Email và mã xác minh không được để trống");
        }
        
        const user = await userController.GetUserByEmail(email);
        if (!user || user.tokenResetPassword !== code || user.tokenResetPasswordExp < Date.now()) {
            throw new Error("Mã xác minh không hợp lệ hoặc đã hết hạn");
        }

        // Token hợp lệ, tạo JWT token mới để reset mật khẩu
        const token = jwt.sign({ id: user._id }, constants.SECRET_KEY, { expiresIn: '1h' });
        CreateSuccessRes(res, 200, { message: "Xác minh thành công", token });
    } catch (error) {
        next(error);
    }
});

// Reset password - đặt lại mật khẩu sau khi xác minh mã
router.post('/resetpassword/:token', async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            throw new Error("Mật khẩu mới không được để trống");
        }

        // Giải mã token để lấy ID người dùng
        const decoded = jwt.verify(token, constants.SECRET_KEY);
        const user = await userController.GetUserById(decoded.id);
        
        // Cập nhật mật khẩu người dùng
        user.password = newPassword; // Sẽ được hash trong pre-save hook
        user.tokenResetPassword = undefined;
        user.tokenResetPasswordExp = undefined;
        await user.save();

        CreateSuccessRes(res, 200, { message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
});

// Verify token - kiểm tra tính hợp lệ của token
router.post('/verify-token', (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new Error("Token không được để trống");
        }
        
        const decoded = jwt.verify(token, constants.SECRET_KEY);
        CreateSuccessRes(res, 200, { valid: true, userId: decoded.id });
    } catch (error) {
        // Không gọi next(error) vì đây là kiểm tra token, trả về false nếu không hợp lệ
        CreateSuccessRes(res, 200, { valid: false });
    }
});

// Update profile - cập nhật thông tin cá nhân
router.put('/profile', check_authentication, async function (req, res, next) {
    try {
        const { fullname, phone, address } = req.body;
        const updateData = {};
        
        if (fullname) updateData.fullname = fullname;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        
        const updatedUser = await userController.UpdateUser(req.user._id, updateData);
        
        CreateSuccessRes(res, 200, {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            fullname: updatedUser.fullname,
            phone: updatedUser.phone,
            address: updatedUser.address,
            avata: updatedUser.avata
        });
    } catch (error) {
        next(error);
    }
});

// Logout - Đăng xuất
router.post('/logout', (req, res) => {
    // Không có yêu cầu backend cụ thể để xử lý logout trong Node.js.
    // Thông thường, frontend sẽ xóa token hoặc làm cho token hết hiệu lực.
    CreateSuccessRes(res, 200, { message: "Đăng xuất thành công" });
});

module.exports = router;