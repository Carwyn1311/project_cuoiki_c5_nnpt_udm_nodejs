var express = require('express');
var router = express.Router();
var cityController = require('../controllers/cities');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
var { check_authentication, check_authorization } = require('../utils/check_auth');
var constants = require('../utils/constants');

// Lấy danh sách tất cả thành phố (public)
router.get('/', async function(req, res, next) {
    try {
        const cities = await cityController.GetAllCities();
        CreateSuccessRes(res, 200, cities);
    } catch (error) {
        next(error);
    }
});

// Lấy chi tiết một thành phố (public)
router.get('/:id', async function(req, res, next) {
    try {
        const city = await cityController.GetCityById(req.params.id);
        CreateSuccessRes(res, 200, city);
    } catch (error) {
        next(error);
    }
});

// Tạo thành phố mới (chỉ Admin)
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const newCity = await cityController.CreateCity(req.body.name, req.body.description, req.body.province_id);
        CreateSuccessRes(res, 201, newCity);
    } catch (error) {
        next(error);
    }
});

// Cập nhật thành phố (chỉ Admin)
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const updatedCity = await cityController.UpdateCity(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedCity);
    } catch (error) {
        next(error);
    }
});

// Xóa thành phố (chỉ Admin)
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
    try {
        const result = await cityController.DeleteCity(req.params.id);
        CreateSuccessRes(res, 200, result);
    } catch (error) {
        next(error);
    }
});

// Lấy thành phố theo tỉnh (public)
router.get('/province/:provinceId', async function(req, res, next) {
    try {
        const cities = await cityController.GetCitiesByProvince(req.params.provinceId);
        CreateSuccessRes(res, 200, cities);
    } catch (error) {
        next(error);
    }
});

module.exports = router;