var express = require('express');
var router = express.Router();
var userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả người dùng (chỉ Admin)
router.get('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const users = await userController.GetAllUsers();
        CreateSuccessRes(res, 200, users);
    } catch (error) {
        next(error);
    }
});

// Lấy thông tin người dùng theo ID
router.get('/:id', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: chỉ Admin hoặc chính người dùng đó mới có thể xem thông tin
        if (req.user.roles.some(role => role.name === 'Admin') || req.user._id.toString() === req.params.id) {
            const user = await userController.GetUserById(req.params.id);
            CreateSuccessRes(res, 200, user);
        } else {
            throw new Error('Bạn không có quyền xem thông tin này');
        }
    } catch (error) {
        next(error);
    }
});

// Cập nhật thông tin người dùng
router.put('/:id', check_authentication, async function(req, res, next) {
    try {
        // Kiểm tra quyền: chỉ Admin hoặc chính người dùng đó mới có thể cập nhật thông tin
        if (req.user.roles.some(role => role.name === 'Admin') || req.user._id.toString() === req.params.id) {
            const updatedUser = await userController.UpdateUser(req.params.id, req.body);
            CreateSuccessRes(res, 200, updatedUser);
        } else {
            throw new Error('Bạn không có quyền cập nhật thông tin này');
        }
    } catch (error) {
        next(error);
    }
});

// Cập nhật vai trò người dùng (chỉ Admin)
router.put('/:id/roles', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedUser = await userController.UpdateUserRole(req.params.id, req.body.roles);
        CreateSuccessRes(res, 200, updatedUser);
    } catch (error) {
        next(error);
    }
});

// Xóa người dùng (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await userController.DeleteUser(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;