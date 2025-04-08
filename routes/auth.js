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

// Forgot password
router.post('/forgotpassword', async function (req, res, next) {
    try {
        let email = req.body.email;
        let user = await userController.GetUserByEmail(email);
        if (user) {
            user.tokenResetPassword = crypto.randomBytes(24).toString('hex');
            user.tokenResetPasswordExp = (new Date(Date.now() + 10 * 60 * 1000)).getTime();
            await user.save();
            let URLReset = `http://localhost:3000/auth/resetpassword/${user.tokenResetPassword}`;
            await mailer.sendmailFrogetPass(user.email, URLReset);
            CreateSuccessRes(res, 200, { url: URLReset });
        } else {
            throw new Error("Email not found");
        }
    } catch (error) {
        next(error);
    }
});

// Reset password
router.post('/resetpassword/:token', async function (req, res, next) {
    try {
        let token = req.params.token;
        let user = await userController.GetUserByToken(token);
        if (user) {
            if (user.tokenResetPasswordExp > Date.now()) {
                let password = req.body.password;
                user.password = password;
                user.tokenResetPassword = null;
                user.tokenResetPasswordExp = null;
                await user.save();
                CreateSuccessRes(res, 200, user);
            } else {
                throw new Error("Token expired");
            }
        } else {
            throw new Error("Email not found");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
