var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả vai trò (chỉ Admin)
router.get('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const roles = await roleController.GetAllRoles();
        CreateSuccessRes(res, 200, roles);
    } catch (error) {
        next(error);
    }
});

// Tạo vai trò mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newRole = await roleController.CreateRole(req.body.name);
        CreateSuccessRes(res, 201, newRole);
    } catch (error) {
        next(error);
    }
});

// Cập nhật vai trò (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedRole = await roleController.UpdateRole(req.params.id, req.body.name);
        CreateSuccessRes(res, 200, updatedRole);
    } catch (error) {
        next(error);
    }
});

// Xóa vai trò (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await roleController.DeleteRole(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

router.post('/seed-role', async function(req, res, next) {
    try {
        const newRole = await roleController.CreateRole("CSKH");
        CreateSuccessRes(res, 201, newRole);
    } catch (error) {
        next(error);
    }
});
module.exports = router;