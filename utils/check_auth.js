let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let userController = require('../controllers/users');

module.exports = {
    check_authentication: async function (req, res, next) {
        try {
            // Kiểm tra xem header Authorization có tồn tại không
            if (!req.headers || !req.headers.authorization) {
                return res.status(401).json({ message: "Bạn chưa đăng nhập" });
            }

            let authorization = req.headers.authorization;

            // Kiểm tra định dạng Bearer token
            if (!authorization.startsWith("Bearer")) {
                return res.status(401).json({ message: "Định dạng token không hợp lệ, cần 'Bearer <token>'" });
            }

            // Trích xuất token
            let token = authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Token không được cung cấp" });
            }

            // Xác minh token
            let result = jwt.verify(token, constants.SECRET_KEY);
            if (!result) {
                return res.status(401).json({ message: "Token không hợp lệ" });
            }

            // Lấy thông tin người dùng từ ID trong token
            let id = result.id;
            let user = await userController.GetUserById(id);
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            // Gán thông tin người dùng vào req.user
            req.user = user;
            next();
        } catch (error) {
            // Xử lý lỗi từ jwt.verify hoặc GetUserById
            return res.status(401).json({ message: "Lỗi xác thực", error: error.message });
        }
    },

    check_authorization: function (requiredRoles) {
        return function (req, res, next) {
            try {
                // Kiểm tra xem req.user có tồn tại không
                if (!req.user) {
                    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
                }

                // Lấy danh sách vai trò của người dùng
                const userRoles = req.user.roles ? req.user.roles.map(role => role.name) : [];
                if (!userRoles.length) {
                    return res.status(403).json({ message: "Người dùng không có vai trò nào" });
                }

                // Kiểm tra xem người dùng có vai trò cần thiết không
                const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
                if (!hasRequiredRole) {
                    return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
                }

                next();
            } catch (error) {
                return res.status(500).json({ message: "Lỗi kiểm tra quyền", error: error.message });
            }
        };
    }
};