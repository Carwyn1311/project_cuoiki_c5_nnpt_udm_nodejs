var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let { check_authentication } = require('../utils/check_auth');
let bcrypt = require('bcrypt');
let { validate, validationSiginUp } = require('../utils/validator');
let crypto = require('crypto');
let mailer = require('../utils/mailer');

// Login route
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userController.Login(username, password);
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY);
        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error);
    }
});

// Signup route
router.post('/signup', validationSiginUp, validate, async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let result = await userController.CreateAnUser(username, password, email, 'user');
        let token = jwt.sign({
            id: result._id,
            expire: new Date(Date.now() + 24 * 3600 * 1000)
        }, constants.SECRET_KEY);
        CreateSuccessRes(res, 200, token);
    } catch (error) {
        next(error);
    }
});

// Get current user
router.get("/me", check_authentication, async function (req, res, next) {
    CreateSuccessRes(res, 200, req.user);
});

// Change password
router.post('/changepassword', check_authentication, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;
    if (bcrypt.compareSync(oldpassword, req.user.password)) {
        let user = req.user;
        user.password = newpassword;
        await user.save();
        CreateSuccessRes(res, 200, user);
    } else {
        next(new Error("Old password is incorrect"));
    }
});

// Forgot password - gửi mã xác minh
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    try {
        const user = await userController.GetUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        // Tạo mã xác minh và lưu trữ tạm thời
        const verificationCode = crypto.randomBytes(6).toString('hex');
        user.tokenResetPassword = verificationCode;
        user.tokenResetPasswordExp = Date.now() + 10 * 60 * 1000;  // Mã hết hạn trong 10 phút
        await user.save();

        // Gửi mã xác minh qua email
        await mailer.sendVerificationCode(email, verificationCode);

        return res.status(200).json({ success: true, message: 'Verification code sent successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error sending verification code: ' + error.message });
    }
});

// Verify code - xác minh mã xác minh
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and code are required' });
    }
    try {
        const user = await userController.GetUserByEmail(email);
        if (!user || user.tokenResetPassword !== code || user.tokenResetPasswordExp < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Token hợp lệ, tạo JWT token mới để reset mật khẩu
        const token = jwt.sign({ id: user._id }, constants.SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ success: true, message: 'Verification successful', token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error verifying code: ' + error.message });
    }
});

// Reset password - đặt lại mật khẩu sau khi xác minh mã
router.post('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ success: false, message: 'New password is required' });
    }

    try {
        // Giải mã token để lấy ID người dùng
        const decoded = jwt.verify(token, constants.SECRET_KEY);
        const user = await userRepository.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Cập nhật mật khẩu người dùng
        user.password = bcrypt.hashSync(newPassword, 10); // Mã hóa mật khẩu mới
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error resetting password: ' + error.message });
    }
});

// Verify token - kiểm tra tính hợp lệ của token
router.post('/verify-token', (req, res) => {
    const { token } = req.body;
    try {
        const isValid = jwt.verify(token, constants.SECRET_KEY);
        return res.status(200).json({ success: true, message: 'Token is valid' });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

// Logout - Đăng xuất
router.post('/logout', (req, res) => {
    // Không có yêu cầu backend cụ thể để xử lý logout trong Node.js.
    // Thông thường, frontend sẽ xóa token hoặc làm cho token hết hiệu lực.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
