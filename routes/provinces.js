var express = require('express');
var router = express.Router();
var provinceController = require('../controllers/provinces');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả tỉnh (public)
router.get('/', async function(req, res, next) {
    try {
        const provinces = await provinceController.GetAllProvinces();
        CreateSuccessRes(res, 200, provinces);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một tỉnh (public)
router.get('/:id', async function(req, res, next) {
    try {
        const province = await provinceController.GetProvinceById(req.params.id);
        CreateSuccessRes(res, 200, province);
    } catch (error) {
        next(error);
    }
});

// Tạo tỉnh mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newProvince = await provinceController.CreateProvince(req.body.name, req.body.country);
        CreateSuccessRes(res, 201, newProvince);
    } catch (error) {
        next(error);
    }
});

// Cập nhật tỉnh (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedProvince = await provinceController.UpdateProvince(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedProvince);
    } catch (error) {
        next(error);
    }
});

// Xóa tỉnh (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await provinceController.DeleteProvince(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;