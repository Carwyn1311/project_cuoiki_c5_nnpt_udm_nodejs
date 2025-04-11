let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let userController = require('../controllers/users')

module.exports = {
    check_authentication: async function (req, res, next) {
        if (!req.header || !req.headers.authorization) {
            throw new Error("Bạn chưa đăng nhập")
        }
        let authorization = req.headers.authorization;
        if (authorization.startsWith("Bearer")) {
            let token = authorization.split(" ")[1];
            let result = jwt.verify(token, constants.SECRET_KEY);
            if (result) {
                let id = result.id;
                let user = await userController.GetUserById(id);
                req.user = user;
                next();
            }
        } else {
            throw new Error("Bạn chưa đăng nhập")
        }
    },
    check_authorization: function (requiredRoles) {
        return function (req, res, next) {
            const userRoles = req.user.roles.map(role => role.name);
            
            // Kiểm tra xem người dùng có vai trò nào trong danh sách requiredRoles không
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            
            if (hasRequiredRole) {
                next();
            } else {
                throw new Error("Bạn không có quyền thực hiện hành động này")
            }
        }
    }
}